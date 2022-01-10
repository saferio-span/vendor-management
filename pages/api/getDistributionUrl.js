import axios from 'axios'
import jwt from 'jsonwebtoken'
import Environment from "../../models/envModel"

export default async function handler(req,res)
{
	const { businessId,recordId,payeeRef,logoUrl,envName } = req.body;
    // const cred = credentials.filter((user)=>user.name===envName)
	const cred = await Environment.find({name:envName})
    const apiUrl = cred[0].apiUrl
	const authUrl = cred[0].authUrl
	const clientId = cred[0].clientId
	const clientSecret = cred[0].clientSecret
	const userToken = cred[0].userToken

    const jwsToken = generateJws(clientId,clientSecret,userToken)

    const authOptions = {
		headers: {
			Authentication: jwsToken,
		},
	};
	
	// const authURL = process.env.authUrl
	var accessToken = null

	console.log(`Auth URL : ${authUrl}`)

	//call the auth url using axios
	try {
		const res = await axios.get(authUrl, authOptions);
		accessToken = res.data.AccessToken;
	} catch (err) {
        console.log(`Access Token error`)
		console.log(err);
        accessToken = null
	}

	console.log(`Access token : ${accessToken}`)
	
	if(accessToken != null)
	{
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		};
	
		const endPoint = `${apiUrl}/Form1099NEC/RequestDistURL`;

		try {

			const output = await axios.post(
				endPoint,
				{
                    TaxYear: "2021",
                    RecordId:recordId,
                    Business: {
                        BusinessId :businessId,
                        // PayerRef: payerRef
                     },
                    Recipient: {
                        PayeeRef: payeeRef,
                     },
                     Customization: {
                        BusinessLogoUrl: logoUrl,
                        ReturnUrl: "https://example.com",
                        CancelUrl: "https://example.com",
                        ExpiryTime: "5"
                    }
                },
                options
			);
			
            res.status(200).send(output.data);

		} catch (err) {
            console.log(err.response.data.Errors[0])
            err.response.data.Errors[0].status=202
			res.status(202).send(err.response.data.Errors[0]);
		}	
	}
	else{
		res.status(401).send(`Access token is null`);
	}
}

const generateJws = (clientId,clientSecret,userToken) => {
	// setup the payload with Issuer, Subject, audience and Issued at.
	const payload = {
		iss: clientId,
		sub: clientId,
		aud: userToken,
		iat: Math.floor(new Date().getTime() / 1000)
	};

	return jwt.sign(payload, clientSecret, {
		expiresIn: 216000,
	});
};
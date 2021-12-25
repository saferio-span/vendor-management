import axios from 'axios'
import jwt from 'jsonwebtoken'
import Environment from "../../models/envModel"

export default async function handler(req,res)
{
	const { submissionId,recordId,envName } = req.body;
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
	
		const endPoint = `${apiUrl}/Form1099NEC/RequestPdfUrls`;


		try {

			const output = await axios.post(
				endPoint,
				{
                    SubmissionId: submissionId,
                    RecordIds:[
                     {
                      RecordId: recordId
                     }
                    ],
                    Customization: {
                        TINMaskType: "Both",
                    },
                },
                options
			);
			
            res.status(200).send(output.data);

		} catch (err) {
			res.status(202).send(err);
			// res.status(202).send(err);
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
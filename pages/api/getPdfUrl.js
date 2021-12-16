import axios from 'axios'
import jwt from 'jsonwebtoken'

export default async function handler(req,res)
{

    const cred = {
        name:"Saferio Sandbox",
        clientId:"a0f968c860d96f60",
        clientSecret:"TnUW4joWp3JnyJegUHAQ",
        userToken:"b736720e7db84229a72c4fbbdc72b807",
        environment:"sandbox",
        authUrl: "https://testoauth.expressauth.net/v2/tbsauth",
	    apiUrl: "https://testapi.taxbandits.com/v1.6.1",
    }
    const apiUrl = cred.apiUrl
	const authUrl = cred.authUrl
	const clientId = cred.clientId
	const clientSecret = cred.clientSecret
	const userToken = cred.userToken

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
                    SubmissionId: null,
                    RecordIds:[
                     {
                      RecordId: "9056b604-3cc5-4ab9-8095-9c106b6a7d8e"
                     },
                     {
                      RecordId :"e5df5a0c-df71-44a1-a129-ff8e067fcf4a"
                     },
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
import connectDB from "../../../../config/connectDB";
import jwt from 'jsonwebtoken'
import axios from 'axios'
import {credentials} from "../../../../config/variables"

connectDB()

export default async function handler(req,res)
{

	const cred = credentials.filter((user)=>user.name===req.body.envName)
    const apiUrl = cred[0].apiUrl
	const authURL = cred[0].authUrl
	const clientId = cred[0].clientId
	const clientSecret = cred[0].clientSecret
	const userToken = cred[0].userToken

    const jwsToken = generateJws(clientId,clientSecret,userToken)
	// const jwsToken = generateJws()
	// const apiUrl = global.localStorage.getItem('apiUrl')
	// const authURL = global.localStorage.getItem('authUrl')
    const authOptions = {
		headers: {
			Authentication: jwsToken,
		},
	};
	
	// const authURL = process.env.authUrl
	var accessToken = null

	console.log(`Auth URL : ${authURL}`)

	//call the auth url using axios
	try {
		const res = await axios.get(authURL, authOptions);
		accessToken = res.data.AccessToken;
	} catch (err) {
        console.log(`Access Token error`)
		console.log(err);
        accessToken = null
	}

	console.log(`Access token : ${accessToken}`)

    const options = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	const endPoint = `${apiUrl}/WhCertificate/Get?PayeeRef=${req.query.payeeRef}`;
	console.log(endPoint);
	if(accessToken == null)
	{
		console.log(`Auth Options`)
		console.log(authOptions)
		res.status(401).send(`Access token not set`);
	}

	try {
		const output = await axios.get(
			endPoint,
			options
		);

		res.status(200).send(output.data);
	} catch (err) {
		// console.log(err)
		res.status(err.response.status).send(`Cannot get wh url`);
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



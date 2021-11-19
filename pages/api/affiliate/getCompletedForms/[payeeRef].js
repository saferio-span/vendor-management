import connectDB from "../../../../config/connectDB";
import jwt from 'jsonwebtoken'
import axios from 'axios'

connectDB()

export default async function handler({ query: { payeeRef } },res)
{

	const jwsToken = generateJws()

    const authOptions = {
		headers: {
			Authentication: jwsToken,
		},
	};
	
	const authURL = process.env.authUrl
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

    const options = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	const endPoint = `${process.env.apiUrl}/WhCertificate/Get?PayeeRef=${payeeRef}`;
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

const generateJws = () => {
	//setup the payload with Issuer, Subject, audience and Issued at.
	const payload = {
		iss: process.env.clientID,
		sub: process.env.clientID,
		aud: process.env.userToken,
		iat: Math.floor(new Date().getTime() / 1000),
	};

	return jwt.sign(payload, process.env.clientSectet, {
		expiresIn: 216000,
	});
};



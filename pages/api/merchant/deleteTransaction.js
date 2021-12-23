import connectDB from "../../../config/connectDB";
import jwt from 'jsonwebtoken'
import axios from 'axios'
import {credentials} from "../../../config/variables"
import Environment from "../../../models/envModel"

connectDB()

export default async function handler(req,res)
{

	// const apiUrl = global.localStorage.getItem('apiUrl')
	// const authUrl = global.localStorage.getItem('authUrl')
    const { submissionId,envName } = req.body;

	const cred = await Environment.find({name:req.body.envName})
	// const cred = credentials.filter((user)=>user.name===envName)
    const apiUrl = cred[0].apiUrl
	const authUrl = cred[0].authUrl
	const clientId = cred[0].clientId
	const clientSecret = cred[0].clientSecret
	const userToken = cred[0].userToken

    const jwsToken = generateJws(clientId,clientSecret,userToken)

    // const jwsToken = generateJws()

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

	console.log(`Access Token : ${accessToken}`)

    const options = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	const endPoint = `${apiUrl}/Form1099Transactions?SubmissionId=${submissionId}`;
	console.log(endPoint);
	try {
		const output = await axios.delete(
			endPoint,
			options
		);

		res.status(200).send(output.data);

	} catch (err) {
		console.log(err)
		res.status(err.response.status).send(`Cannot delete transactions`);
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

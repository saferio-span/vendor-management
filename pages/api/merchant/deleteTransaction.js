import connectDB from "../../../config/connectDB";
import jwt from 'jsonwebtoken'
import axios from 'axios'

connectDB()

export default async function handler(req,res)
{

	const apiUrl = global.localStorage.getItem('apiUrl')
	const authUrl = global.localStorage.getItem('authUrl')
    const { submissionId } = req.body;

    const jwsToken = generateJws()

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

const generateJws = () => {
	//setup the payload with Issuer, Subject, audience and Issued at.
	const payload = {
		iss: global.localStorage.getItem('clientId'),
		sub: global.localStorage.getItem('clientId'),
		aud: global.localStorage.getItem('userToken'),
		iat: Math.floor(new Date().getTime() / 1000)
	};

	return jwt.sign(payload, global.localStorage.getItem('clientSecret'), {
		expiresIn: 216000,
	});
};

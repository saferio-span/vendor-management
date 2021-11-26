import connectDB from "../../../config/connectDB";
import Merchant from "../../../models/merchantModel"
import jwt from 'jsonwebtoken'
import moment from 'moment'
import axios from 'axios'
import {credentials} from "../../../config/variables"

connectDB()

export default async function handler(req,res)
{

	// const apiUrl = global.localStorage.getItem('apiUrl')
	// const authUrl = global.localStorage.getItem('authUrl')
    const { businessId,envName } = req.body;
    const cred = credentials.filter((user)=>user.name===envName)
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

	console.log(`Access Token : ${accessToken}`)

    const options = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	const endPoint = `${apiUrl}/Form1099Transactions?BusinessId=${businessId}&TaxYear=2020&Page=1&PageSize=10&TxnFromDate=01-01-2020&TxnToDate=12-30-2021`;
	console.log(endPoint);
	try {
		const output = await axios.get(endPoint,options);

		res.status(200).send(output.data);
	} catch (err) {
		console.log(err)
		res.status(err.response.status).send(`Cannot post transactions`);
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

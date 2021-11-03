import connectDB from "../../../config/connectDB";
import Merchant from "../../../models/merchantModel"
import jwt from 'jsonwebtoken'
import moment from 'moment'
import axios from 'axios'

connectDB()

export default async function handler(req,res)
{

    const { businessId } = req.body;
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

	console.log(`Access Token : ${accessToken}`)

    const options = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	const endPoint = `${process.env.apiUrl}/Form1099Transactions?BusinessId=${businessId}&TaxYear=2020&Page=1&PageSize=10&TxnFromDate=01-01-2020&TxnToDate=12-30-2021`;
	console.log(endPoint);
	try {
		const output = await axios.get(endPoint,options);

		res.status(200).send(output.data);
	} catch (err) {
		console.log(err)
		res.status(err.response.status).send(`Cannot post transactions`);
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

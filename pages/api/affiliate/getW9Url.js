import connectDB from "../../../config/connectDB";
import jwt from 'jsonwebtoken'
import axios from 'axios'

connectDB()

export default async function handler(req,res)
{

    const { payeeId, fullName, address1, address2, city, stateName, zipCd, tinMatch } =
    req.body;
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

	const endPoint = `${process.env.apiUrl}/FormW9/RequestByUrl`;
	console.log(endPoint);
	try {
		const output = await axios.post(
			endPoint,
			{
				Recipient: {
					PayeeRef: payeeId,
					Name: fullName,
					Address: {
						Address1: address1,
						Address2: address2,
						City: city,
						State: stateName,
						ZipCd: zipCd,
					},
					IsTINMatching: tinMatch,
				},
				Customization: {
					BusinessLogoUrl:
						'https://www.spanenterprises.com/Content/Images/span-logo.png',
				},
			},
			options
		);

		res.status(200).send(output.data);
	} catch (err) {

		res.status(err.response.data.StatusCode).send(`Cannot get w9 url`);
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


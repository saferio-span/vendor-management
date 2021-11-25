import connectDB from "../../../config/connectDB";
import jwt from 'jsonwebtoken'
import axios from 'axios'

connectDB()

export default async function handler(req,res)
{

    const { payeeId, fullName, address1, address2, city, stateName, zipCd, tinMatch,businessId,payerRef  } =
    req.body;

	const jwsToken = generateJws()
	const apiUrl = global.localStorage.getItem('apiUrl')
	const authURL = global.localStorage.getItem('authUrl')
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

    const options = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	const endPoint = `${apiUrl}/WhCertificate/RequestByUrl`;
	console.log(endPoint);
	if(accessToken == null)
	{
		console.log(`Auth Options`)
		console.log(authOptions)
		res.status(401).send(`Access token not set`);
	}

	try {
		const output = await axios.post(
			endPoint,
			{
				Requester: {
				  PayerRef: null,
				  BusinessId: req.body.businessId,
				  TIN: null
				},
				Recipient: {
					PayeeRef: payeeId,
					Name: fullName,
					IsForeign: false,
					USAddress: {
						Address1: address1,
						Address2: address2,
						City: city,
						State: stateName,
						ZipCd: zipCd
					},
					ForeignAddress: null,
					IsTINMatching: tinMatch,
				},
				Customization: {
					BusinessLogoUrl:'https://www.spanenterprises.com/Content/Images/span-logo.png',
				},
				RedirectUrls: null
			},
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
	// const payload = {
	// 	iss: process.env.clientID,
	// 	sub: process.env.clientID,
	// 	aud: process.env.userToken,
	// 	iat: Math.floor(new Date().getTime() / 1000),
	// };

	// return jwt.sign(payload, process.env.clientSectet, {
	// 	expiresIn: 216000,
	// });

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


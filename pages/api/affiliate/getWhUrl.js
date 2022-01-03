import connectDB from "../../../config/connectDB";
import jwt from 'jsonwebtoken'
import axios from 'axios'
import {credentials} from "../../../config/variables"
import Environment from "../../../models/envModel"


connectDB()

export default async function handler(req,res)
{

    const { payeeId, fullName, address1, address2, city, stateName, zipCd, tinMatch, businessId, payerRef, envName, returnUrl, successUrl} =
    req.body;
	const cred = await Environment.find({name:req.body.envName})
	console.log(cred)
	// const cred = credentials.filter((user)=>user.name===envName)
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
					IsTINMatching: true,
				},
				Customization: {
					BusinessLogoUrl:'https://www.spanenterprises.com/Content/Images/span-logo.png',
				},
				RedirectUrls: {
					ReturnUrl:successUrl,
					CancelUrl:returnUrl
				}
			},
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



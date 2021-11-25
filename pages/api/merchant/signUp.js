import connectDB from "../../../config/connectDB";
import Merchant from "../../../models/merchantModel"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import axios from 'axios'

connectDB()

export default async function handler(req,res)
{
	const apiUrl = global.localStorage.getItem('apiUrl')
	const authUrl = global.localStorage.getItem('authUrl')
	const envName = global.localStorage.getItem('environmentName')
    const random = Math.floor((Math.random() * 1000000000) + 1);

    var businessID = "";

    const jwsToken = generateJws()

    const authOptions = {
		headers: {
			Authentication: jwsToken,
		},
	};
	

	// const authURL = process.env.authUrl
	var accessToken = null

	// console.log(`Auth URL : ${authUrl}`)

	//call the auth url using axios
	try {
		const res = await axios.get(authUrl, authOptions);
		accessToken = res.data.AccessToken;
	} catch (err) {
        console.log(`Access Token error`)
		console.log(err);
        accessToken = null
	}

    const endPoint = `${apiUrl}/Business/Create`;
	const {
		businessName,
		ein,
		email,
		contactName,
		address1,
		address2,
		city,
		state,
		zip,
	} = req.body;

	const businessObj = {
		BusinessNm:businessName,
		isEIN: true,
		EINorSSN: ein,
		Email:email,
		ContactNm:contactName,
		Phone:"1234567890",
		isBusinessTerminated: false,
		USAddress: {
			Address1:address1,
			Address2:address2,
			City:city,
			State:state,
			ZipCd:zip,
		},
	};

    const options = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};

	try {
		const output = await axios.post(endPoint, businessObj, options);
		businessID = output.data.BusinessId
	} catch (err) {
		console.log(err)
        res.status(err.response.status).send(`Cannot Set business`);
	}

    
    // res.status(200).send(businessID);
    const merchant = new Merchant()
    merchant.businessName = req.body.businessName
    merchant.businessID = businessID
    merchant.ein = req.body.ein
    merchant.address1 = req.body.address1
    merchant.address2 = req.body.address2
    merchant.city = req.body.city
    merchant.state = req.body.state
    merchant.zip = req.body.zip
    merchant.name = req.body.contactName
    merchant.email = req.body.email
    merchant.password = bcrypt.hashSync(req.body.password, 10)
    merchant.payerRef = `Pr${random}`
	merchant.environment = envName

	

    merchant.save((err, userCreated)=>{
        if (err) {
            res.status(401).send(JSON.stringify(err));
        } else {
            userCreated.password = undefined;
            res.status(200).send(userCreated);
        }
    });

    // console.log(`Pr${random}`)
    // console.log(`Sign Up`)
    // console.log(merchant)
    // res.status(200).send(merchant);
}

const generateJws = () => {
	// setup the payload with Issuer, Subject, audience and Issued at.
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

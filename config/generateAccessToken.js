import axios from "axios";
import jwt from 'jsonwebtoken'

const accessToken = async ()=>{

    const payload = {
		iss: process.env.clientID,
		sub: process.env.clientID,
		aud: process.env.userToken,
		iat: Math.floor(new Date().getTime() / 1000),
	};

    console.log("Payload")
    console.log(payload)

	const jwsToken = jwt.sign(payload, process.env.clientSectet, {
		expiresIn: 216000,
	});

    console.log(`JWS Token : ${jwsToken}`)

    const options = {
		headers: {
			Authentication: jwsToken,
		},
	};
	

	const authURL = process.env.authUrl

    console.log(`Auth URL : ${authURL}`)
	console.log(options)
	const accessRes = await axios.get(authURL,{
		"headers": {
            "Connection" :"keep-alive ",
            "Accept": "*/* ",
			"Authentication": jwsToken,
		},
    }
	);
	accessToken = accessRes.data.AccessToken;

    console.log(`Access token : ${accessToken}`)

    return accessToken
}

module.exports = accessToken
import connectDB from "../../config/connectDB";
import jwt from 'jsonwebtoken'
import axios from 'axios'
import Environment from "../../models/envModel"
import PdfUrls from "../../models/1099PdfUrlModel"

connectDB()

export default async function handler(req,res)
{

	// const apiUrl = global.localStorage.getItem('apiUrl')
	// const authUrl = global.localStorage.getItem('authUrl')
    const { submissionId,recordId,envName } = req.body;
    // const cred = credentials.filter((user)=>user.name===envName)
	const cred = await Environment.find({name:envName})
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

	const endPoint = `${apiUrl}/Form1099NEC/GetPdf?SubmissionId=${submissionId}&RecordIds=${recordId}&TINMaskType=UNMASKED`;
	// console.log(endPoint);
	try {
		const output = await axios.get(endPoint,options);

        if(output.data.StatusCode == 200)
        {
			console.log(`RecordId : ${output.data.Form1099NecRecords[0].RecordId}`)
           const pdfData = await PdfUrls.findOne({RecordId:output.data.Form1099NecRecords[0].RecordId})
        //    const pdfData = await res.data
			console.log(`Url data from db`)
           console.log(pdfData)
           res.status(200).send({
			   pdfData:pdfData,
			   recordMessage : output.data.Form1099NecRecords[0]
		   });

        }
	} catch (err) {
		console.log(err)
		res.status(202).send({
			message:`Cannot get pdf`,
			status:202
		});
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

import connectDB from "../../../config/connectDB";
import Transactions from "../../../models/transactionsModel"
import jwt from 'jsonwebtoken'
import moment from 'moment'
import axios from 'axios'
import {credentials} from "../../../config/variables"
import Environment from "../../../models/envModel"
// import { LocalStorage } from "node-localstorage";
// import accessToken from "../../../config/generateAccessToken"

connectDB()
// accessToken()
// var accessTokenKey = accessToken()

export default async function handler(req,res)
{
	// console.log(`Api Url From Local : ${global.localStorage.getItem('apiUrl')}`)
	// console.log(`Auth Url From Local : ${global.localStorage.getItem('authUrl')}`)

	// const apiUrl = global.localStorage.getItem('apiUrl')
	// const authUrl = global.localStorage.getItem('authUrl')

    const { payeeRefs,businessId,payerRef,transactions,envName } = req.body;
	console.log(req.body)

	const data = {}
	data.SubmissionId = null
	data.TxnData=[]
	data.TxnData[0]={}
	data.TxnData[0].Business = {
		PayerRef: null,
		BusinessId: businessId,
		TINType: null,
		TIN: null
	}
	data.TxnData[0].Recipients = []

	payeeRefs.forEach((payee, index)=>{
		const transOfPayee = []
		transactions.forEach(trans=>{
			if(payee==trans.payeeRef)
			{
				transOfPayee.push({
					SequenceId:trans.sequenceId,
					TxnDate: moment(trans.selectedDate).format("MM/DD/YYYY"),
					TxnAmt: trans.amount,
					WHAmt: trans.whAmount == '' ? '0' : trans.whAmount
				})
			}
		})
		const recepientData = {
			PayeeRef: payee,
			RecipientId: null,
			TINType: null,
			TIN: null,
			Txns: transOfPayee
		}
		data.TxnData[0].Recipients.push(recepientData)
	})
	console.log(data)
	// res.status(200).json(data)

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

	console.log(`Access token : ${accessToken}`)
	
	if(accessToken != null)
	{
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		};
	
		const endPoint = `${apiUrl}/Form1099Transactions`;

		let success = false
		// const sequenceID = Math.floor((Math.random() * 1000000000) + 1)
		// console.log(endPoint);

		// console.log(
		// 	{
		// 		PayerRef: null,
		// 		BusinessId: businessId,
		// 		TINType: null,
		// 		TIN: null,
		// 		PayeeRef: payeeRef,	  
		// 		SequenceId: sequenceId,
		// 		TxnDate: moment(selectedDate).format("MM/DD/YYYY"),
		// 		TxnAmt: amount,
		// 		WHAmt: whAmount == "" ? "0" : whAmount		  
		// 	}
		// )
						

		try {

			// await axios.post(
			// 	endPoint,
			// 	{
			// 		SubmissionId: null,
			// 		TxnData: [
			// 		  {
			// 			Business: {
			// 			  PayerRef: null,
			// 			  BusinessId: businessId,
			// 			  TINType: null,
			// 			  TIN: null
			// 			},
			// 			Recipients: [
			// 			  {
			// 				PayeeRef: payeeRef,
			// 				RecipientId: null,
			// 				TINType: null,
			// 				TIN: null,
			// 				Txns: [
			// 				  {
			// 					SequenceId: sequenceId,
			// 					TxnDate: moment(selectedDate).format("MM/DD/YYYY"),
			// 					TxnAmt: amount,
			// 					WHAmt: whAmount == "" ? "0" : whAmount
			// 				  }
			// 				]
			// 			  }
			// 			]
			// 		  }
			// 		]
			// 	  },
			// 	options
			// );

			await axios.post(endPoint,data,options);
			success = true

		} catch (err) {
			console.log(err.response.data.Errors)
			success = false
			console.log(success)
			res.status(202).send(err.response.data.Errors[0]);
			// res.status(202).send(err);
		}

		if(success)
		{
			transactions.forEach(async(trans)=>{
				const transaction = new Transactions()
				transaction.sequenceId = trans.sequenceId
				transaction.txnAmt = trans.amount
				transaction.whAmt = trans.whAmount
				transaction.description = trans.description
				transaction.payeeRef = trans.payeeRef
				transaction.payerRef = payerRef
				transaction.businessId = businessId
				transaction.transactionDate = moment(trans.selectedDate).format("MM/DD/YYYY")

				await transaction.save()
			})
			
			res.status(200).send(data);
			// transaction.save((err, trans)=>{
			// 	if (err) {
			// 		res.status(401).send(err);
			// 	} else {
			// 		res.status(200).send(trans);
			// 	}
			// });

		}	

	}
	else{
		res.status(401).send(`Access token is null`);
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
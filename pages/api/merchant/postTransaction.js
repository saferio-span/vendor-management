import connectDB from "../../../config/connectDB";
import Transactions from "../../../models/transactionsModel"
import jwt from 'jsonwebtoken'
import moment from 'moment'
import axios from 'axios'
// import { LocalStorage } from "node-localstorage";
// import accessToken from "../../../config/generateAccessToken"

connectDB()
// accessToken()
// var accessTokenKey = accessToken()

export default async function handler(req,res)
{
	// console.log(`Api Url From Local : ${global.localStorage.getItem('apiUrl')}`)
	// console.log(`Auth Url From Local : ${global.localStorage.getItem('authUrl')}`)

	const apiUrl = global.localStorage.getItem('apiUrl')
	const authUrl = global.localStorage.getItem('authUrl')

    const { amount,payeeRef,description,businessId,payerRef,selectedDate } = req.body;
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
		// console.log(endPoint);
		// try {
			const sequenceID = Math.floor((Math.random() * 1000000000) + 1)
			const output = await axios.post(
				endPoint,
				{
					SubmissionId: null,
					TxnData: [
					  {
						Business: {
						  PayerRef: null,
						  BusinessId: businessId,
						  TINType: null,
						  TIN: null
						},
						Recipients: [
						  {
							PayeeRef: payeeRef,
							RecipientId: null,
							TINType: null,
							TIN: null,
							Txns: [
							  {
								SequenceId: sequenceID,
								TxnDate: moment(selectedDate).format("MM/DD/YYYY"),
								TxnAmt: amount,
								WHAmt: "0"
							  }
							]
						  }
						]
					  }
					]
				  },
				options
			);

			if(output.status === 200)
			{
				const transaction = new Transactions()
				transaction.sequenceId = sequenceID
				transaction.txnAmt = amount
				transaction.description = description
				transaction.payeeRef = payeeRef
				transaction.payerRef = payerRef
				transaction.businessId = businessId
				transaction.transactionDate = moment(selectedDate).format("MM/DD/YYYY"),
				
				transaction.save((err, trans)=>{
					if (err) {
						res.status(401).send(err);
					} else {
						res.status(200).send(trans);
					}
				});
			}
			else
			{
				res.status(output.response.status).send(output.response.config.data.Errors.Message);
			}
	
		// } catch (err) {
		// 	console.log(err)
		// 	res.status(err.response.status).send(err);
		// }
	}
	else{
		res.status(401).send(`Access token is null`);
	}
}

const generateJws = () => {
	//setup the payload with Issuer, Subject, audience and Issued at.
	// console.log(`Client Id From Local : ${global.localStorage.getItem('clientId')}`)
	// console.log(`Client Secret From Local : ${global.localStorage.getItem('clientSecret')}`)
	// console.log(`User Token From Local : ${global.localStorage.getItem('userToken')}`)
	console.log(`IAT :${Math.floor(new Date().getTime() / 1000)}`)
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

import connectDB from "../../../config/connectDB";
import Transactions from "../../../models/transactionsModel"
import jwt from 'jsonwebtoken'
import moment from 'moment'
import axios from 'axios'

connectDB()

export default async function handler(req,res)
{

    const { amount,payeeRef,description,businessId,payerRef  } = req.body;
	// const random = Math.floor((Math.random() * 1000000000) + 1);
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

	const endPoint = `${process.env.apiUrl}/Form1099Transactions`;
	console.log(endPoint);
	try {
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
                            TxnDate: moment().format("DD/MM/YYYY"),
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

		// res.status(200).send(output.data);

		const transaction = new Transactions()

		transaction.sequenceId = sequenceID
		transaction.txnAmt = amount
		transaction.description = description
		transaction.payeeRef = payeeRef
		transaction.payerRef = payerRef
		transaction.businessId = businessId
		
		transaction.save((err, trans)=>{
			if (err) {
				res.status(401).send(err);
			} else {
				res.status(200).send(trans);
			}
		});



	} catch (err) {
		console.log(err)
		res.status(err.response.status).send(err);
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

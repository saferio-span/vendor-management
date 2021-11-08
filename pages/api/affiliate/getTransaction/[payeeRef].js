import connectDB from "../../../../config/connectDB";
import Transactions from "../../../../models/transactionsModel"

connectDB()

export default async function handler({ query: { payeeRef } },res)
{
	// console.log(payeeRef)
	// res.status(200).send(true);
	try {
		const trans = await Transactions.find({ payeeRef: payeeRef}).sort({ name: 'asc' });
		res.status(200).json(trans);
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}

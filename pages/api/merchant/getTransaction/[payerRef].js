import connectDB from "../../../../config/connectDB";
import Transactions from "../../../../models/transactionsModel"

connectDB()

export default async function handler({ query: { payerRef } },res)
{
	try {
		const trans = await Transactions.find({ payerRef: payerRef}).sort({ name: 'asc' });
		res.status(200).json(trans);
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}

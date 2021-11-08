import connectDB from "../../../config/connectDB";
import Transactions from "../../../models/transactionsModel"

connectDB()

export default async function handler(req,res)
{
	try {
		const trans = await Transactions.find().sort({ name: 'asc' });
		res.status(200).json(trans);
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}

import connectDB from "../../../config/connectDB";
import Merchant from "../../../models/merchantModel"

connectDB()

export default async function handler(req,res)
{
	try {
		const affiliate = await Merchant.find().sort({ name: 'asc' });
		res.status(200).json(affiliate);
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}

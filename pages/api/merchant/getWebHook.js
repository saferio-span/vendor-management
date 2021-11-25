import connectDB from "../../../config/connectDB";
import WhResponse from "../../../models/wHResponseModel"

connectDB()

export default async function handler(req,res)
{
	try {
		const trans = await WhResponse.find().sort({ date: 'desc' });
		res.status(200).json(trans);
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}
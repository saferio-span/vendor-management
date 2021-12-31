import connectDB from "../../../config/connectDB";
import Records1099 from "../../../models/1099RecordsModel"

connectDB()

export default async function handler(req,res)
{
	const envName = req.body.envName
	try {
		const trans = await Records1099.find({environment:envName}).sort({ date: 'desc' });
		res.status(200).json(trans);
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}
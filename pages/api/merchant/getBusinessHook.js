import connectDB from "../../../config/connectDB";
import BusinessComplete from "../../../models/businessCompleteModel"

connectDB()

export default async function handler(req,res)
{
	const envName = req.body.envName
	try {
		const data = await BusinessComplete.find({environment:envName})
		res.status(200).json(data);
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}
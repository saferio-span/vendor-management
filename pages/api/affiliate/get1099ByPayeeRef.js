import connectDB from "../../../config/connectDB";
import Records1099 from "../../../models/1099RecordsModel"

connectDB()

export default async function handler(req,res)
{
	// const envName = req.body.getItem('environmentName')
	try {
		const record = await Records1099.findOne({PayeeRef:req.body.payeeRef})		 
		res.status(200).json(record);
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}

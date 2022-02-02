import connectDB from "../../../config/connectDB";
import Merchant from "../../../models/merchantModel"

connectDB()

export default async function handler(req,res)
{
	const envName = req.body.envName
	console.log(`Env name : ${envName}`);
	let merchant = {}
	try {
		if(envName)
		{
			merchant = await Merchant.find({ environment: envName}).sort({ name: 'asc' });
		}
		else
		{
			merchant = await Merchant.find().sort({ name: 'asc' });
		}
		
		console.log(merchant);
		res.status(200).json(merchant);
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}

import connectDB from "../../config/connectDB";
import Environment from "../../models/envModel"

connectDB()

export default async function handler(req,res)
{
	try {
		const env = await Environment.find({name:req.body.envName,email:req.body.email})
		res.status(200).send(env);
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}

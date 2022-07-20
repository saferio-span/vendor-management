import connectDB from "../../config/connectDB";
import Environment from "../../models/envModel"

connectDB()

export default async function handler(req,res)
{
	const email =  req.body.email
	try {
		if(email !== null)
		{
			const env = await Environment.find({email:email}).sort({ name: 'asc' });
			res.status(200).json(env);
		}
		else
		{
			const env = await Environment.find().sort({ name: 'asc' });
			res.status(200).json(env);
		}
		
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}

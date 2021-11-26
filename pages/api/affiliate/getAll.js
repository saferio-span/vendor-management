import connectDB from "../../../config/connectDB";
import Affiliate from "../../../models/affiliateModel"

connectDB()

export default async function handler(req,res)
{
	// const envName = req.body.getItem('environmentName')
	const envName = req.body.envName
	try {
		const affiliate = await Affiliate.find({environment:envName}).sort({ name: 'asc' }).limit(100);
		res.status(200).json(affiliate);
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}

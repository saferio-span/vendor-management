import connectDB from "../../../config/connectDB";
import PdfUrls from "../../../models/1099PdfUrlModel"

connectDB()

export default async function handler(req,res)
{
	const envName = req.body.envName
	try {
		const data = await PdfUrls.find({environment:envName})
		res.status(200).json(data);
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}
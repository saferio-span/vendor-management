import connectDB from "../../../config/connectDB";
import PdfUrls from "../../../models/1099PdfUrlModel"

connectDB()

export default async function handler(req,res)
{
	const envName = req.body.envName
    const urls = await PdfUrls.find({ environment: envName})
    res.status(200).json(urls);
}

import connectDB from "../../../config/connectDB";
import PdfUrls from "../../../models/1099PdfUrlModel"
connectDB()

export default async function handler(req,res)
{
    const newPdfResponse = new PdfUrls({
		SubmissionId: req.body.SubmissionId,
        RecordId: req.body.Records[0].RecordId,
        FileName: req.body.Records[0].FileName,
        FilePath: req.body.Records[0].FilePath,
        Status: req.body.Records[0].Status,
	});
	console.log("Pdf Store Body")

	console.log(req.body);

	console.log("Pdf Store Body End")
	try {
		const pdfData = await newPdfResponse.save();
		res.status(200).json(pdfData);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server Error');
	}
}
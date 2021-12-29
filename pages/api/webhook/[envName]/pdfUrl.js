import connectDB from "../../../../config/connectDB";
import PdfUrls from "../../../../models/1099PdfUrlModel"
connectDB()

export default async function handler(req,res)
{
	const envName = req.query.envName
	PdfUrls.find({
		RecordId: req.body.Records[0].RecordId
	},async (err,data)=>{
		if (err){
			console.log(err)
			return res.status(401).send('Error occured in checking that the record already exist or not.');
		}
		else
		{
			if(data.length==0)
            {
				const newPdfResponse = new PdfUrls({
					SubmissionId: req.body.SubmissionId,
					RecordId: req.body.Records[0].RecordId,
					FileName: req.body.Records[0].FileName,
					FilePath: req.body.Records[0].FilePath,
					Status: req.body.Records[0].Status,
					environment:envName
				});
				console.log("Pdf Store Body")
			
				console.log(req.body);
			
				console.log("Pdf Store Body End")
				try {
					const pdfData = await newPdfResponse.save();
				} catch (err) {
					console.error(err.message);
					res.status(500).send('server Error');
				}
			}
		}
	})
	res.status(200).json();
}
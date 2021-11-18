import connectDB from "../../../config/connectDB";
import Affiliate from "../../../models/affiliateModel"
import WHResponse from "../../../models/wHResponseModel"
connectDB()

export default async function handler(req,res)
{
    const newWHResponse = new WHResponse({
		...req.body,
	});
	console.log("Wh Store Body")

	console.log(req.body);

	console.log("Wh Store Body End")
	try {
		const whPost = await newWHResponse.save();
        const affiliate = {}
        var payeeRef = ""

        if(req.body.FormType == "FormW9")
        {
            affiliate.w9Status = req.body.FormW9.W9Status
            if(req.body.FormW9.TINMatching != null)
            {
                affiliate.tinMatchingStatus = req.body.FormW9.TINMatching.Status
            }
            affiliate.pdfUrl = req.body.FormW9.PdfUrl
            payeeRef = req.body.FormW9.PayeeRef
        }
        else
        {
            affiliate.w9Status = req.body.FormW8Ben.W8BENStatus
            affiliate.pdfUrl = req.body.FormW8Ben.PdfUrl
            payeeRef = req.body.FormW8Ben.PayeeRef
        }

        console.log(`Update Details`)
        console.log(affiliate)

        await Affiliate.findOneAndUpdate({payeeRef: payeeRef },affiliate,function (err, user) {
            if (err){
                console.log(err)
            }
            else{
                console.log(user)
            }
        }).clone().catch(function(err){ console.log(err)});

		res.status(200).json(whPost);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('server Error');
	}
}
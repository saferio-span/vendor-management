import connectDB from "../../../../config/connectDB";
import Records1099 from "../../../../models/1099RecordsModel"
connectDB()

export default async function handler(req,res)
{
    // const newWHResponse = new WHResponse({
	// 	...req.body,
	// });
	console.log("1099 Store Body")
	console.log(req.body);
	console.log("1099 Store Body End")
    const envName = req.query.envName
    console.log(`Env name : ${envName}`)

    const envName = req.query.envName
    const new1099Response = new Records1099({
		...req.body,
        environment:envName
	});
    const record1099Post = await new1099Response.save();

    // const submissionId = req.body.SubmissionId
    // const businessId = req.body.BusinessId
    // const payerRef = req.body.PayerRef
    // const taxYear = req.body.TaxYear
    // const form1099NECRecords = req.body.Form1099NECRecords
	// try {
        // form1099NECRecords.forEach(async(record)=>{
        //     console.log(`Submission Id : ${submissionId}`)
        //     console.log(`Record Id : ${record.RecordId}`)
        //     const availableHook = await Records1099.find({
        //         SubmissionId:submissionId,
        //         RecordId: record.RecordId
        //     })

        //     console.log(`Records already available start ------------------`)
        //     console.log(availableHook)
        //     console.log(`Records already available end --------------------`)

        //     if(availableHook.length == 0)
        //     {
        //         console.log(`Record not found creating a new one for ${record.RecordId}`)
        //         const new1099Response = new Records1099({
        //             SubmissionId: submissionId,
        //             BusinessId:businessId,
        //             PayerRef:payerRef,
        //             TaxYear:taxYear,
        //             RecordId: record.RecordId,
        //             RecipientId: record.RecipientId,
        //             PayeeRef:record.PayeeRef,
        //             NECBox1:record.NecBox1,
        //             NECBox4:record.NecBox4,
        //             FederalReturnStatus: record.FederalReturn.Status,
        //             FederalReturnStatusTs: record.FederalReturn.StatusTs,
        //             FederalReturnInfo: record.FederalReturn.Info,
        //             environment:envName
        //         });
        //         await new1099Response.save();
        //     }
        //     else
        //     {
        //         await Records1099.findOneAndUpdate({RecordId:record.RecordId},{
        //             FederalReturnStatus: record.FederalReturn.Status,
        //             FederalReturnStatusTs: record.FederalReturn.StatusTs,
        //             FederalReturnInfo: record.FederalReturn.Info
        //         })
        //     }
        // //     ,(err,data)=>{
        // //         if (err){
        // //             console.log(err)
        // //             return res.status(401).send('Error occured in checking that the record already exist or not.');
        // //         }
        // //         else
        // //         {
        // //             if(data.length==0)
        // //             {
        //                 // console.log(`Record not found creating a new one for ${record.RecordId}`)
        //                 // const new1099Response = new Records1099({
        //                 //     SubmissionId: submissionId,
        //                 //     BusinessId:businessId,
        //                 //     PayerRef:payerRef,
        //                 //     TaxYear:taxYear,
        //                 //     RecordId: record.RecordId,
        //                 //     RecipientId: record.RecipientId,
        //                 //     PayeeRef:record.PayeeRef,
        //                 //     NECBox1:record.NecBox1,
        //                 //     NECBox4:record.NecBox4,
        //                 //     FederalReturnStatus: record.FederalReturn.Status,
        //                 //     FederalReturnStatusTs: record.FederalReturn.StatusTs,
        //                 //     FederalReturnInfo: record.FederalReturn.Info,
        //                 //     environment:envName
        //                 // });
        //                 // new1099Response.save();
        // //                 // console.log(`generated Successfully for ${record.RecordId}`)
        // //             }
        // //             else
        // //             {
        //                 // Records1099.findOneAndUpdate({RecordId:record.RecordId},{
        //                 //     FederalReturnStatus: record.FederalReturn.Status,
        //                 //     FederalReturnStatusTs: record.FederalReturn.StatusTs,
        //                 //     FederalReturnInfo: record.FederalReturn.Info
        //                 // })
        // //             }
        // //           } 
        // //     })
        // })
		res.status(200).send(record1099Post);
	// } catch (err) {
	// 	console.error(err.message);
	// 	res.status(500).send('server Error');
	// }
}
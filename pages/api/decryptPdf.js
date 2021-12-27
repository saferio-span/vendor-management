import AWS from "aws-sdk"
import fs from "fs"

export default async function handler(req,res)
{
    const url = req.body.urlLink
    const recordId = req.body.recordId
    const urlParts = url.split('.com/');
    console.log(urlParts[1])
    AWS.config.update({ region: "us-east-1" });// don't change this US-East-01

    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_DECRYPT_ACCESS_KEY,
        secretAccessKey: process.env.AWS_DECRYPT_SECRET_KEY
    });
    
    const ssecKey = Buffer.alloc(32, process.env.BASE_64_PDF_KEY,'base64')// you can get the key from Taxbandits API Console
 
    var params = {
        Key: urlParts[1],// File path without main domain URL.
        Bucket: "expressirsforms",// Get the Bucket Name from the URL given in the response
        SSECustomerAlgorithm: "AES256",
        SSECustomerKey: ssecKey,
    }
    // console.log(params)

    // let data = await s3.getObject(params).promise()
    // console.log(data)

    // const pdfData = s3.getObject(params).createReadStream().pipe()
    // console.log(pdfData)

    s3.getObject(params, function(err, data) {
        // Handle any error and exit
        if (err)
            return err;
    
      // No error happened
      // Convert Body from a Buffer to a String
        let objectData = data.Body.toString('utf-8'); // Use the encoding necessary
    //   console.log(objectData)
    //   fs.writeFileSync('some.pdf', objectData)
        res.status(200).send(data.Body)
    });
    // // console.log(pdfData)
    // var file = fs.createWriteStream(`${recordId}.pdf`);
    // // var file = fs.createWriteStream(`/1099Pdf/${recordId}.pdf`);// save the pdf in local
    // s3.getObject(params).createReadStream().pipe(file);

    // const urlPdf = s3.getSignedUrl('getObject',params)
    // res.status(200).send({
    //     status:200,
    //     url:urlPdf
    // });

    // res.status(200).send()
}
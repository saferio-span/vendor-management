import AWS from "aws-sdk"
import fs from "fs"

export default async function handler(req,res)
{
    const url = req.body.urlLink
    const urlParts = url.split('.com/');
    console.log(urlParts[1])
    AWS.config.update({ region: "us-east-1" });// don't change this US-East-01
    const s3 = new AWS.S3({
    accessKeyId: "AKIA6PCHNKLKXHDR5NS2",
    secretAccessKey: "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"
    });
    const ssecKey = Buffer.alloc(32, "sexwx65Ufr5BuFwMayimLNRM/GcpNvlSv+v+NjEl17w=",'base64')// you can get the key from Taxbandits API Console
 
    var params = {
        Key: urlParts[1],// File path without main domain URL.
        Bucket: "expressirsforms",// Get the Bucket Name from the URL given in the response
        // SSECustomerAlgorithm: "AES256",
        // SSECustomerKey: ssecKey
    }
    console.log(params)

    var file = fs.createWriteStream('samplepdfname.pdf');// save the pdf in local
    s3.getObject(params).createReadStream().pipe(file);
    res.status(200).send();
}
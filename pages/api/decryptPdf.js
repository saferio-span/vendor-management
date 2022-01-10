import AWS from "aws-sdk"
import fs from "fs"
import Environment from "../../models/envModel"

export default async function handler(req,res)
{
    const url = req.body.urlLink
    const recordId = req.body.recordId
    const envName = req.body.envName

    const cred = await Environment.find({name:envName})
    const awsAccessKey = cred[0].awsAccessKey
	const awsSecretKey = cred[0].awsSecretKey
	const pdfKey = cred[0].pdfKey
    const urlParts = url.split('.com/');
    AWS.config.update({ region: "us-east-1" });// don't change this US-East-01

    const s3 = new AWS.S3({
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey
    });
    
    const ssecKey = Buffer.alloc(32, pdfKey,'base64')// you can get the key from Taxbandits API Console
 
    var params = {
        Key: urlParts[1],// File path without main domain URL.
        Bucket: "expressirsforms",// Get the Bucket Name from the URL given in the response
        SSECustomerAlgorithm: "AES256",
        SSECustomerKey: ssecKey,
    }

    s3.getObject(params, function(err, data) {
        // Handle any error and exit
        if (err)
        {
            return err;          
        }
        res.status(200).send(data.Body)        
    });
}
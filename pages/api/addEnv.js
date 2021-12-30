import connectDB from "../../config/connectDB";
import Environment from "../../models/envModel"

connectDB()

export default async function handler(req,res)
{
    const environ = new Environment()
    console.log(req.body)
	environ.name = req.body.name
    environ.clientId = req.body.clientId
    environ.clientSecret = req.body.clientSecret
    environ.userToken = req.body.userToken
    environ.environment = req.body.environment
    environ.authUrl = req.body.authUrl
    environ.apiUrl = req.body.apiUrl
    environ.pdfKey = req.body.pdfKey
    environ.awsSecretKey = req.body.awsSecretKey
    environ.awsAccessKey = req.body.awsAccessKey
    environ.email = req.body.email

    environ.save((err, envCreated)=>{
        if (err) {
            res.status(401).send(JSON.stringify(err));
        } else {
            res.status(200).send(envCreated);
        }
    });
}

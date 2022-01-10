import connectDB from "../../config/connectDB";
import Environment from "../../models/envModel"

connectDB()

export default async function handler(req,res)
{
    const environ = new Environment()
	environ.name = req.body.name.trim()
    environ.clientId = req.body.clientId.trim()
    environ.clientSecret = req.body.clientSecret.trim()
    environ.userToken = req.body.userToken.trim()
    environ.environment = req.body.environment.trim()
    environ.authUrl = req.body.authUrl.trim()
    environ.apiUrl = req.body.apiUrl.trim()
    environ.pdfKey = req.body.pdfKey.trim()
    environ.awsSecretKey = req.body.awsSecretKey.trim()
    environ.awsAccessKey = req.body.awsAccessKey.trim()
    environ.email = req.body.email.trim()

    environ.save((err, envCreated)=>{
        if (err) {
            res.status(401).send(JSON.stringify(err));
        } else {
            res.status(200).send(envCreated);
        }
    });
}

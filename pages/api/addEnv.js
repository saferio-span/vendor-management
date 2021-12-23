import connectDB from "../../config/connectDB";
import Environment from "../../models/envModel"

connectDB()

export default async function handler(req,res)
{
    const environ = new Environment()
	environ.name = req.body.name
    environ.clientId = req.body.clientId
    environ.clientSecret = req.body.clientSecret
    environ.userToken = req.body.userToken
    environ.environment = req.body.environment
    environ.authUrl = req.body.authUrl
    environ.apiUrl = req.body.apiUrl

    environ.save((err, envCreated)=>{
        if (err) {
            res.status(401).send(JSON.stringify(err));
        } else {
            res.status(200).send(envCreated);
        }
    });
}

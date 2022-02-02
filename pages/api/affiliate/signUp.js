import connectDB from "../../../config/connectDB";
import Affiliate from "../../../models/affiliateModel"
import bcrypt from 'bcrypt';

connectDB()

export default async function handler(req,res)
{
    // console.log(req.body)
    // res.status(200).send(businessID);
    const affiliate = new Affiliate()
	affiliate.name = req.body.name
    affiliate.merchantID = req.body.merchantID
    affiliate.address1 = req.body.address1
    affiliate.address2 = req.body.address2
    affiliate.city = req.body.city
    affiliate.state = req.body.state
    affiliate.zip = req.body.zip
    affiliate.email = req.body.email
    // affiliate.password = bcrypt.hashSync(req.body.password, 10)
    affiliate.payeeRef = req.body.payeeRef
    // affiliate.payeeRef = `Pe${random}`
    affiliate.environment = req.body.envName

    affiliate.save((err, userCreated)=>{
        if (err) {
            res.status(401).send(JSON.stringify(err));
        } else {
            userCreated.password = undefined;
            res.status(200).send(userCreated);
        }
    });
}

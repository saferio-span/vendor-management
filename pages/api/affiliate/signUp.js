import connectDB from "../../../config/connectDB";
import Affiliate from "../../../models/affiliateModel"
import bcrypt from 'bcrypt';

connectDB()

export default async function handler(req,res)
{
    const random = Math.floor((Math.random() * 1000000000) + 1);
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
    affiliate.password = bcrypt.hashSync(req.body.password, 10)
    affiliate.payeeRef = `Pe${random}`

    affiliate.save((err, userCreated)=>{
        if (err) {
            res.status(response.data.StatusCode).send(JSON.stringify(err.response.data.Errors));
        } else {
            userCreated.password = undefined;
            res.status(200).send(userCreated);
        }
    });

    // console.log(`Pr${random}`)
    // console.log(`Sign Up`)
    // console.log(merchant)
    // res.status(200).send(merchant);
}

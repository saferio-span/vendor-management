import connectDB from "../../../config/connectDB";
import Merchant from "../../../models/merchantModel"
import User from "../../../models/userModel"
import bcrypt from 'bcrypt';

connectDB()

export default async function handler(req,res)
{
    const random = Math.floor((Math.random() * 1000000000) + 1);
    const merchant = new Merchant()
    merchant.businessName = req.body.businessName
    merchant.ein = req.body.ein
    merchant.address1 = req.body.address1
    merchant.address2 = req.body.address2
    merchant.city = req.body.city
    merchant.state = req.body.state
    merchant.zip = req.body.zip
    merchant.name = req.body.contactName
    merchant.email = req.body.email
    merchant.password = bcrypt.hashSync(req.body.password, 10)
    merchant.payerRef = `Pr${random}`

    const user = new User()
    user.name = req.body.contactName
    user.email = req.body.email
    user.password = bcrypt.hashSync(req.body.password, 10)
    user.userType = "merchant"

    merchant.save((err, userCreated)=>{
        if (err) {
            res.status(response.data.StatusCode).send(JSON.stringify(err.response.data.Errors));
        } else {

            user.userDetailsId = userCreated._id
            user.save()
            userCreated.password = undefined;
            res.status(200).send(userCreated);
        }
    });



    // console.log(`Pr${random}`)
    // console.log(`Sign Up`)
    // console.log(merchant)
    // res.status(200).send(merchant);
}
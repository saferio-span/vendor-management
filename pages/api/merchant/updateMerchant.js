import connectDB from "../../../config/connectDB";
import Merchant from "../../../models/merchantModel"

connectDB()

export default async function handler(req,res)
{

    Merchant.findOneAndUpdate({_id: req.body.id },req.body.update, function (err, user) {
        if (err){
            console.log(err)
            return res.status(401).send('User not found');
        }
        else{
            return res.status(200).send(user);
        }
    });
    // merchant.save((err, userCreated)=>{
    //     if (err) {
    //         res.status(response.data.StatusCode).send(JSON.stringify(err.response.data.Errors));
    //     } else {

    //         userCreated.password = undefined;
    //         res.status(200).send(userCreated);
    //     }
    // });



    // console.log(`Pr${random}`)
    // console.log(`Sign Up`)
    // console.log(merchant)
    // res.status(200).send(merchant);
}
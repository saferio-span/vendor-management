import connectDB from "../../../config/connectDB"
import Affiliate from "../../../models/affiliateModel"

connectDB()

export default async function handler(req,res)
{
    await Affiliate.findOneAndUpdate({_id: req.body.id },req.body.update, function (err, user) {
        if (err){
            return res.status(401).send('User not found');
        }
        else{
            return res.status(200).send(user);
        }
    });
}
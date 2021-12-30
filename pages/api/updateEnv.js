import connectDB from "../../config/connectDB";
import Environment from "../../models/envModel"

connectDB()

export default async function handler(req,res)
{
    await Environment.findOneAndUpdate({_id: req.body.id },req.body.update, function (err, envrn) {
        if (err){
            return res.status(401).send('Environment not found');
        }
        else{
            return res.status(200).send(envrn);
        }
    }).clone().catch(function(err){ console.log(err)});
}
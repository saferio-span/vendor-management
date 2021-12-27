import connectDB from "../../../../config/connectDB";
import Affiliate from "../../../../models/affiliateModel"
// import { getSession } from "next-auth/client"

connectDB()

export default async function handler(req, res){

  const email = req.query.email
  const envName = req.body.envName


  try {
    const userData = await Affiliate.find({ email: email,environment: envName })
    res.json(userData)
  } catch (err) {
    console.log(err)
    return res.status(500).json({msg: err.message})
  }
    
}

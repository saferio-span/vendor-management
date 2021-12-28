import connectDB from "../../../config/connectDB";
import Affiliate from "../../../models/affiliateModel"

connectDB()

export default async function handler(req, res){

  const id = req.body.payeeRef

  try {
    const userData = await Affiliate.find({ payeeRef: id })
    res.send(userData)
    // res.json(userData)
  } catch (err) {
    console.log(err)
    return res.status(500).json({msg: err.message})
  }
    
}

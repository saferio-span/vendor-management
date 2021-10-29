import connectDB from "../../../config/connectDB";
import Affiliate from "../../../models/affiliateModel"

connectDB()

export default async function handler(req, res){

  console.log(req.query)
  const id = req.query.id

  try {
    const userData = await Affiliate.find({ _id: id })

    res.json(userData)
  } catch (err) {
    console.log(err)
    return res.status(500).json({msg: err.message})
  }
    
}

import connectDB from "../../../config/connectDB";
import Records1099 from "../../../models/1099RecordsModel"
// import { getSession } from "next-auth/client"

connectDB()

export default async function handler(req, res){

  const businessId = req.body.businessId
  const envName = req.body.envName

  try {
    const userData = await Records1099.find({ BusinessId: businessId,environment:envName })
    res.json(userData)
  } catch (err) {
    console.log(err)
    return res.status(500).json({msg: err.message})
  }
    
}

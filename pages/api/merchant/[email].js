import connectDB from "../../../config/connectDB";
import Merchant from "../../../models/merchantModel"
// import { getSession } from "next-auth/client"

connectDB()

export default async function handler(req, res){

  console.log(req.query)
  const email = req.query.email

  try {
    const userData = await Merchant.find({ email: email })
    // const userData = await Merchant.find({ email: 'johnsaferio@gmail.com' })
    // console.log("Get Merchants")
    // console.log(userData)
    res.json(userData)
  } catch (err) {
    console.log(err)
    return res.status(500).json({msg: err.message})
  }
    
}

// const getMerchant = async (req, res) => {

//   console.log(req)
//   // const email = req.params.email

//   // try {
//   //   // const session = await getSession({req})
//   //   // if(!session){
//   //   //   return res.status(400).json({msg: "Invalid Authentication!"}) 
//   //   // }

//   //   // const { user } = session

//   //   const userData = await Merchant.find({ email: email })
//   //   // const userData = await Merchant.find({ email: 'johnsaferio@gmail.com' })
//   //   // console.log("Get Merchants")
//   //   // console.log(userData)
//   //   res.json(userData)
//   // } catch (err) {
//   //   console.log(err)
//   //   return res.status(500).json({msg: err.message})
//   // }

  
// }
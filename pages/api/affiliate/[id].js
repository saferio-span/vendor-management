import connectDB from "../../../config/connectDB";
import Affiliate from "../../../models/affiliateModel"
import Merchant from "../../../models/merchantModel"

connectDB()

export default async function handler(req, res){

  const id = req.query.id

  try {
    const userData = await Affiliate.find({ _id: id })

    Merchant.findById(userData[0].merchantID, function (err, merchantUser) { 
      // console.log(user.merchantID)
      // console.log(merchantUser)
      res.send({
          user : userData,
          merchant:{
              businessId : merchantUser.businessID,
              payerRef : merchantUser.payerRef
          }
      })
      // console.log(user[0])
  } );

    // res.json(userData)
  } catch (err) {
    console.log(err)
    return res.status(500).json({msg: err.message})
  }
    
}

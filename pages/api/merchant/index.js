import connectDB from "../../../config/connectDB";
import Merchant from "../../../models/merchantModel"
import { getSession } from "next-auth/client"

connectDB()

export default async function handler(req, res){
    switch(req.method){
      case "POST":
        await updateMerchant(req, res)
        break;
      case "GET":
        await getMerchant(req, res)
        break;
    }
}

const updateMerchant = async (req, res) => {
  try {
    const session = await getSession({req})
    if(!session){
      return res.status(400).json({msg: "Invalid Authentication!"}) 
    }

    const { userId } = session
    const { todo } = req.body

    if(!todo)
      return res.status(400).json({msg: "Please add todo."}) 
    
    const newTodo = new Todos({
      name: todo.toLowerCase(),
      user: userId
    })

    await newTodo.save()
    res.json({msg: 'Success! Create a new todo.'})
  } catch (err) {
    return res.status(500).json({msg: err.message})
  }
}
  
const getMerchant = async (req, res) => {
  try {
    const session = await getSession({req})
    if(!session){
      return res.status(400).json({msg: "Invalid Authentication!"}) 
    }

    const { user } = session

    const userData = await Merchant.find({ email: user.email })
    // const userData = await Merchant.find({ email: 'johnsaferio@gmail.com' })
    // console.log("Get Merchants")
    // console.log(userData)
    res.json(userData)
  } catch (err) {
    console.log(err)
    return res.status(500).json({msg: err.message})
  }
}
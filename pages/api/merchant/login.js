import connectDB from "../../../config/connectDB";
import Merchant from "../../../models/merchantModel"
import bcrypt from 'bcrypt';

connectDB()

export async function comparePassword(password,hashPassword)
{
    // console.log(`bcrypt function password`)
    // console.log(password,hashPassword)
    const validity = bcrypt.compareSync(password, hashPassword);
    return validity
}

export default async function handler(req,res)
{
    // console.log(`In login handler`)
    // console.log(req.body)
    await Merchant.find({
        email: req.body.email
    }, (err, user)=>{
      if (err){
        return res.status(401).send('User not found. Please Sign in.');
      }
      else
      {
        // console.log(user)
        if(!user.length)
        {
            return res.status(401).send('User not found');  
        }
        else
        {
            // console.log(`Bycrypt Status `)
            comparePassword(req.body.password,user[0].password).then(function(result) {
                if(result)
                {
                    res.send(user) 
                }
                else
                {
                    return res.status(401).send('Authentication failed. Invalid user or password.');
                }
            });
            
        }
      }     
    }).clone().catch(function(err){ console.log(err)})
    
}
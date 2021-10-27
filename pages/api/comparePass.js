import bcrypt from 'bcrypt';

export default function handler(req,res)
{
    // console.log(req.body.password)
    // console.log(req.body.hashPassword)
    const valid = bcrypt.compareSync(req.body.password, req.body.hashPassword)
    if(valid)
    {
        return res.status(200).send(true);
    }
    else
    {
        return res.status(401).send(false);
    }
}
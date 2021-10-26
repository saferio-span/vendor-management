import bcrypt from 'bcrypt';

export default function handler(req,res)
{
    bcrypt.compareSync(req.body.pasword, req.body.hashPassword).then(function(result) {
        if(result)
        {
            return res.status(200).send(true);
        }
        else
        {
            return res.status(401).send(false);
        }
    })
}
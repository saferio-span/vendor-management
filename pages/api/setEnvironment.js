import { LocalStorage } from "node-localstorage";

export default async function handler(req,res)
{
    global.localStorage = new LocalStorage('./scratch');
    global.localStorage.clear()
    
    // console.log(`Local Storage ${global.localStorage.getItem('myFirstKey')}`)
    if(req.body.env != null)
    {
        console.log(req.body.env)
        
        global.localStorage.setItem('environmentName', req.body.env.name)
        global.localStorage.setItem('clientId', req.body.env.clientId)
        global.localStorage.setItem('clientSecret', req.body.env.clientSecret)
        global.localStorage.setItem('userToken', req.body.env.userToken)
        global.localStorage.setItem('apiUrl', req.body.apiUrl)
        global.localStorage.setItem('authUrl', req.body.authUrl)
        res.status(200).send("success")
    }
    
}
import React,{useState,useEffect} from 'react'
import Select from 'react-select'
import axios from 'axios'
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link"
import absoluteUrl from 'next-absolute-url'
import { signOut,getSession } from "next-auth/client"

export const getServerSideProps = async (context)=>{

    // console.log(context.req.headers.referer)
    const { req,query } = context;
    const { origin } = absoluteUrl(req)
  
    // const url = context.req.headers.referer
    // const envRes = await axios.get(`${origin}/api/getAllEnv`)
    // const environCreds = await envRes.data

    const session = await getSession(context)
    if(session !== null)
    {
        const envRes = await axios.post(`${origin}/api/getEnvByName`,{
            email:session.user.email,
            envName : query.envName
        })
        const environCreds = await envRes.data
        console.log(environCreds)
        return{
            props:{ 
                url:origin,
                credentials : environCreds[0],
                session: await getSession(context)
            }
        }
    }
    else{
        return{
            props:{ 
                url:origin,
                credentials : [],
                session: await getSession(context)
            }
        }
    }
    // console.log(environCreds)
    // if(!session)
    // {
    //   return{
    //     redirect:{
    //       destination: '/merchant/login',
    //       permanent: false
    //     }
    //   }
    // }
  
    // return{
    //   props:{ 
    //     url:origin,
    //     credentials : environCreds,
    //     session: await getSession(context)
    //   }
    // }
  }

const AddEnv = (props) => {
    const session = props.session
    const credentials = props.credentials
    const envName = credentials ? credentials.name : ""
    // console.log(credentials)
    const [values, setValues] = useState({
        clientId:credentials ? credentials.clientId : "",
        clientSecret:credentials ? credentials.clientSecret : "",
        userToken:credentials ? credentials.userToken : "",
        // authUrl:credentials ? credentials.authUrl : "",
        // apiUrl:credentials ? credentials.apiUrl : "",
        pdfKey:credentials ? credentials.pdfKey : "",
        awsSecretKey:credentials ? credentials.awsSecretKey : "",
        awsAccessKey:credentials ? credentials.awsAccessKey : "",
	});

    const [validateValues, setValidateValues] = useState({
        clientId:credentials ? credentials.clientId : "",
        clientSecret:credentials ? credentials.clientSecret : "",
        userToken:credentials ? credentials.userToken : "",
        // authUrl:credentials ? credentials.authUrl : "",
        // apiUrl:credentials ? credentials.apiUrl : "",
        pdfKey:credentials ? credentials.pdfKey : ""
	});
    const [loading,setLoading] = useState(false)

    const handleSubmit =async (e)=>{
        e.preventDefault()
        setLoading(true)
        // console.log(values)
        const hasEmptyField = Object.values(validateValues).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields")
            setLoading(false)
            return false
        }

        // console.log({
        //     name:showEnvName,
        //     clientId:values.clientId,
        //     clientSecret:values.clientSecret,
        //     userToken:values.userToken,
        //     environment:values.envType,
        //     authUrl:values.authUrl,
        //     apiUrl:values.apiUrl,
        //     pdfKey:values.pdfKey,
        //     awsSecretKey:values.awsSecretKey,
        //     awsAccessKey:values.awsAccessKey,
        // })

        const res = await axios.post(`/api/updateEnv`,{
            id: credentials._id,
            update:{
                clientId:values.clientId.trim(),
                clientSecret:values.clientSecret.trim(),
                userToken:values.userToken.trim(),
                // authUrl:values.authUrl.trim(),
                // apiUrl:values.apiUrl.trim(),
                pdfKey:values.pdfKey.trim(),
                awsSecretKey:values.awsSecretKey.trim(),
                awsAccessKey:values.awsAccessKey.trim(),
            }
        })

        const envrn = await res.data
        // console.log(`Created Env`)
        // console.log(envrn)
        if(envrn)
        {
            toast("Environment updated successfully")
            setLoading(false)
            return true
        }
        else
        {
            toast("Environment cannot be updated")
            setLoading(false)
            return false
        }
        
    }

    useEffect(()=>{
        if(session == null )
        {
            signOut()
        }
    //eslint-disable-next-line
    },[])

    const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
        if(name != "awsSecretKey" && name != "awsAccessKey")
        {
            setValidateValues({ ...validateValues, [name]: value })
        }
	};

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-9 offset-1">
                    <h1 className="my-3 mx-3">Update Environment</h1>
                </div>
                <div className="col-1">
                    <Link href='/'>
                        <a className="btn btn-danger my-4" >Back</a>
                    </Link>
                </div>
            </div>
            {/* <div className="row">
                <div className="col-10">
                    <h1 className="d-flex justify-content-center align-items-center my-2 ">Add Environment</h1>
                </div>
                <div className="col-2">

                </div>
            </div> */}
            
            <div className="container bg-light my-3 py-3">
                <form onSubmit={handleSubmit}>
                    {/* <div className="row">
                        <div className="col-4 offset-4">
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="ein">Email</label>
                                        <input type="text" className="form-control" id="email" placeholder="Email" value={session != null ? session.user.email : ""} disabled />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="ein">Client ID<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="clientId" placeholder="Client Id" value={values.clientId} name="clientId" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="userToken">User Token<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="userToken" name="userToken" value={values.userToken} placeholder="User Token" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            {/* <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="state">Api Url<span className="text-danger font-weight-bold">*</span> </label>
                                        <input type="text" className="form-control" id="apiUrl" name="apiUrl" value={values.apiUrl} placeholder="Api Url" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div> */}
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="awsSecretKey">Aws Secret Key </label>
                                        <input type="text" className="form-control" id="awsSecretKey" name="awsSecretKey" value={values.awsSecretKey}  placeholder="Aws Secret Key" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="name">Environment name</label>
                                        <input type="text" className="form-control" id="name" name="name" placeholder="Name" value={envName} disabled />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="city">Client Secret<span className="text-danger font-weight-bold">*</span> </label>
                                        <input type="text" className="form-control" id="clientSecret" name="clientSecret" value={values.clientSecret} placeholder="Client Secret" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            {/* <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="authUrl">Auth Url<span className="text-danger font-weight-bold">*</span> </label>
                                        <input type="text" className="form-control" id="authUrl" name="authUrl" placeholder="Auth Url" value={values.authUrl} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div> */}
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="pdfKey">Pdf Key<span className="text-danger font-weight-bold">*</span> </label>
                                        <input type="text" className="form-control" id="pdfKey" name="pdfKey" placeholder="Pdf Key" value={values.pdfKey} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="awsAccessKey">Aws Access Key </label>
                                        <input type="text" className="form-control" id="awsAccessKey" name="awsAccessKey" value={values.awsAccessKey} placeholder="Aws Access Key" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="offset-11 col-1 mb-3">
                            <button type="submit" className="btn btn-danger float-right" value="Submit" disabled={loading}>Submit {loading && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button>
                            {/* <input type="submit" name="submit" className="btn btn-danger float-right" /> */}
                        </div>
                    </div>
                </form>
            </div>    
        </>
    )
}

export default AddEnv

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
  
    const url = context.req.headers.referer
    const envRes = await axios.get(`${origin}/api/getAllEnv`)
    const environCreds = await envRes.data
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
  
    return{
      props:{ 
        url:origin,
        credentials : environCreds,
        session: await getSession(context)
      }
    }
  }

const AddEnv = (props) => {
    const session = props.session
    const credentials = props.credentials
    // console.log(credentials)
    const [showEnvName,setShowEnvName] = useState()
    const [showNote,setShowNote] = useState(false)
    const [values, setValues] = useState({
        name:'',
        envType:'',
        clientId:'',
        clientSecret:'',
        userToken:'',
        authUrl:'',
        apiUrl:'',
        pdfKey:'',
        awsSecretKey:'',
        awsAccessKey:'',
        envName:showEnvName
	});

    var options = [
        { value: "sandbox", label: "Sandbox" },
        { value: "staging", label: "Staging" },
        { value: "uat", label: "UAT" }
    ]

    const handleSubmit =async (e)=>{
        e.preventDefault()
        console.log(values)
        const hasEmptyField = Object.values(values).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields")
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

        const res = await axios.post(`/api/addEnv`,{
           name:showEnvName,
           clientId:values.clientId,
           clientSecret:values.clientSecret,
           userToken:values.userToken,
           environment:values.envType,
           authUrl:values.authUrl,
           apiUrl:values.apiUrl,
           pdfKey:values.pdfKey,
           awsSecretKey:values.awsSecretKey,
           awsAccessKey:values.awsAccessKey,
           email:session.user.email
        })

        const envrn = await res.data
        console.log(`Created Env`)
        console.log(envrn)
        if(envrn)
        {
            setValues({
                name:'',
                envType:'',
                clientId:'',
                clientSecret:'',
                userToken:'',
                authUrl:'',
                apiUrl:'',
                pdfKey:'',
                awsSecretKey:'',
                awsAccessKey:'',
                envName:''
            });
            toast("Environment added successfully")
            setShowNote(true)
            return true
        }
        else
        {
            toast("Environment cannot be added")
            return false
        }
        
    }

    useEffect(()=>{
        if(values.name !== "" && values.envType !== "")
        {
            let tempEnvname = `${values.name}-${values.envType}`
            const result = credentials.filter(cred => cred.name.includes(tempEnvname));

            if(result.length == 0)
            {
                setShowEnvName(tempEnvname)
            }
            else
            {
                tempEnvname = `${values.name}-${values.envType}-${result.length}`
                setShowEnvName(tempEnvname)
            }
        }

        if(session == null )
        {
            signOut()
        }
    //eslint-disable-next-line
    },[values])

    const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
        setShowNote(false)
	};

    const handleSelectChange = (e)=>{
        setShowEnvName("")
        setShowNote(false)
        if(e !== null)
        {
            setValues({ ...values, envType: e.value });
        }
        else
        {
            setValues({ ...values, envType: "" });
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-9 offset-1">
                    <h1 className="my-3 mx-3">Add Environment</h1>
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
                    <div className="row">
                        <div className="col-4 offset-4">
                            <div className="form-group my-2">
                                <label htmlFor="ein">Email</label>
                                <input type="text" className="form-control" id="email" placeholder="Email" value={session != null ? session.user.email : ""} disabled />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="businessName">Environment Type</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            defaultValue="0"
                                            isSearchable="true"
                                            isClearable="true"
                                            id="envType"
                                            instanceId="envType"
                                            name="envType"
                                            options={options}
                                            onChange={handleSelectChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="ein">Client ID</label>
                                        <input type="text" className="form-control" id="clientId" placeholder="Client Id" value={values.clientId} name="clientId" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="userToken">User Token</label>
                                        <input type="text" className="form-control" id="userToken" name="userToken" value={values.userToken} placeholder="User Token" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="state">Api Url </label>
                                        <input type="text" className="form-control" id="apiUrl" name="apiUrl" value={values.apiUrl} placeholder="Api Url" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
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
                                        <label htmlFor="name">Name</label>
                                        <input type="text" className="form-control" id="name" name="name" placeholder="Name" value={values.name} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="city">Client Secret </label>
                                        <input type="text" className="form-control" id="clientSecret" name="clientSecret" value={values.clientSecret} placeholder="Client Secret" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="authUrl">Auth Url </label>
                                        <input type="text" className="form-control" id="authUrl" name="authUrl" placeholder="Auth Url" value={values.authUrl} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="pdfKey">Pdf Key </label>
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
                        <div className="offset-4 col-4 mb-3">
                            {showEnvName && <p>Environment Name - {showEnvName}</p>}
                        </div>
                        <div className="offset-3 col-1 mb-3">
                            <input type="submit" name="submit" className="btn btn-danger float-right" />
                        </div>
                    </div>
                </form>
            </div>    

            {showNote && 
                <div className="container">
                    <div className="card">
                    <div className="card-header">
                        <h3>Webhook Configuration Note</h3>
                    </div>
                    <div className="card-body lead">
                        <p>To configure webhook for <b>WhCertificate Status Change</b> in your taxbandits console use <span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{showEnvName}/whCertificate</b></span></p>
                        <p>To configure webhook for <b>Form 1099 Auto Generation</b> in your taxbandits console use <span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{showEnvName}/1099Generation</b></span></p>
                        <p>To configure webhook for <b>PDF Complete</b> in your taxbandits console use <span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{showEnvName}/pdfUrl</b></span></p>
                    </div>
                    </div>
                </div>
            }
        </>
    )
}

export default AddEnv

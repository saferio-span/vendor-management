import React,{useState,useEffect} from 'react'
import Select from 'react-select'
import axios from 'axios'
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link"
import absoluteUrl from 'next-absolute-url'
import { signOut,getSession } from "next-auth/client"
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {RiFileCopyLine} from 'react-icons/ri'

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
        const envRes = await axios.post(`${origin}/api/getAllEnv`,{
            email:null
        })
        const environCreds = await envRes.data
        return{
        props:{ 
            url:origin,
            credentials : environCreds,
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
    // console.log(credentials)
    const [showEnvName,setShowEnvName] = useState()
    const [showNote,setShowNote] = useState(false)
    const [loading,setLoading] = useState(false)
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
        envName:showEnvName,
        version:''
	});

    const [validateValues, setValidateValues] = useState({
        name:'',
        envType:'',
        clientId:'',
        clientSecret:'',
        userToken:'',
        authUrl:'',
        apiUrl:'',
        pdfKey:'',
        envName:showEnvName,
        version:''
	});

    var options = [
        { value: "sandbox", label: "Sandbox" },
        { value: "sprint", label: "Sprint" },
        { value: "staging", label: "Staging" },
        { value: "uat", label: "UAT" }
    ]

    const handleSubmit =async (e)=>{
        e.preventDefault()
        setLoading(true)
        console.log(`Values Got`,values)
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
        const updatedApiUrl = `${values.apiUrl}${values.version}`;
        console.log(`updatedApiUrl`,updatedApiUrl);

        const res = await axios.post(`/api/addEnv`,{
           name:showEnvName,
           clientId:values.clientId.trim(),
           clientSecret:values.clientSecret.trim(),
           userToken:values.userToken.trim(),
           environment:values.envType.trim(),
           authUrl:values.authUrl.trim(),
           apiUrl:updatedApiUrl.trim(),
           pdfKey:values.pdfKey.trim(),
           awsSecretKey:values.awsSecretKey.trim(),
           awsAccessKey:values.awsAccessKey.trim(),
           email:session.user.email.trim()
        })

        // console.log(`Res`, {
        //     name:showEnvName,
        //     clientId:values.clientId.trim(),
        //     clientSecret:values.clientSecret.trim(),
        //     userToken:values.userToken.trim(),
        //     environment:values.envType.trim(),
        //     authUrl:values.authUrl.trim(),
        //     apiUrl:updatedApiUrl.trim(),
        //     pdfKey:values.pdfKey.trim(),
        //     awsSecretKey:values.awsSecretKey.trim(),
        //     awsAccessKey:values.awsAccessKey.trim(),
        //     email:session.user.email.trim()
        //  })

        const envrn = await res.data
        // console.log(`Created Env`)
        // console.log(envrn)
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
                envName:'',
                version:''
            });
            setValidateValues({
                name:'',
                envType:'',
                clientId:'',
                clientSecret:'',
                userToken:'',
                authUrl:'',
                apiUrl:'',
                pdfKey:'',
                envName:'',
                version:''
            });
            toast("Environment added successfully")
            setLoading(false)
            setShowNote(true)
            return true
        }
        else
        {
            toast("Environment cannot be added")
            setLoading(false)
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
        console.log( name, value)
        setShowNote(false)
        if(name != "awsSecretKey" && name != "awsAccessKey")
        {
            setValidateValues({ ...validateValues, [name]: value })
        }
	};

    const handleSelectChange = (e)=>{
        setShowEnvName("")
        setShowNote(false)
        if(e !== null)
        {
            // setValues({ ...values, envType: e.value });
            // setValidateValues({ ...validateValues, envType: e.value })

            if(e.value === "sandbox")
            {
                setValues({ ...values, envType: e.value, authUrl: "https://testoauth.expressauth.net/v2/tbsauth", apiUrl:`https://testapi.taxbandits.com/`});
                setValidateValues({ ...validateValues, envType: e.value, authUrl: "https://testoauth.expressauth.net/v2/tbsauth", apiUrl:`https://testapi.taxbandits.com/`})
            }

            if(e.value === "staging")
            {
                setValues({ ...values, envType: e.value, authUrl: "https://oauth.expressauth.net/v2/tbsauth", apiUrl:`https://api.taxbandits.com/`});
                setValidateValues({ ...validateValues, envType: e.value, authUrl: "https://oauth.expressauth.net/v2/tbsauth", apiUrl:`https://api.taxbandits.com/`})
            }
            if(e.value === "uat")
            {
                setValues({ ...values, envType: e.value, authUrl: "http://oauth.tbsuat.com/v2/tbsauth", apiUrl:`https://api.tbsuat.com/`});
                setValidateValues({ ...validateValues, envType: e.value, authUrl: "http://oauth.tbsuat.com/v2/tbsauth", apiUrl:`https://api.tbsuat.com/`})
            }
            if(e.value === "sprint")
            {
                setValues({ ...values, envType: e.value, authUrl: "https://oauth.taxvari.com/v2/tbsauth", apiUrl:`https://api.taxvari.com/`});
                setValidateValues({ ...validateValues, envType: e.value, authUrl: "https://oauth.taxvari.com/v2/tbsauth", apiUrl:`https://api.taxvari.com/`})
            }
        }
        else
        {
            setValues({ ...values, envType: "" });
            setValidateValues({ ...validateValues, envType: "" });
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-9 offset-1">
                    <h1 className="my-3 mx-3">Add Environment</h1>
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
                            <div className="form-group my-2">
                                <label htmlFor="ein">Email</label>
                                <input type="text" className="form-control" id="email" placeholder="Email" value={session != null ? session.user.email : ""} disabled />
                            </div>
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group my-2">
                                            <label htmlFor="ein">Email</label>
                                            <input type="text" className="form-control" id="email" placeholder="Email" value={session != null ? session.user.email : ""} disabled />
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="businessName">Environment Type<span className="text-danger font-weight-bold">*</span></label>
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
                                        <label htmlFor="city">Client Secret<span className="text-danger font-weight-bold">*</span> </label>
                                        <input type="text" className="form-control" id="clientSecret" name="clientSecret" value={values.clientSecret} placeholder="Client Secret" onChange={handleInputChange} />
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
                                        <label htmlFor="name">Name<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="name" name="name" placeholder="Name" value={values.name} onChange={handleInputChange} />
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
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="version">Version<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="version" name="version" value={values.version} placeholder="Version" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="row">
                        <div className="col-4 offset-4">
                            <div className="form-group my-2">
                                <label htmlFor="version">Version</label>
                                <input type="text" className="form-control" id="version" name="version" value={values.version} placeholder="Version" onChange={handleInputChange} />
                            </div>
                        </div>
                    </div> */}
                    <br />
                    <div className="row">
			<div className="col-4">
			    <Link href='/'>
				<a className="btn btn-danger" >Back</a>
			    </Link>
			</div>
                        <div className="col-4 mb-3">
                            {showEnvName && <p>Environment Name - {showEnvName}</p>}
                        </div>
                        <div className="offset-3 col-1 mb-3">
                            <button type="submit" className="btn btn-success float-right" value="Submit" disabled={loading}>Submit {loading && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button>
                            {/* <input type="submit" name="submit" className="btn btn-danger float-right" /> */}
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
                    <div className="card-body">
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>Event Type</th>
                              <th>Callback URL</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                                <td>WhCertificate Status Change</td>
                                <td><span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{showEnvName}/whCertificate</b></span></td>
                                <td>
                                    <CopyToClipboard text={`${props.url !== "" ?props.url:""}/api/webhook/${inputVal}/whCertificate`}>
                                        <button className="btn btn-secondary copyButton" data-bs-toggle="tooltip" data-bs-placement="right" title="Click to copy!"><RiFileCopyLine /></button>
                                    </CopyToClipboard>
                                </td>
                            </tr>
                            <tr>
                                <td>Form 1099 Auto Generation</td>
                                <td><span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{showEnvName}/1099Generation</b></span></td>
                                <td>
                                    <CopyToClipboard text={`${props.url !== "" ?props.url:""}/api/webhook/${inputVal}/1099Generation`}>
                                        <button className="btn btn-secondary copyButton" data-bs-toggle="tooltip" data-bs-placement="right" title="Click to copy!"><RiFileCopyLine /></button>
                                    </CopyToClipboard>
                                </td>
                            </tr>
                            <tr>
                                <td>PDF Complete</td>
                                <td><span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{showEnvName}/pdfUrl</b></span></td>
                                <td>
                                    <CopyToClipboard text={`${props.url !== "" ?props.url:""}/api/webhook/${inputVal}/pdfUrl`}>
                                        <button className="btn btn-secondary copyButton" data-bs-toggle="tooltip" data-bs-placement="right" title="Click to copy!"><RiFileCopyLine /></button>
                                    </CopyToClipboard>
                                </td>
                            </tr>
    
                            <tr>
                              <td>Business Complete</td>
                              <td><span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{showEnvName}/businessComplete</b></span></td>
                              <td>
                                    <CopyToClipboard text={`${props.url !== "" ?props.url:""}/api/webhook/${inputVal}/businessComplete`}>
                                        <button className="btn btn-secondary copyButton" data-bs-toggle="tooltip" data-bs-placement="right" title="Click to copy!"><RiFileCopyLine /></button>
                                    </CopyToClipboard>
                                </td>
                            </tr>
                          </tbody>
                        </table>
                        {/* <p>To configure webhook for <b>WhCertificate Status Change</b> in your taxbandits console use <span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{showEnvName}/whCertificate</b></span></p>
                        <p>To configure webhook for <b>Form 1099 Auto Generation</b> in your taxbandits console use <span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{showEnvName}/1099Generation</b></span></p>
                        <p>To configure webhook for <b>PDF Complete</b> in your taxbandits console use <span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{showEnvName}/pdfUrl</b></span></p> */}
                    </div>
                    </div>
                </div>
            }
        </>
    )
}

export default AddEnv

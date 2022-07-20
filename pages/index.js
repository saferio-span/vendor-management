import React,{useState,useEffect} from "react";
import { providers,signIn,signOut,getSession } from "next-auth/client"
import axios from "axios"
import Select from 'react-select'
import { useUserValue } from "../contexts/UserContext";
import { actionTypes } from "../contexts/userReducer"
import absoluteUrl from 'next-absolute-url'
// import { credentials } from '../config/variables';
import { toast,ToastContainer } from "react-toastify"
import Router from 'next/router'
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link"
import style from "../styles/Login.module.css"
import "bootstrap-icons/font/bootstrap-icons.css";

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
      email:session.user.email
    })
    const environCreds = await envRes.data
    return{
      props:{ 
        url:origin,
        credentials : environCreds,
        providers: await providers(context),
        session: await getSession(context)
      }
    }
  }
  else{
    return{
      props:{ 
        url:origin,
        credentials : [],
        providers: await providers(context),
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

}

const Home=(props)=>{
  const providers = props.providers
  const session = props.session
  const [{environment},dispatch] = useUserValue();
  const [details,setDetails] = useState(null)
  const credentials = props.credentials
  // const [env,setEnv]=useState()
  const [inputVal,setInputVal]=useState()
  // const [filterCred,setFilterCred]=useState()
  const [showNote,setShowNote]=useState(false)
  const [showEnv,setShowEnv]=useState(false)
  const [showEnvPage,setShowEnvPage]=useState(false)
  const [variation,setVariation]=useState("")
  // console.log(credentials)
  var options = []
  for(const key in credentials )
  {
      options.push({ value: credentials[key].name, label: credentials[key].name })
  }

  var variations = [
    {value: "t0-1", label: "T0-1"},
    {value: "r0-1", label: "R0-1"},
    // {value: "g0-1", label: "G0-1"},
    {value: "all", label: "All"}
  ]
  
  // console.log(`Session`)
  // console.log(props.session)
  // console.log(`Session`)

  const handleSelectChange=async(e)=>{
    if(e == null)
    {
      dispatch({
        type: actionTypes.SET_ENVIRONMENT_DETAILS,
        data: null,
      })
      setDetails(null)
      setShowNote(false)
    }
    else
    {
      setInputVal(e.value)
      const cred = credentials.filter((user)=>user.name===e.value)   
      dispatch({
        type: actionTypes.SET_ENVIRONMENT_DETAILS,
        data: cred[0],
      })
      localStorage.setItem('env',cred[0].name)
      setDetails(cred[0]) 
      setShowNote(true)
      // setShowEnv(false)
    }
  }

  const handleMerchantLogin = ()=>{
    if(details === null)
    {
      toast.error("Please select environment")
    }
    else if(variation == "")
    {
      toast.error("Please select variation")
    }
    else
    {
      // Router.push('/merchant/login')
      Router.push({
        pathname: '/merchant/login',
        query: { 
            envName: inputVal
        }
      })
    }
  }

  const handleVendorLogin = ()=>{
    if(details === null)
    {
      toast.error("Please select environment")
    }
    else if(variation == "")
    {
      toast.error("Please select variation")
    }
    else
    {
      Router.push({
        pathname: '/vendor/login',
        query: { 
            envName: inputVal
        }
      })
    }
  }

  const handleWebhook = ()=>{
    // console.log(details)
    if(details === null)
    {
      Router.push({
        pathname: '/webHook',
        query: { 
            envName: ""
        }
      })
    }
    else
    {
      Router.push({
        pathname: '/webHook',
        query: { 
            envName: details.name
        }
      })
    }
  }

  const handleEnvChange =(e)=>{
    const value = e.target.value
    setEnv(value)
    setInputVal(value)
    setShowEnv(true)

    if(value !== "")
    {
        const cred = credentials.filter((user)=>user.name===value)   
        if(cred.length > 0)
        {
          dispatch({
            type: actionTypes.SET_ENVIRONMENT_DETAILS,
            data: cred[0],
          })
          localStorage.setItem('env',cred[0].name)
          setDetails(cred[0]) 
          setShowNote(true)
        }
    }
  }

  const handleVariationChange = (e)=>{

    if(e == null)
    {
      dispatch({
        type: actionTypes.SET_VARIATION_DETAILS,
        data: null,
      })
      setVariation("")
    }
    else
    {
      dispatch({
        type: actionTypes.SET_VARIATION_DETAILS,
        data: e.value,
      })
      localStorage.setItem('variant',e.value)
      setVariation(e.value)
    }
  }

  const handleAdminLogin = ()=>{

  }

  useEffect(() => {

    if(session !== null)
    {
      localStorage.setItem('googleEmail',session.user.email)
      setShowEnvPage(true)
    }

  //eslint-disable-next-line
  }, [])

  // console.log(variation)

  return (
    <div>
      
      <main>
        <ToastContainer />
        {
          !showEnvPage && <>
            <div className={`${style.loginContainer} d-flex justify-content-center align-items-center my-5`}>
              <div className={`${style.googleContainer} border border-1 max-auto p-4 shadow`}>
                  <div className="row">
                      <div className="col-12">
                          <h3 className={`${style.heading} fw-bolder text-center text-uppercase`}>
                              Welcome to Vendor Management
                          </h3>
                          <p className="text-center">Inorder to secure your details and choose your environment please sign in with google to continue</p>
                      </div>
                  </div>
                  <div className="d-flex justify-content-center align-items-cente">
                  <button className="btn btn-danger px-5 my-2" onClick={()=>signIn(providers.google.id)}><i className="bi bi-google"></i> Sign in with Google </button>
                  </div>
                  
              </div>
          </div>
          </>
        }
        
        {
          showEnvPage && <>
            <div className="row mt-5">
              <div className="col-4 offset-4">
                <h1 className="d-flex justify-content-center align-items-center my-4 ">
                  Vendor Management
                </h1>
              </div>
              <div className="col-2 offset-2  ">
                <button className={`${style.logoutButton} btn btn-danger mx-5`} onClick={()=>signOut()}>Logout Google</button>
              </div>
            </div>
            <div className="row">
              <div className="col-2 offset-4">
                <div className="form-group my-2">
                    <label htmlFor="variation">Variations </label>
                    <Select
                        className="basic-single my-2"
                        classNamePrefix="select"
                        defaultValue="0"
                        isSearchable="true"
                        isClearable="true"
                        id="variation"
                        instanceId="variation"
                        name="variation"
                        options={variations}
                        onChange={handleVariationChange}
                    />
                    {/* <input type="text" name="env" onChange={handleEnvChange} autoComplete="off" value={inputVal} className="form-control" placeholder="Environment Name"/> */}
                </div>
              </div>
              <div className="col-2">
                <div className="form-group my-2">
                    <label htmlFor="env">Environment </label>
                    <Select
                        className="basic-single my-2"
                        classNamePrefix="select"
                        defaultValue="0"
                        isSearchable="true"
                        isClearable="true"
                        id="env"
                        instanceId="env"
                        name="env"
                        options={options}
                        onChange={handleSelectChange}
                    />
                    {/* <input type="text" name="env" onChange={handleEnvChange} autoComplete="off" value={inputVal} className="form-control" placeholder="Environment Name"/> */}
                </div>

                {/* <div className="list-group">
                  {filterCred && showEnv && filterCred.map((details) => {
                    return (
                      <button key={details.name} type="button" onClick={()=>handleSelectChange(details.name)} className="list-group-item list-group-item-action">{details.name}</button>
                    )}
                  )}
                </div> */}
              </div>
              <div className="col-1 p-0">
                <div className="form-group">
                  {showNote && <> <Link href={{ pathname: '/updateEnv', query: { envName: inputVal } }} ><a className={`${style.updateButton} btn btn-secondary`} title="Update Environment"><i className="bi bi-pencil-square"></i></a></Link></>}
                </div>
              
              </div>
            </div>
            <div className="row">
              <div className="col-12 text-center mt-4">
                  <p>Not having set your environment? It can be done <Link href='/addEnv'><a>right here</a></Link>, so don't worry! - Change the content</p>
              </div>
            </div>
            <hr />
            {
              variation != "g0-1" && <>
              <div className="row my-5">
                <div className="col-2 offset-4">
                  {/* <Link href='/merchant/login'> */}
                      <a className="btn btn-primary mx-5" onClick={handleMerchantLogin}>Payer Login</a>
                  {/* </Link> */}
                  
                </div>
                <div className="col-2">
                  {/* <Link href='/vendor/login'> */}
                      <a className="btn btn-info mx-5" onClick={handleVendorLogin}>Payee Login</a>
                  {/* </Link> */}
                </div>
                {/* <div className="col-2">
                  
                </div> */}
                {/* <div className="col-3 offset-1">
                  <Link href='/webHook'>
                      <a className="btn btn-warning mx-5" onClick={handleWebhook} >Webhook</a>
                  </Link>
                </div> */}
              </div>
            </>
            }

            {
              variation == "g0-1" && <>
              <div className="row my-5">
                <div className="col-4 d-flex justify-content-center">
                  {/* <Link href='/merchant/login'> */}
                      <a className="btn btn-primary mx-5" onClick={handleMerchantLogin}>Payer Login</a>
                  {/* </Link> */}
                  
                </div>
                <div className="col-4 d-flex justify-content-center">
                  {/* <Link href='/vendor/login'> */}
                    <a className="btn btn-success mx-5" onClick={handleAdminLogin}>G-Admin Login</a>
                  {/* </Link> */}
                </div>
                {/* <div className="col-2">
                  
                </div> */}
                <div className="col-4 d-flex justify-content-center">
                  {/* <Link href='/webHook'> */}
                    <a className="btn btn-info mx-5" onClick={handleVendorLogin}>Payee Login</a>
                  {/* </Link> */}
                </div>
              </div></>
            }
              

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
                                </tr>
                              </thead>
                              <tbody>
                              <tr>
                                <td>WhCertificate Status Change</td>
                                <td><span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{inputVal}/whCertificate</b></span></td>
                              </tr>
                              {
                                variation != "r0-1" && <>
                                  <tr>
                                      <td>Form 1099 Auto Generation</td>
                                      <td><span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{inputVal}/1099Generation</b></span></td>
                                  </tr>
                                  <tr>
                                      <td>PDF Complete</td>
                                      <td><span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{inputVal}/pdfUrl</b></span></td>
                                  </tr>
                                </>
                              }
                              {
                                variation != "t0-1" && <>
                                  <tr>
                                    <td>Business Complete</td>
                                    <td><span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{inputVal}/businessComplete</b></span></td>
                                  </tr>
                                </>
                              }
                              </tbody>
                            </table>
                                {/* <p>To configure webhook for <b>WhCertificate Status Change</b> in your taxbandits console use <span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{inputVal}/whCertificate</b></span></p>
                                <p>To configure webhook for <b>Form 1099 Auto Generation</b> in your taxbandits console use <span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{inputVal}/1099Generation</b></span></p>
                                <p>To configure webhook for <b>PDF Complete</b> in your taxbandits console use <span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{inputVal}/pdfUrl</b></span></p> */}
                          </div>
                        </div>
                    </div>
              }
          </>
        }
        
      </main>
    </div>
  )
}
// {window.location.href}

export default Home

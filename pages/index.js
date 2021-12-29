import React,{useState,useEffect} from "react";
import { signOut,getSession } from "next-auth/client"
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
      credentials : environCreds
    }
  }
}

export default function Home(props) {
  const [{environment},dispatch] = useUserValue();
  const [details,setDetails] = useState(null)
  const credentials = props.credentials
  const [env,setEnv]=useState()
  const [inputVal,setInputVal]=useState()
  const [filterCred,setFilterCred]=useState()
  const [showNote,setShowNote]=useState(false)
  // console.log(credentials)
  var options = []

  const handleSelectChange=async(name)=>{
    if(name === "")
    {
      dispatch({
        type: actionTypes.SET_ENVIRONMENT_DETAILS,
        data: null,
      })
      setDetails(null)
    }
    else
    {
      setInputVal(name)
      const cred = credentials.filter((user)=>user.name===name)   
      dispatch({
        type: actionTypes.SET_ENVIRONMENT_DETAILS,
        data: cred[0],
      })
      localStorage.setItem('env',cred[0].name)
      setDetails(cred[0]) 
      setShowNote(true)
    }
  }

  const handleMerchantLogin = ()=>{
    if(details === null)
    {
      toast.error("Please select environment")
    }
    else
    {
      Router.push('/merchant/login')
    }
  }

  const handleVendorLogin = ()=>{
    if(details === null)
    {
      toast.error("Please select environment")
    }
    else
    {
      Router.push('/vendor/login')
    }
  }

  const handleWebhook = ()=>{
    console.log(details)
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

  useEffect(() => {
    if(env!="")
    {
      const filterCredData = credentials.filter((user)=>user.name.includes(env))  
      setFilterCred(filterCredData)
    }
    else
    {
      setFilterCred([])
      setShowNote(false)
    }

  //eslint-disable-next-line
  }, [env])

  // console.log(filterCred)

  return (
    <div>
      
      <main>
        <ToastContainer />
        <div className="row mt-5">
          <div className="col-4 offset-4">
            <h1 className="d-flex justify-content-center align-items-center my-4 ">
              Vendor Management
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-4 offset-4">
            <div className="form-group my-2">
                <label htmlFor="env">Environment </label>
                {/* <Select
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
                /> */}
                <input type="text" name="env" onChange={handleEnvChange} autoComplete="off" value={inputVal} className="form-control" placeholder="Environment Name"/>
            </div>
            <div className="list-group">
              {filterCred && filterCred.map((details) => {
                return (
                  <button key={details.name} type="button" onClick={()=>handleSelectChange(details.name)} className="list-group-item list-group-item-action">{details.name}</button>
                )}
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 text-center mt-4">
              <p>Didn{`'`}t set your environment? No worries you can do it form here! <Link href='/addEnv'><a>Click me</a></Link></p>
          </div>
        </div>
        <hr />
          <>
            <div className="row my-5">
              <div className="col-3 offset-1">
                {/* <Link href='/merchant/login'> */}
                    <a className="btn btn-primary mx-5" onClick={handleMerchantLogin}>Merchant Login</a>
                {/* </Link> */}
                
              </div>
              <div className="col-3 offset-1">
                {/* <Link href='/vendor/login'> */}
                    <a className="btn btn-info mx-5" onClick={handleVendorLogin}>Vendor Login</a>
                {/* </Link> */}
              </div>
              <div className="col-3 offset-1">
                {/* <Link href='/webHook'> */}
                    <a className="btn btn-warning mx-5" onClick={handleWebhook} >Webhook</a>
                {/* </Link> */}
              </div>
            </div>
          </>

          {showNote && 
                <div className="container">
                    <div className="card">
                      <div className="card-header">
                          <h3>Webhook Configuration Note</h3>
                      </div>
                      <div className="card-body lead">
                          <p>To configure webhook for <b>WhCertificate Status Change</b> in your taxbandits console use <span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{inputVal}/whCertificate</b></span></p>
                          <p>To configure webhook for <b>Form 1099 Auto Generation</b> in your taxbandits console use <span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{inputVal}/1099Generation</b></span></p>
                          <p>To configure webhook for <b>PDF Complete</b> in your taxbandits console use <span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/{inputVal}/pdfUrl</b></span></p>
                      </div>
                    </div>
                </div>
            }
      </main>
    </div>
  )
}
// {window.location.href}
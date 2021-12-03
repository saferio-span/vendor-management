import React,{useState,useEffect} from "react";
import { signOut,getSession } from "next-auth/client"
import axios from "axios"
import Select from 'react-select'
import { useUserValue } from "../contexts/UserContext";
import { actionTypes } from "../contexts/userReducer"
import absoluteUrl from 'next-absolute-url'
import { credentials } from '../config/variables';
import { toast,ToastContainer } from "react-toastify"
import Router from 'next/router'
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link"

export const getServerSideProps = async (context)=>{

  // console.log(context.req.headers.referer)
  const { req,query } = context;
  const { origin } = absoluteUrl(req)

  const url = context.req.headers.referer
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
      url:origin
    }
  }
}

export default function Home(props) {
  var options = []
  const [{environment},dispatch] = useUserValue();
  const [details,setDetails] = useState(null)
  // const [env,setEnv]=useState(null)

  const handleSelectChange=async(e)=>{
    if(e === null)
    {
      // const res = await axios.post(`/api/setEnvironment`,{
      //   env: null
      // })
      dispatch({
        type: actionTypes.SET_ENVIRONMENT_DETAILS,
        data: null,
      })
      // if(res.status===200)
      // {
        setDetails(null)
      // }

    }
    else
    {
      const cred = credentials.filter((user)=>user.name===e.value)
      // let apiUrl = ""
      // let authUrl = ""

      // if(cred[0].environment === "sandbox")
      // {
      //     apiUrl= urls.apiUrlSandbox
      //     authUrl= urls.authUrlSandbox
      // }

      // if(cred[0].environment === "staging")
      // {
      //     apiUrl= urls.apiUrlStaging
      //     authUrl= urls.authUrlStaging
      // }

      // const res = await axios.post(`/api/setEnvironment`,{
      //   env: cred[0],
      //   apiUrl,
      //   authUrl,
      // })
    
      dispatch({
        type: actionTypes.SET_ENVIRONMENT_DETAILS,
        data: cred[0],
      })
      localStorage.setItem('env',cred[0].name)
      // if(res.status===200)
      // {
        setDetails(cred[0])
      // }
      
    }
  }

  if(credentials)
  {   
      for(const key in credentials )
      {
          options.push({ value: credentials[key].name, label: credentials[key].name })
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
            </div>
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
                <Link href='/webHook'>
                    <a className="btn btn-warning mx-5" >Webhook</a>
                </Link>
              </div>
            </div>
          </>

          <div className="container">
            <div className="card">
              <div className="card-header">
                <h3>Webhook Configuration Note</h3>
              </div>
              <div className="card-body lead">
                <p>To configure webhook in your taxbandits console use <span className="text-primary"><b>{props.url !== "" ?props.url:""}/api/webhook/whCertificate</b></span></p>
                <p>To add your environment details please send your <span className="text-primary"><b>Client Id, Client Secret, User Token</b></span> and Environment details to developer </p>
              </div>
            </div>
          </div>
      </main>

      <footer>
       
      </footer>
    </div>
  )
}
// {window.location.href}
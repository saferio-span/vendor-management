import React,{useState,useEffect} from "react";
import { signOut,getSession } from "next-auth/client"
import axios from "axios"
import Select from 'react-select'
import { useUserValue } from "../contexts/UserContext";
import { actionTypes } from "../contexts/userReducer"
import { credentials,urls } from '../config/variables';
import { toast,ToastContainer } from "react-toastify"
import Router from 'next/router'
import 'react-toastify/dist/ReactToastify.css';

export const getServerSideProps = async (context)=>{
  const session = await getSession(context)

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
    props:{ session }
  }
}

export default function Home() {
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
      let apiUrl = ""
      let authUrl = ""

      if(cred[0].environment === "sandbox")
      {
          apiUrl= urls.apiUrlSandbox
          authUrl= urls.authUrlSandbox
      }

      if(cred[0].environment === "staging")
      {
          apiUrl= urls.apiUrlStaging
          authUrl= urls.authUrlStaging
      }

      // const res = await axios.post(`/api/setEnvironment`,{
      //   env: cred[0],
      //   apiUrl,
      //   authUrl,
      // })
    
      dispatch({
        type: actionTypes.SET_ENVIRONMENT_DETAILS,
        data: cred[0],
      })
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
        {/* {
          details === null &&
            <>
              <h1 className="text-center text-success mt-5">Select the environment to move forward...</h1>
            </>
        }
        {
          details != null && */}
          <>
            <div className="row mt-5">
              <div className="col-3 offset-3">
                {/* <Link href='/merchant/login'> */}
                    <a className="btn btn-primary mx-5" onClick={handleMerchantLogin}>Merchant Login</a>
                {/* </Link> */}
                
              </div>
              <div className="col-3 offset-1">
                {/* <Link href='/vendor/login'> */}
                    <a className="btn btn-info mx-5" onClick={handleVendorLogin}>Vendor Login</a>
                {/* </Link> */}
              </div>
            </div>
          </>
        {/* } */}
        
      </main>

      <footer>
       
      </footer>
    </div>
  )
}

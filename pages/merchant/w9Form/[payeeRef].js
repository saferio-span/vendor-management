import React,{useState,useEffect} from "react"
import MerchantNavBar from "../../../components/Layout/MerchantNavBar"
import { useUserValue } from '../../../contexts/UserContext'
import absoluteUrl from 'next-absolute-url'
import axios from 'axios'
import Link from "next/link";
import Router from 'next/router'
import { toast, ToastContainer } from "react-toastify"
import moment from 'moment'
import 'react-toastify/dist/ReactToastify.css';

export const getServerSideProps = async (context)=>{
    const { params,req,query } = context;
    const { origin } = absoluteUrl(req)

    // const formsRes = await axios.get(`${origin}/api/affiliate/getCompletedForms/${params.payeeRef}`)
    const formsRes = await axios.post(`${origin}/api/affiliate/getCompletedForms/${params.payeeRef}`,{
      envName: query.envName,
    })

    let forms = null
    let error = null
    if(formsRes.status == 200)
    { 
        forms = await formsRes.data
    }

    if(formsRes.status == 202)
    {
        error = await formsRes.data
    }
    
  
    return{
      props:{
        forms,
        error,
        payeeRef:params.payeeRef
      }
    } 
}

const ViewForms = (props) => {
    const [{user_details,environment},dispatch] = useUserValue();
    // console.log(props)

    let url = ""
    if(props.error === null)
    {
      url = props.forms.FormType === "W8Ben" ? props.forms.FormW8Ben.PdfUrl : props.forms.FormW9.PdfUrl
    }
    
    return (
        <>
            <MerchantNavBar />
            <ToastContainer />
            <div className="container">
              <h1>Completed WhCertificate </h1>
              {
                  url !== "" && <>
                  <Link href={url}>
                    <a target="_blank">{url}</a>
                  </Link>
                  <iframe className="my-1" title="wh" width="100%" height="600" src={url} />
                </>
              }
              {
                props.error !== null && <>
                  <div className="alert alert-danger" role="alert">
                      {props.error.Message}
                  </div>
                </>
              }
            </div>
        </>
    )
}

export default ViewForms

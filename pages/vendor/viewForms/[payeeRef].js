import React,{useState,useEffect} from "react"
import VendorNavbar from '../../../components/Layout/VendorNavBar'
import absoluteUrl from 'next-absolute-url'
import axios from 'axios'
import Link from "next/link";
import moment from 'moment'

export const getServerSideProps = async (context)=>{
    const { params,req,query } = context;
    const { origin } = absoluteUrl(req)

    // const formsRes = await axios.get(`${origin}/api/affiliate/getCompletedForms/${params.payeeRef}`)
    const formsRes = await axios.post(`${origin}/api/affiliate/getCompletedForms/${params.payeeRef}`,{
      envName: query.envName,
    })
    const forms = await formsRes.data
  
    return{
      props:{
        forms
      }
    }
}

const ViewForms = (props) => {
    console.log(props.forms)
    const url = props.forms.FormType === "W8Ben" ? props.forms.FormW8Ben.PdfUrl : props.forms.FormW9.PdfUrl
    return (
        <>
            <VendorNavbar />
            <div className="container">
                <h1>Completed WhCertificate </h1>
                <Link href={url}>
                  <a target="_blank">{url}</a>
                </Link>
                <iframe className="my-1" title="wh" width="100%" height="600" src={url} />
            </div>
        </>
    )
}

export default ViewForms

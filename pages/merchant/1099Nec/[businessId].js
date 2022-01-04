import React,{useState,useEffect,useCallback} from "react"
import MerchantNavBar from "../../../components/Layout/MerchantNavBar"
import { toast, ToastContainer } from "react-toastify"
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'
import { useUserValue } from '../../../contexts/UserContext'
import Link from "next/dist/client/link";
import AddTransaction from "../../../components/Layout/AddTransaction";
import moment from 'moment'
import Select from 'react-select'
import ReactPaginate from "react-paginate"
import { useRouter } from 'next/router'
import W9Pdf from "../../../components/Layout/W9Pdf";

export const getServerSideProps = async (context)=>{
    const { params,req,query } = context;
    const { origin } = absoluteUrl(req)

    const merchantRes = await axios.post(`${origin}/api/merchant/getByPayerRef`,{
      payerRef: query.payerRef,
      envName: query.envName,
    })
    
    const merchant = await merchantRes.data
    console.log(`Merchant`)
    console.log(merchant)
    
    const res = await axios.post(`${origin}/api/affiliate/getAllByMerchnatId`,{
        merchantId : merchant[0]._id,
        envName: query.envName,
    })
    const affiliates = await res.data

    const recordsRes = await axios.post(`${origin}/api/merchant/get1099RecordsByBusinessId`,{
        businessId:params.businessId,
        envName: query.envName
    })
    const records = await recordsRes.data
    console.log(records)

    return{
      props:{
        affiliates,
        records
       }
    }
}


const Records1099Nec = (props) => {
    const records = props.records
    const affiliates = props.affiliates
    const [{ user_details,environment }, dispatch] = useUserValue(false);
    const router = useRouter()
    const envName = router.query.envName

    const handleBtnClick =async(submissionId,recordId)=>{
        const res =await axios.post(`/api/get1099Pdf`,{
            submissionId,
            recordId,
            envName: envName
        })
        const data = await res.data

        if(data.status==202)
        {
            toast.error(data.message)
        }
        else
        {
            window.open(data.FilePath, "_blank")
        }
    }

    const handleAwsBtnClick =async(submissionId,recordId)=>{
        const res =await axios.post(`/api/getAws1099Pdf`,{
            submissionId,
            recordId,
            envName: envName
        })
        const data = await res.data

        if(data.status == 202)
        {
            toast.error(data.Message)
        }
        else{
            console.log(data)
           const url = data.Form1099NecRecords.SuccessRecords[0].Files.Copy1.Masked
           console.log(url)
           const res =await axios(`/api/decryptPdf`,{
                method: 'post',
                responseType: 'blob',
                data:{
                    urlLink:url,
                    recordId,
                    envName: envName
                },
            })

            const pdfData = await res.data

            const file = new Blob(
                [pdfData], 
                {type: 'application/pdf'});
            const fileURL = URL.createObjectURL(file);
            // console.log(fileURL)
            window.open(fileURL,"_blank");
            
        }
    }

    const handleDistBtnClick = async(props)=>{
        // console.log(user_details)
        const distData = {
            businessId : user_details.businessID,
            recordId : props.recordId,
            payeeRef : props.payeeRef,
            payerRef : props.payerRef,
            envName: envName
        }

        const res =await axios.post(`/api/getDistributionUrl`,distData)
        const data = await res.data

        console.log(data)
        if(data.status == 202)
        {
            toast.error(data.Message)
        }else
        {
            window.open(data.DistributionUrl,"_blank");
        }

    }
    const handleRefresh=()=>{
        window.location.reload();
    }
    return (
        <>
            <MerchantNavBar />
            <ToastContainer />
            <div className="row my-5 mx-2">
                <div className="col-10">
                    <h4>1099 List</h4>
                </div>
                <div className="col-2 d-flex flex-row-reverse">
                    <button className="btn btn-secondary mx-1" onClick={handleRefresh}>Refresh <i className="bi bi-arrow-clockwise"></i></button>
                </div>
                <div className="col-12 lead">
                    Get your 1099 pdf using taxbandits <Link href='https://onlineaccess.taxbandits.com/?ref=menu_onlineportal&_ga=2.33902503.746927293.1640586911-1927950019.1635500618'>
                <a className="">Online access form</a>
            </Link>    
                </div>                
            </div>
            <div className="row my-2 mx-2">
                <table className="table table-hover table-striped table-responsive">
                    <thead>
                        <tr>
                            <th>Payee Name</th>
                            <th>Federal Status</th>
                            <th>TaxYear</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records && records.map((details) => {
                            return details.Form1099NECRecords.map((record)=>{
                                let name = ''
                                affiliates.forEach(option => {
                                    if(option.payeeRef === record.PayeeRef)
                                    {
                                        name = option.name
                                    }
                                })

                                const distProps = {
                                    submissionId:details.SubmissionId,
                                    payeeRef:record.PayeeRef,
                                    recordId:record.RecordId
                                }
                                return (
                                <tr key={details._id}>
                                    <td>{name}</td>
                                    <td>{record.FederalReturn.Status}</td>
                                    <td>{details.TaxYear}</td>
                                    <td>
                                        <button className="btn btn-primary mx-1" onClick={async() => handleBtnClick(details.SubmissionId,record.RecordId)}>Get 1099 Pdf</button>
                                        <button className="btn btn-warning mx-1" onClick={async() => handleAwsBtnClick(details.SubmissionId,record.RecordId)}>AWS 1099 Pdf</button>
                                        <button className="btn btn-success mx-1" onClick={async() => handleDistBtnClick(distProps)}>Get Dist 1099 Pdf</button>
                                        {/* <button className="btn btn-info mx-1" key={`${details.RecordId}1099`} onClick={async() => handleDistBtnClick(distProps)} data-bs-toggle="modal" data-bs-target={`#pdf${details.RecordId}`}>Distribution 1099 Pdf</button> */}
                                    </td>
                                </tr>)
                            })
                        })}
                    </tbody>
                </table>   
            </div>

            {/* {distUrl && recordId && <> <W9Pdf url={distUrl} userId={`pdf${recordId}`} header="1099 Pdf" /></>} */}
            {/* {bufferString && recordId && <>{bufferString}</>} */}
            {/* <Document file="sample.pdf" /> */}
        </>
    )
}

export default Records1099Nec

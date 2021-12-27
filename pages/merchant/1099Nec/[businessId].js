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
    
    const res = await axios.post(`${origin}/api/affiliate/getAllByMerchnatId`,{
        merchantId : merchant[0]._id,
        envName: query.envName,
    })
    const affiliates = await res.data

    const recordsRes = await axios.post(`${origin}/api/merchant/get1099RecordsByBusinessId`,{
        businessId:params.businessId
    })
    const records = await recordsRes.data

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
    const [{ user_details,environment }, dispatch] = useUserValue();
    const [distUrl,setDistUrl] = useState()
    const [recordId,setRecordId] = useState()

    const handleBtnClick =async(submissionId,recordId)=>{
        const res =await axios.post(`/api/get1099Pdf`,{
            submissionId,
            recordId,
            envName: environment ? environment.name : localStorage.getItem("env")
        })
        const data = res.data
        window.open(data.FilePath, "_blank")
    }

    const handleAwsBtnClick =async(submissionId,recordId)=>{
        const res =await axios.post(`/api/getAws1099Pdf`,{
            submissionId,
            recordId,
            envName: environment ? environment.name : localStorage.getItem("env")
        })
        const data = await res.data
        // console.log(data)

        if(data.status == 202)
        {
            toast.error(data.Message)
        }
        else{
            console.log(data)
           const url = data.Form1099NecRecords.SuccessRecords[0].Files.Copy1.Masked
           console.log(url)
           const res =await axios.post(`/api/decryptPdf`,{
                urlLink:url,
                recordId
            })

            const pdfData = await res.data

            console.log(pdfData)

            // if(pdfData.status == 200)
            // {
            //     window.open(pdfData.url, "_blank")
            // }
            // else{
            //     toast.error("Pdf cannot be downloaded")
            // }

            // }

            // if(pdfData)
            // {
            //    const pdfUrl= URL.createObjectURL(pdfData.Body);
            //    console.log(pdfUrl)
            // //    window.open(data.FilePath, "_blank")
            // }

        //     const data= await res.data
            
        //     console.log(data)
            window.open(pdfData.Body, "_blank")
        }
        // window.open(data.FilePath, "_blank")
    }

    const handleDistBtnClick = async(props)=>{
        // console.log(user_details)
        const distData = {
            businessId : user_details.businessID,
            recordId : props.recordId,
            payeeRef : props.payeeRef,
            payerRef : props.payerRef,
            envName: environment ? environment.name : localStorage.getItem("env")
        }

        const res =await axios.post(`/api/getDistributionUrl`,distData)
        const data = await res.data

        console.log(data)
        if(data.status == 202)
        {
            toast.error(data.Message)
        }
        else
        {
            setDistUrl(data.DistributionUrl)
            setRecordId(distData.recordId)
        }

    }
    console.log(distUrl)
    console.log(recordId)
    return (
        <>
            <MerchantNavBar />
            <ToastContainer />
            <div className="row my-5 mx-2">
                <div className="col-10">
                    <h4>1099 List</h4>
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
                            <th>Affiliate Name</th>
                            <th>Federal Status</th>
                            <th>TaxYear</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records && records.map((details) => {

                            let name = ''
                            affiliates.forEach(option => {
                                if(option.payeeRef === details.PayeeRef)
                                {
                                    name = option.name
                                }
                            })

                            const distProps = {
                                submissionId:details.SubmissionId,
                                payeeRef:details.payeeRef,
                                recordId:details.RecordId
                            }
                            return (
                            <tr key={details._id}>
                                <td>{name}</td>
                                <td>{details.FederalReturnStatus}</td>
                                <td>{details.TaxYear}</td>
                                <td>
                                    <button className="btn btn-primary mx-1" onClick={async() => handleBtnClick(details.SubmissionId,details.RecordId)}>Get 1099 Pdf</button>
                                    <button className="btn btn-warning mx-1" onClick={async() => handleAwsBtnClick(details.SubmissionId,details.RecordId)}>AWS 1099 Pdf</button>
                                    <button className="btn btn-success mx-1" onClick={async() => handleAwsBtnClick("323394f6-9b8c-4676-99c1-fea7b4cf676a","9056b604-3cc5-4ab9-8095-9c106b6a7d8e")}>AWS 1099 Static</button>
                                    {distUrl ? <button className="btn btn-info mx-1" key={`${details.RecordId}1099`} data-bs-toggle="modal" data-bs-target={`#pdf${details.RecordId}`}>Show 1099 Pdf</button> : <button className="btn btn-info mx-1" onClick={async() => handleDistBtnClick(distProps)}>Get Dist 1099 Pdf</button> }
                                    {/* <button className="btn btn-info mx-1" key={`${details.RecordId}1099`} onClick={async() => handleDistBtnClick(distProps)} data-bs-toggle="modal" data-bs-target={`#pdf${details.RecordId}`}>Distribution 1099 Pdf</button> */}
                                </td>
                            </tr>)
                        })}
                    </tbody>
                </table>
                
            </div>

            {distUrl && recordId && <> <W9Pdf url={distUrl} userId={recordId} header="1099 Pdf" />
            </>
        }
        </>
    )
}

export default Records1099Nec

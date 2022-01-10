import React,{useState,useEffect} from "react"
import VendorNavbar from '../../../components/Layout/VendorNavBar'
import absoluteUrl from 'next-absolute-url'
import axios from 'axios'
import moment from 'moment'
import ReactPaginate from "react-paginate"
import "bootstrap-icons/font/bootstrap-icons.css";
import { useUserValue } from '../../../contexts/UserContext'
import { actionTypes } from "../../../contexts/userReducer"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'

export const getServerSideProps = async (context)=>{
    const { params,req,query } = context;
    const { origin } = absoluteUrl(req)

    const userRes = await axios.post(`${origin}/api/affiliate/getAffByPayeeRef`,{
        payeeRef : params.payeeRef
    })
    const user = await userRes.data[0]

    // console.log(`User Start --------`)
    // console.log(user)
    // console.log(`User End --------`)


    const merchantRes = await axios.get(`${origin}/api/affiliate/${user._id}`)
    const merchant =  await merchantRes.data.merchant

    const transRes = await axios.get(`${origin}/api/affiliate/getTransaction/${params.payeeRef}`)
    const transactions = await transRes.data

    const recordRes = await axios.post(`${origin}/api/merchant/get1099RecordsByBusinessId`,{
        businessId:merchant.businessId,
        envName: query.envName
    })
    // const recordRes = await axios.post(`${origin}/api/affiliate/get1099ByPayeeRef`,{
    //     payeeRef : params.payeeRef
    // })
    const record = await recordRes.data

    // console.log(record)
  
    return{
      props:{
        transactions,
        record,
        merchant
      }
    }
}
  
export default function Home(props) {
    const transactions = props.transactions
    const businessId = props.merchant.businessId
    // const payerRef = props.merchant.payerRef
    const record = props.record
    const router = useRouter()
    const envName = router.query.envName
    // console.log(`Payer Ref : ${payerRef}`)

    // const businessId = ""
    // const payerRef = ""
    const [{ user_details,environment,variation }, dispatch] = useUserValue();
    const [limitTransactions,setLimitTrans] =  useState([])
    const [pageNum,setPageNum] = useState(1)
    const [pageCount,setPageCount] = useState()
    const [searchValue,setSearchValue] = useState("")
    const [getPdfLoading,setGetPdfLoading] = useState(false)
    const [requestPdfLoading,setRequestPdfLoading] = useState(false)
    const [draftPdfLoading,setDraftPdfLoading] = useState(false)
    const [distUrlLoading,setDistUrlLoading] = useState(false)
    const [refersionLoading,setRefersionLoading] = useState(false)
    const payeeRef = user_details ? user_details.payeeRef : ""
    
    // const [submissionId,setSubmissionId] = useState("")
    // const [recordId,setRecordId] = useState("")
    // console.log(user_details)

    const handlePageClick = (data)=>{
        setPageNum(data.selected + 1)
    }

    const handle1099Click = async(props)=>{
        setGetPdfLoading(true)
        const res =await axios.post(`/api/get1099Pdf`,{
            submissionId:props.submissionId,
            recordId:props.recordId,
            envName: envName
        })
        const data = res.data

        if(data.status==202)
        {
            setGetPdfLoading(false)
            toast.error(data.message)
        }
        else
        {
            if(data.pdfData == null)
            {
                toast.success(data.recordMessage.Message)
            }
            else
            {   
                window.open(data.pdfData.FilePath, "_blank")
            }
            setGetPdfLoading(false)
        }

    }

    const handleAwsBtnClick =async(props,draft)=>{
        
        if(draft)
        {
            setDraftPdfLoading(true)
        }
        else
        {
            setRequestPdfLoading(true)
        }
        const res =await axios.post(`/api/getAws1099Pdf`,{
            submissionId:props.submissionId,
            recordId:props.recordId,
            envName: envName,
            draft
        })
        const data = await res.data
        // console.log(data)

        if(data.status == 202)
        {
            toast.error(data.Message)
            if(draft)
            {
                setDraftPdfLoading(false)
            }
            else
            {
                setRequestPdfLoading(false)
            }
        }
        else{
            // console.log(data)
           let url = ""
           if(draft)
           {
             url = data.DraftPdfUrl
           }
           else
           {
             url = data.Form1099NecRecords.SuccessRecords[0].Files.Copy1.Masked
           }
           console.log(url)
           const res =await axios(`/api/decryptPdf`,{
                method: 'post',
                responseType: 'blob',
                data:{
                    urlLink: url,
                    recordId:props.recordId,
                    envName: envName
                },
            })

            const pdfData = await res.data

            const file = new Blob(
                [pdfData], 
                {type: 'application/pdf'});
            const fileURL = URL.createObjectURL(file);
            // console.log(fileURL)
            if(draft)
            {
                setDraftPdfLoading(false)
            }
            else
            {
                setRequestPdfLoading(false)
            }
            window.open(fileURL,"_blank");
            
        
        }
    }

    const handleDistBtnClick = async(props)=>{
        // console.log(user_details)
        setDistUrlLoading(true)
        const distData = {
            businessId : businessId,
            recordId : props.recordId,
            payeeRef : user_details.payeeRef,
            // payerRef : payerRef,
            envName: envName
        }

        const res =await axios.post(`/api/getDistributionUrl`,distData)
        const data = await res.data

        // console.log(data)
        setDistUrlLoading(false)
        if(data.status == 202)
        {
            toast.error(data.Message)
        }else
        {
            window.open(data.DistributionUrl,"_blank");
        }

    }

    useEffect(()=>{
        setLimitTrans([])
        if(transactions && searchValue != "")
        {
            const searchResult = []
            transactions.forEach(trans => {

                const transactionDate = trans.transactionDate ? trans.transactionDate : trans.createdAt

                if(trans.sequenceId.includes(searchValue) || trans.txnAmt.includes(searchValue) || moment(transactionDate).format("Do MMM YYYY").includes(searchValue) || trans.description.includes(searchValue) )
                {
                    searchResult.push(trans)
                }               
            })
            const sortedResult = searchResult.slice((pageNum*10)-10, pageNum*10);
            setPageCount(Math.ceil(sortedResult.length / 10))
            setLimitTrans(sortedResult)
        }
        else
        {
            
            const sortedResult = transactions.slice((pageNum*10)-10, pageNum*10);
            setPageCount(Math.ceil(transactions.length / 10))
            setLimitTrans(sortedResult)
        }
        // if(record)
        // {
        //     record.forEach(data=>{
        //         data.Form1099NECRecords.forEach((formRecord)=>{
        //             if(formRecord.PayeeRef == user_details.payeeRef)
        //             {
        //                 setSubmissionId(data.SubmissionId)
        //                 setRecordId(formRecord.RecordId)
        //             }
        //         })
        //     })
            
        // }

        if(variation == "")
        {
            dispatch({
                type: actionTypes.SET_VARIATION_DETAILS,
                data: localStorage.getItem('variant'),
            })
        }

        //eslint-disable-next-line
      },[pageNum,pageCount,searchValue])

    const handleSearchChange = (e)=>{
        setSearchValue(e.target.value)
    }
    const handleRefresh=()=>{
        window.location.reload();
      }

    return (
        <>
            <VendorNavbar />
            <ToastContainer />
            <div className="row my-5 mx-2">
                <div className="col-3">
                    <h4>Transactions List</h4>
                </div>
                <div className="col-9 d-flex flex-row-reverse">
                    <button className="btn btn-secondary mx-1" onClick={handleRefresh}>Refresh <i className="bi bi-arrow-clockwise"></i></button>
                    {variation != "t0-1" && <>
                      <button className="btn btn-sm btn-primary mx-1" onClick={async()=>{
                          setRefersionLoading(true)
                          const res = await axios.post(`/api/merchant/getRequestReviewUrl`,{
                            businessId : businessId,
                            payeeRef: payeeRef,
                            envName: envName
                          })
                          setRefersionLoading(false)
                          window.open(`${res.data.ReviewUrl}`, '_blank');
                        }} disabled={refersionLoading}><i className="bi bi-eye"></i> 1099-NEC {refersionLoading && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button>
                    </>}
                    {variation != "r0-1" && <>
                        { record && record.map(data=>{
                            return data.Form1099NECRecords.map((formRecord)=>{
                                if(formRecord.PayeeRef == payeeRef)
                                {
                                    const distProps = {
                                        submissionId:data.SubmissionId,
                                        payeeRef:formRecord.PayeeRef,
                                        recordId:formRecord.RecordId
                                    }
                                    return (<> 
                                        <button className="btn btn-success mx-1" onClick={()=>handleDistBtnClick(distProps)} disabled={distUrlLoading}><i className="bi bi-download"/> Get Dist 1099 Pdf {distUrlLoading && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button>
                                        <button className="btn btn-info mx-1" onClick={()=>handleAwsBtnClick(distProps,true)} disabled={draftPdfLoading}><i className="bi bi-download" /> Request Draft Pdf {draftPdfLoading && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button>
                                        <button className="btn btn-warning mx-1" onClick={()=>handleAwsBtnClick(distProps,false)} disabled={requestPdfLoading}><i className="bi bi-download" /> Request 1099 Pdf {requestPdfLoading && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button>
                                        <button className="btn btn-primary mx-1" onClick={()=>handle1099Click(distProps)} disabled={getPdfLoading}><i className="bi bi-download"></i> Get 1099 Pdf {getPdfLoading && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button> 
                                    </>)
                                }
                                else{
                                    return(<></>)
                                }
                            })
                        })}
                    </>}
                </div>
            </div>
            <div className="row mx-2 mb-3">
                <div className="col-2 offset-7 d-flex align-items-end flex-column">
                    <h6 className="text-right pt-2">Search</h6>
                </div>
                <div className="col-3">
                    <div className="form-group">
                        <input type="text" className="form-control" id="search" placeholder="Search" onChange={handleSearchChange} />
                    </div>
                </div>
            </div>
            <div className="my-2 mx-2">
                <table className="table table-hover table-striped table-responsive" id="vendorTransTable">
                <thead>
                    <tr>
                    <th>Unique Id</th>
                    <th>Money</th>
                    <th>Description</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                    {limitTransactions && limitTransactions.map((details) => {
                        return (<tr key={details._id}>
                            <td>{details.sequenceId}</td>
                            <td><i className="bi bi-currency-dollar"></i> {details.txnAmt}</td>
                            <td>{details.description}</td>
                            <td>{details.transactionDate ? moment(details.transactionDate).format("Do MMM YYYY") : moment(details.createdAt).format("Do MMM YYYY")}</td>
                        </tr>)}
                    )}
                </tbody>
                </table>
            </div>
            <div className="row">
                <div className="col offset-s4">
                    <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        breakLabel={"..."}
                        pageCount={pageCount?pageCount:0}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination justify-content-center"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                    />
                </div>
            </div>
        </>
    )
}


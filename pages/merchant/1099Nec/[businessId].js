import React,{useState,useEffect,useCallback} from "react"
import MerchantNavBar from "../../../components/Layout/MerchantNavBar"
import { ToastContainer } from "react-toastify"
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'
import AddTransaction from "../../../components/Layout/AddTransaction";
import moment from 'moment'
import Select from 'react-select'
import ReactPaginate from "react-paginate"
import { useRouter } from 'next/router'


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
    // console.log(affiliates)
    // console.log(records)
    return (
        <>
            <MerchantNavBar />
            <ToastContainer />
            <div className="row my-5 mx-2">
                <div className="col-10">
                    <h4>1099 List</h4>
                </div>
                <div className="col-2 text-right">
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addPaymentModal">
                        <i className="bi bi-person-plus-fill"></i> Add Payments
                    </button>                    
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
                            return (<tr key={details._id}>
                                <td>{name}</td>
                                <td>{details.FederalReturnStatus}</td>
                                <td>{details.TaxYear}</td>
                                <td></td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Records1099Nec

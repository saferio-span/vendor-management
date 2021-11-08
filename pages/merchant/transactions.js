import React from "react"
import MerchantNavBar from "../../components/Layout/MerchantNavBar"
import Link from "next/link";
import { useUserValue } from '../../contexts/UserContext'
import { actionTypes } from "../../contexts/userReducer"
import { ToastContainer } from "react-toastify"
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'
import AddTransaction from "../../components/Layout/AddTransaction";

export const getServerSideProps = async (context)=>{
    const { req } = context;
    const { origin } = absoluteUrl(req)
  
    const res = await axios.get(`${origin}/api/affiliate/getAll`)
    const affiliates = await res.data

    const transRes = await axios.get(`${origin}/api/merchant/getAllTransactions`)
    const transactions = await transRes.data

    return{
      props:{
        affiliates,
        transactions
       }
    }
}

const Transactions = (props) => {
    const affiliates = props.affiliates
    const transactions = props.transactions

    console.log(`Affiliates`)
    console.log(affiliates)
    console.log(`Transactions`)
    console.log(transactions)
//     transactions.forEach((details) => {
//     affiliates.forEach(option => {
//         if(option.payeeRef === details.payeeRef)
//         {
//             console.log(`Name loop`)
//             console.log(option.name)
//         }
//     })
// })
  
    return (
        <>
            <MerchantNavBar />
            <ToastContainer />
            <div className="row my-5 mx-2">
                <div className="col-10">
                    <h4>Transactions List</h4>
                </div>
                <div className="col-2 text-right">
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addPaymentModal">
                        <i className="bi bi-person-plus-fill"></i> Add Payments
                    </button>                    
                </div>
            </div>
            <div className="my-2 mx-2">
                <table className="table table-hover table-striped table-responsive">
                <thead>
                    <tr>
                    <th>Affiliate Name</th>
                    <th>Money</th>
                    <th>Description</th>
                    <th>Unique Id</th>
                </tr>
                </thead>
                <tbody>
                    {transactions && transactions.map((details) => {

                        let name = ''
                        affiliates.forEach(option => {
                            console.log(details)
                            if(option.payeeRef === details.payeeRef)
                            {
                                name = option.name
                            }
                        })
                        return (<tr key={details._id}>
                            <td>{name}</td>
                            <td><i className="bi bi-currency-dollar"></i> {details.txnAmt}</td>
                            <td>{details.description}</td>
                            <td>{details.sequenceId}</td>
                        </tr>)
                            }
                                
                    )}
                </tbody>
                </table>
            </div>
            <AddTransaction affiliates = {affiliates} defaultAffiliate = "" />
        </>
        
    )
}

export default Transactions

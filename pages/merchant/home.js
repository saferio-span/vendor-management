import React from "react"
import MerchantNavBar from "../../components/Layout/MerchantNavBar"
import Link from "next/link";
import { ToastContainer } from "react-toastify"
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'
import AddTransaction from "../../components/Layout/AddTransaction";
import W9Pdf from "../../components/Layout/W9Pdf";

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

export default function Home(props) {
  const affiliates = props.affiliates
  const transactions = props.transactions

  return (
    <>
        <MerchantNavBar />
        <ToastContainer />
        <div className="row my-5 mx-2">
          <div className="col-10">
            <h4>Affiliates List</h4>
          </div>
          <div className="col-2 text-right">
            <Link href='/merchant/addAffiliates'>
                <a className="btn btn-primary text-right"><i className="bi bi-person-plus-fill"></i> Add Affiliates</a>
            </Link>
          </div>
        </div>
        <div className="my-2 mx-2">
            <table className="table table-hover table-striped table-responsive">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Total Money</th>
                  <th>No of Transactions</th>
                  <th>W9 Status</th>
                  <th>TIN matching Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {affiliates && affiliates.map((details) => {
                    let amount = 0
                    let transactionCount = 0

                    transactions.forEach(option => {
                        if(option.payeeRef === details.payeeRef)
                        {
                          amount += parseInt(option.txnAmt)
                          transactionCount++
                        }
                    })

                  
                    return (
                    <>
                    <tr key={details._id}>
                        <td>{details.name}</td>
                        <td><i className="bi bi-currency-dollar"></i> {amount}</td>
                        <td>{transactionCount}</td>
                        <td>{details.w9Status ? details.w9Status : "-"}</td>
                        <td>{details.tinMatchingStatus ? details.tinMatchingStatus : "-"}</td>
                        <td>
                          <button key={`${details._id}w9`} className="btn btn-sm btn-warning mx-1" data-bs-toggle="modal" data-bs-target={`#w9Pdf${details.payeeRef}`} ><i className="bi bi-download"></i> W9</button>
                          <button key={`${details._id}pay`} className="btn btn-sm btn-success mx-1" data-bs-toggle="modal" data-bs-target={`#addPaymentModal${details.payeeRef}`}><i className="bi bi-currency-dollar"></i> Pay</button>
                          <button key={`${details._id}1099`} className="btn btn-sm btn-primary mx-1"><i className="bi bi-eye"></i> 1099-NEC</button>
                        </td>
                    </tr>
                    </>
                    )
                        }
                            
                )}
              </tbody>
            </table>
        </div>
        {affiliates && affiliates.map((details) => {
          return (
            <>
              <AddTransaction affiliates = {affiliates} defaultAffiliate = {details.payeeRef} />
              <W9Pdf url={details.pdfUrl} userId={details.payeeRef} />
            </> 
          )
        }
        )}                
    </>
  )
}



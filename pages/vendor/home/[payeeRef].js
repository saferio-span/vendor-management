import React from 'react'
import VendorNavbar from '../../../components/Layout/VendorNavBar'
import absoluteUrl from 'next-absolute-url'
import axios from 'axios'
import moment from 'moment'


export const getServerSideProps = async (context)=>{
    const { params,req } = context;
    console.log(params)
    const { origin } = absoluteUrl(req)

    const transRes = await axios.get(`${origin}/api/affiliate/getTransaction/${params.payeeRef}`)
    const transactions = await transRes.data
  
    return{
      props:{ 
        transactions
      }
    }
  }
  
export default function Home(props) {
    const transactions = props.transactions

    return (
        <>
            <VendorNavbar />
            <div className="row my-5 mx-2">
                <div className="col-10">
                    <h4>Transactions List</h4>
                </div>
            </div>
            <div className="my-2 mx-2">
                <table className="table table-hover table-striped table-responsive">
                <thead>
                    <tr>
                    <th>Unique Id</th>
                    <th>Money</th>
                    <th>Description</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                    {transactions && transactions.map((details) => {
                        return (<tr key={details._id}>
                            <td>{details.sequenceId}</td>
                            <td><i className="bi bi-currency-dollar"></i> {details.txnAmt}</td>
                            <td>{details.description}</td>
                            <td>{moment(details.createdAt).format("Do MMM YYYY")}</td>
                        </tr>)
                            }
                                
                    )}
                </tbody>
                </table>
            </div>
        </>
    )
}


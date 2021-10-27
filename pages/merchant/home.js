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

export const getServerSideProps = async (context)=>{
  const { req } = context;
  const { origin } = absoluteUrl(req)

  const res = await axios.get(`${origin}/api/affiliate/getAll`)
  const affiliates = await res.data
  return{
    props:{ 
      affiliates
     }
  }
}

export default function Home(props) {
  const affiliates = props.affiliates

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
                    return (<tr key={details._id}>
                        <td>{details.name}</td>
                        <td><i class="bi bi-currency-dollar"></i> 1000</td>
                        <td>5</td>
                        <td>Pending</td>
                        <td>Pending</td>
                        <td>
                          <button className="btn btn-sm btn-warning mx-1"><i class="bi bi-download"></i> W9</button>
                          <button className="btn btn-sm btn-success mx-1"><i class="bi bi-currency-dollar"></i> Pay</button>
                          <button className="btn btn-sm btn-primary mx-1"><i class="bi bi-eye"></i> 1099-NEC</button>
                        </td>
                    </tr>)
                        }
                            
                )}
              </tbody>
            </table>
        </div>

    </>
  )
}



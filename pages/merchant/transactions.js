import React,{useState,useEffect} from "react"
import MerchantNavBar from "../../components/Layout/MerchantNavBar"
import { ToastContainer } from "react-toastify"
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'
import AddTransaction from "../../components/Layout/AddTransaction";
import moment from 'moment'
import Select from 'react-select'

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

    const options = []
    const optionAff = props.affiliates
    const [transactions,setTrans] =  useState([])
    const [payeeRef,setPayeeRef] =  useState("")
    // const transactions = props.transactions

    for(const key in props.affiliates )
    {
        options.push({ value: optionAff[key].payeeRef, label: optionAff[key].name })
    }

    const handleSelectChange = (e)=>{
        if(e !== null)
        {
          setPayeeRef(e.value)
        }
        else
        {
          setPayeeRef("")
        }
    }

    useEffect(()=>{
        if(payeeRef === "")
        {
            setTrans(props.transactions)
        }
        else
        {
            setTrans([])
            const result = props.transactions.filter(trans => trans.payeeRef === payeeRef);
            setTrans(result)
        }
        //eslint-disable-next-line
    },[payeeRef])
  
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
            <div className="row mx-2 mb-3">
                <div className="col-2">
                    <h6>Sort by affiliate</h6>
                </div>
                <div className="col-3">
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        defaultValue="0"
                        isSearchable="true"
                        isClearable="true"
                        name="affiliates"
                        options={options}
                        onChange={handleSelectChange}
                    />
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
                        <th>Transaction Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions && transactions.map((details) => {

                        let name = ''
                        optionAff.forEach(option => {
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
                            <td>{moment(details.date).format("Do MMM YYYY")}</td>
                        </tr>)
                            }
                                
                    )}
                </tbody>
                </table>
            </div>
            <AddTransaction affiliates = {optionAff} defaultAffiliate = "" />
        </>
        
    )
}

export default Transactions

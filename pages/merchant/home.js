import React,{useState,useEffect} from "react"
import MerchantNavBar from "../../components/Layout/MerchantNavBar"
import Link from "next/link";
import { ToastContainer } from "react-toastify"
import axios from "axios";
import Select from 'react-select'
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'
import AddTransaction from "../../components/Layout/AddTransaction";
import W9Pdf from "../../components/Layout/W9Pdf";
import ReactPaginate from "react-paginate"

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

  const options = []
  const optionAff = props.affiliates
  const [affiliates,setAffilites] =  useState([])
  const [payeeRef,setPayeeRef] =  useState("")
  const [limitAffiliates,setLimitAffiliates] =  useState([])
  const [pageNum,setPageNum] = useState(1)
  const [pageCount,setPageCount] = useState()
  const transactions = props.transactions
  // const pageCount = 5;
  for(const key in props.affiliates )
  {
      options.push({ value: optionAff[key].payeeRef, label: optionAff[key].name })
  }

  useEffect(()=>{
    setLimitAffiliates([])
    if(payeeRef === "")
    {
        setAffilites(props.affiliates)
        setPageCount(Math.ceil(props.affiliates.length / 5))
    }
    else
    {
        setAffilites([])
        const result = props.affiliates.filter(aff => aff.payeeRef === payeeRef);
        setAffilites(result)
        setPageCount(Math.ceil(result.length / 5))
    }

    const sortedResult = affiliates.slice((pageNum*5)-5, pageNum*5);
    setLimitAffiliates(sortedResult)

    //eslint-disable-next-line
  },[affiliates,payeeRef,pageNum,pageCount])

  const handleSelectChange = (e)=>{
    if(e !== null)
    {
      setPayeeRef(e.value)
    }
    else
    {
      setPayeeRef("")
    }
    setPageNum(1)
  }

  const handlePageClick = (data)=>{
    setPageNum(data.selected + 1)
  }

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
                  <th>Name</th>
                  <th>Total Money</th>
                  <th>No of Transactions</th>
                  <th>W9 Status</th>
                  <th>TIN matching Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {limitAffiliates && limitAffiliates.map((details) => {
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
                        <td>
                          <Link href='/merchant/transactions'>
                            <a className="btn btn-link">{transactionCount}</a>
                          </Link></td>
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
        <div className="row">
            <div className="col offset-s4">
                <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    breakLabel={"..."}
                    pageCount={pageCount}
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
        {limitAffiliates && limitAffiliates.map((details) => {
          return (
            <>
              <AddTransaction affiliates = {optionAff} defaultAffiliate = {details.payeeRef} />
              <W9Pdf url={details.pdfUrl} userId={details.payeeRef} />
            </> 
          )
        }
        )}                
    </>
  )
}



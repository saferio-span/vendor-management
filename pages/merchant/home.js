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
import { useUserValue } from '../../contexts/UserContext'

export const getServerSideProps = async (context)=>{
  const { req,query } = context;
  const { origin } = absoluteUrl(req)

  const merchantRes = await axios.post(`${origin}/api/merchant/getByPayerRef`,{
    payerRef: query.payerRef,
    envName: query.envName,
  })

  const merchant = await merchantRes.data
  console.log(`Merchant`)
  console.log(merchant[0]._id)

  const res = await axios.post(`${origin}/api/affiliate/getAllByMerchnatId`,{
    merchantId : merchant[0]._id,
    envName: query.envName,
  })

  const affiliates = await res.data

  console.log(affiliates)
  const transRes = await axios.post(`${origin}/api/merchant/getAllTransactions`,{
    payerRef: query.payerRef,
  })
  const transactions = await transRes.data

  // console.log(transactions)

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
  const [searchValue,setSearchValue] = useState("")
  const [{user_details,environment},dispatch] = useUserValue();
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
        setPageCount(Math.ceil(props.affiliates.length / 10))
    }
    else
    {
        setAffilites([])
        const result = props.affiliates.filter(aff => aff.payeeRef === payeeRef);
        setAffilites(result)
        setPageCount(Math.ceil(result.length / 10))
    }

    if(affiliates && searchValue != "")
    {
        const searchResult = []
        affiliates.forEach(searchAff => {
          let amount = 0
          let transactionCount = 0

          let w9Status = searchAff.w9Status ? searchAff.w9Status : ""
          let tinStatus = searchAff.tinMatchingStatus ? searchAff.tinMatchingStatus : ""

          transactions.forEach(option => {
              if(option.payeeRef === searchAff.payeeRef)
              {
                amount += parseInt(option.txnAmt)
                transactionCount++
              }
          })
          amount = String(amount)
          transactionCount = String(transactionCount)


          if(searchAff.name.includes(searchValue) || searchAff.payeeRef.includes(searchValue) || amount.includes(searchValue) || transactionCount.includes(searchValue) || w9Status.includes(searchValue) || tinStatus.includes(searchValue) )
          {
              searchResult.push(searchAff)
          }               
        })
        const sortedResult = searchResult.slice((pageNum*10)-10, pageNum*10);
        setLimitAffiliates(sortedResult)
        setPageCount(Math.ceil(sortedResult.length / 10))
    }
    else
    {
        const sortedResult = affiliates.slice((pageNum*10)-10, pageNum*10);
        setLimitAffiliates(sortedResult)
    }

    //eslint-disable-next-line
  },[affiliates,payeeRef,pageNum,pageCount,searchValue])

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

  const handleSearchChange = (e)=>{
      setSearchValue(e.target.value)
  }

  const getReqRevUrl =async ()=>{
    const res = await axios.post(`/api/merchant/getRequestReviewUrl`,{
      businessId : user_details.businessID,
      envName: environment ? environment.name : localStorage.getItem("env")
    })

    window.open(`${res.data.ReviewUrl}`, '_blank');
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
            <h6 className="pt-2">Sort by affiliate</h6>
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
          <div className="col-2 offset-2 d-flex align-items-end flex-column">
              <h6 className="text-right pt-2">Search</h6>
          </div>
          <div className="col-3">
              <div className="form-group">
                  <input type="text" className="form-control" id="search" placeholder="Search" onChange={handleSearchChange} />
              </div>
          </div>
        </div>
        <div className="my-2 mx-2">
            <table className="table table-hover table-striped table-responsive">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Payee Ref</th>
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
                        <td>{details.payeeRef}</td>
                        <td><i className="bi bi-currency-dollar"></i> {amount}</td>
                        <td>
                          <Link href={{ pathname: '/merchant/transactions', query: { payerRef:user_details.payerRef,payeeRef: details.payeeRef,envName: environment ? environment.name : localStorage.getItem("env") } }} >
                            <a className="btn btn-link">{transactionCount}</a>
                          </Link></td>
                        <td>{details.w9Status ? details.w9Status : "-"}</td>
                        <td>{details.tinMatchingStatus ? details.tinMatchingStatus : "-"}</td>
                        <td>  
                          {details.w9Status ? <><button key={`${details._id}w9`} className="btn btn-sm btn-warning mx-1" data-bs-toggle="modal" data-bs-target={`#w9Pdf${details.payeeRef}`} ><i className="bi bi-download"></i> W9</button></> : <></> }
                          <button key={`${details._id}pay`} className="btn btn-sm btn-success mx-1" data-bs-toggle="modal" data-bs-target={`#addPaymentModal${details.payeeRef}`}><i className="bi bi-currency-dollar"></i> Pay</button>
                          <button key={`${details._id}1099`} className="btn btn-sm btn-primary mx-1" onClick={async()=>{
    const res = await axios.post(`/api/merchant/getRequestReviewUrl`,{
      businessId : user_details.businessID,
      payeeRef: details.payeeRef,
      envName: environment ? environment.name : localStorage.getItem("env")
    })

    window.open(`${res.data.ReviewUrl}`, '_blank');
  }}><i className="bi bi-eye"></i> 1099-NEC</button>
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



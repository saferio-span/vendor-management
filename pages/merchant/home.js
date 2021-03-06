import React,{useState,useEffect} from "react"
import MerchantNavBar from "../../components/Layout/MerchantNavBar"
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify"
import axios from "axios";
import Select from 'react-select'
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'
import AddTransaction from "../../components/Layout/AddTransaction";
import ReactPaginate from "react-paginate"
import { useUserValue } from '../../contexts/UserContext'
import { actionTypes } from "../../contexts/userReducer"
import { useRouter } from 'next/router'

export const getServerSideProps = async (context)=>{
  
  const { req,query } = context;
  const { origin } = absoluteUrl(req)
  const merchantRes = await axios.post(`${origin}/api/merchant/getByPayerRef`,{
    payerRef: query.payerRef,
    envName: query.envName,
  })

  const merchant = await merchantRes.data
  // console.log(`Merchant`)
  // console.log(merchant[0]._id)

  const res = await axios.post(`${origin}/api/affiliate/getAllByMerchnatId`,{
    merchantId : merchant[0]._id,
    envName: query.envName,
  })

  const affiliates = await res.data

  // console.log(affiliates)
  const transRes = await axios.post(`${origin}/api/merchant/getAllTransactions`,{
    payerRef: query.payerRef,
  })
  const transactions = await transRes.data

  // console.log(transactions)

  return{
    props:{ 
      affiliates,
      transactions,
    }
  }
}

export default function Home(props) {

  const router = useRouter()
  const options = []
  const optionAff = props.affiliates
  const [affiliates,setAffilites] =  useState([])
  const [payeeRef,setPayeeRef] =  useState("")
  const [limitAffiliates,setLimitAffiliates] =  useState([])
  const [pageNum,setPageNum] = useState(1)
  const [pageCount,setPageCount] = useState()
  const [searchValue,setSearchValue] = useState("")
  const [{user_details,environment,variation},dispatch] = useUserValue();
  const transactions = props.transactions
  const envName = router.query.envName
  
  const initalLoaders = {}
  
  // const pageCount = 5;
  for(const key in props.affiliates )
  {
      options.push({ key: optionAff[key].payeeRef, value: optionAff[key].payeeRef, label: optionAff[key].name })
      const w9 = `${optionAff[key].payeeRef}_w9`
      const ref1099 = `${optionAff[key].payeeRef}_1099`
      initalLoaders[w9] = false
      initalLoaders[ref1099] = false
  }
  const [loaders,setLoaders] = useState(initalLoaders)
  // console.log(loaders)


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

    if(variation == "")
    {
      dispatch({
        type: actionTypes.SET_VARIATION_DETAILS,
        data: localStorage.getItem('variant'),
      })
    }
    // console.log(loaders)
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

  const handleRefresh=()=>{
    window.location.reload();
  }

  const handleW9Click = (payeeRef)=>{
    const loaderName = `${payeeRef}_w9`
    setLoaders({ ...loaders, [loaderName] : true });
    router.push({ 
      pathname: `/merchant/w9Form/${payeeRef}`, 
      query: { envName: envName } })
  }

  const getReqRevUrl =async ()=>{
    const res = await axios.post(`/api/merchant/getRequestReviewUrl`,{
      businessId : user_details.businessID,
      envName: envName
    })

    window.open(`${res.data.ReviewUrl}`, '_blank');
  }

  return (
    <>
        <MerchantNavBar />
        <ToastContainer />
        <div className="container-fluid">
        <div className="row my-5 mx-2">
          <div className="col-9">
            <h4>Payee List</h4>
          </div>
          <div className="col-3 text-right d-flex flex-row-reverse">
          {variation != "r0-1" &&
            <Link href={{ pathname: '/merchant/addAffiliates', query: { envName: envName } }} >
                <a className="btn btn-primary text-right mr-1"><i className="bi bi-person-plus-fill"></i> Add Payees</a>
            </Link>
          }
            <button className="btn btn-secondary mx-1" onClick={handleRefresh}>Refresh <i className="bi bi-arrow-clockwise"></i></button>
          </div>
        </div>
        <div className="row mx-2 mb-3">
          <div className="col-2">
            <h6 className="pt-2">Sort by payees</h6>
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
                  <th>W9/W8BEN Status</th>
                  <th>TIN matching Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {limitAffiliates && limitAffiliates.map((details) => {
                    // console.log(details)
                    let amount = 0
                    let transactionCount = 0
                    let w9ButtonName = "W9/W8BEN"

                    // if(details.formType)
                    // {
                    //   if(details.formType == "FormW8Ben")
                    //   {
                    //     w9ButtonName = "W8Ben"
                    //   }
                    // }

                    transactions.forEach(option => {
                        if(option.payeeRef === details.payeeRef)
                        {
                          amount += Number(option.txnAmt)
                          transactionCount++
                        }
                    })
                    return (
                    <tr key={details._id}>
                        <td>{details.name}</td>
                        <td>{details.payeeRef}</td>
                        <td><i className="bi bi-currency-dollar"></i> {amount.toFixed(2)}</td>
                        <td>
                          <Link href={{ pathname: '/merchant/transactions', query: { payerRef:user_details ? user_details.payerRef:"",payeeRef: details.payeeRef,envName: envName } }} >
                            <a className="btn btn-link">{transactionCount}</a>
                          </Link></td>
                        <td>{details.w9Status ? details.w9Status : "-"}</td>
                        <td>{details.tinMatchingStatus ? details.tinMatchingStatus : "-"}</td>
                        <td>  
                          <div className="row">
                            <div className="col p-0">
                              {details.w9Status !== "-" ? <>  
                                <button className="btn btn-sm btn-warning mx-1" onClick={()=>handleW9Click(details.payeeRef)} disabled={loaders[`${details.payeeRef}_w9`]}><i className="bi bi-file-earmark-pdf"></i> {w9ButtonName} {loaders[`${details.payeeRef}_w9`] && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button></> : <><button className="btn btn-sm btn-warning mx-1" disabled><i className="bi bi-file-earmark-pdf"></i> W9/W8BEN</button>
                              </> 
                              }
                              <button key={`${details._id}pay`} className="btn btn-sm btn-success mx-1" data-bs-toggle="modal" data-bs-target={`#addPaymentModal${details.payeeRef}`}><i className="bi bi-currency-dollar"></i> Pay</button>
                            
                              {variation != "t0-1" && <button key={`${details._id}1099`} className="btn btn-sm btn-primary mx-1" onClick={async()=>{
                                    const loaderName = `${details.payeeRef}_1099`
                                    setLoaders({ ...loaders, [loaderName] : true });
                                    
                                    const res = await axios.post(`/api/merchant/getRequestReviewUrl`,{
                                      businessId : user_details.businessID,
                                      payeeRef: details.payeeRef,
                                      envName: envName
                                    })
                                    if(res.status == 202)
                                    {
                                      toast.error(res.data.Message)
                                    }
                                    else
                                    {
                                      window.open(`${res.data.ReviewUrl}`, '_blank');
                                    }
                                    setLoaders({ ...loaders, [loaderName] : false });
                                    
                                  }} disabled={loaders[`${details.payeeRef}_1099`]}><i className="bi bi-eye"></i> Merchant Portal {loaders[`${details.payeeRef}_1099`] && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button>
                                
                              }
                            </div>
                          </div>
                        </td>
                    </tr>
                    )
                        }
                            
                )}
              </tbody>
            </table>
        </div>
        <div className="row">
            <div className="col-4 offset-4">
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
        {limitAffiliates && limitAffiliates.map((details,index) => {
          // console.log(details)
          return <AddTransaction key={`${details.payeeRef}_${index}`} affiliates = {optionAff} defaultAffiliate = {details.payeeRef} />
        }
        )} 
        </div>               
    </>
  )
}



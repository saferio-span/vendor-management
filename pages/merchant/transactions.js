import React,{useState,useEffect,useCallback} from "react"
import MerchantNavBar from "../../components/Layout/MerchantNavBar"
import { ToastContainer } from "react-toastify"
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'
import AddTransaction from "../../components/Layout/AddTransaction";
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

    // console.log(affiliates)

    const transRes = await axios.post(`${origin}/api/merchant/getAllTransactions`,{
        payerRef: query.payerRef,
        envName: query.envName,
    })
    const transactions = await transRes.data

    console.log(transactions)

    return{
      props:{
        affiliates,
        transactions
       }
    }
}

const Transactions = (props) => {
    // console.log("Aff")
    // console.log(props.affiliates)
    // console.log("Aff")

    const router = useRouter()
    const paramPayeeRef = router.query.payeeRef ? router.query.payeeRef : ""
    const options = []
    const optionAff = props.affiliates
    const [transactions,setTrans] =  useState([])
    const [payeeRef,setPayeeRef] =  useState(paramPayeeRef)
    // const transactions = props.transactions
    const [limitTransactions,setLimitTrans] =  useState([])
    const [pageNum,setPageNum] = useState(1)
    const [pageCount,setPageCount] = useState()
    const [searchValue,setSearchValue] = useState("")

    for(const key in props.affiliates )
    {
        options.push({ value: optionAff[key].payeeRef, label: optionAff[key].name })
    }
    
    // const emptyTrans = useCallback(()=>{
    //     setLimitTrans([])
    // })

    const updateTransaction = (trans)=>{
        setTrans(trans)
    }

    const updatepageCount = (count)=>{
        setPageCount(count)
    }

    const updateLimitedTransaction = (trans)=>{
        setLimitTrans(trans)
    }

    useEffect(()=>{
        
        updateLimitedTransaction([])
        updateTransaction([])
        if(payeeRef === "")
        {
            updateTransaction(props.transactions)
            updatepageCount(Math.ceil(props.transactions.length / 10))
        }
        else
        {
            const result = props.transactions.filter(trans => trans.payeeRef === payeeRef);
            updateTransaction(result)
            updatepageCount(Math.ceil(result.length / 10))
        }

        if(transactions && searchValue != "")
        {
            const searchResult = []
            transactions.forEach(trans => {
                let affname = ''
                optionAff.forEach(option => {
                    if(option.payeeRef === trans.payeeRef)
                    {
                        affname = option.name
                    }
                })

                const transactionDate = trans.transactionDate ? trans.transactionDate : trans.createdAt

                if(trans.sequenceId.includes(searchValue) || affname.includes(searchValue) || trans.txnAmt.includes(searchValue) || moment(transactionDate).format("Do MMM YYYY").includes(searchValue) || trans.description.includes(searchValue) )
                {
                    searchResult.push(trans)
                }               
            })
            const sortedResult = searchResult.slice((pageNum*10)-10, pageNum*10);
            updateLimitedTransaction(sortedResult)
            updatepageCount(Math.ceil(transactions.length / 10))
        }
        else
        {
            const sortedResult = transactions.slice((pageNum*10)-10, pageNum*10);
            updateLimitedTransaction(sortedResult)
            updatepageCount(Math.ceil(transactions.length / 10))
        }
        
        //eslint-disable-next-line
    },[transactions,payeeRef,pageNum,pageCount,searchValue])

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
                    <h6 className="text-right pt-2">Sort by affiliate</h6>
                </div>
                <div className="col-3">
                    <Select
                        value = {
                            options.filter(option => 
                            option.value === payeeRef)
                        }
                        className="basic-single"
                        classNamePrefix="select"
                        defaultValue="0"
                        isSearchable="true"
                        isClearable="true"
                        name="affiliates"
                        options={options}
                        onChange={handleSelectChange}
                        id="affFilter"
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
            <div className="row my-2 mx-2">
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
                    {limitTransactions && limitTransactions.map((details) => {

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
                            <td>{details.transactionDate ? moment(details.transactionDate).format("Do MMM YYYY") : moment(details.createdAt).format("Do MMM YYYY")}</td>
                        </tr>)
                    })}
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
            <AddTransaction affiliates = {optionAff} defaultAffiliate = "" />
        </>
    )
}

export default Transactions

import React,{useState,useEffect} from "react"
import VendorNavbar from '../../../components/Layout/VendorNavBar'
import absoluteUrl from 'next-absolute-url'
import axios from 'axios'
import moment from 'moment'
import ReactPaginate from "react-paginate"

export const getServerSideProps = async (context)=>{
    const { params,req } = context;
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
    const [limitTransactions,setLimitTrans] =  useState([])
    const [pageNum,setPageNum] = useState(1)
    const [pageCount,setPageCount] = useState()
    const [searchValue,setSearchValue] = useState("")

    const handlePageClick = (data)=>{
        setPageNum(data.selected + 1)
    }

    useEffect(()=>{
        setLimitTrans([])

        if(transactions && searchValue != "")
        {
            const searchResult = []
            transactions.forEach(trans => {

                const transactionDate = trans.transactionDate ? trans.transactionDate : trans.createdAt

                if(trans.sequenceId.includes(searchValue) || trans.txnAmt.includes(searchValue) || moment(transactionDate).format("Do MMM YYYY").includes(searchValue) || trans.description.includes(searchValue) )
                {
                    searchResult.push(trans)
                }               
            })
            const sortedResult = searchResult.slice((pageNum*10)-10, pageNum*10);
            setPageCount(Math.ceil(sortedResult.length / 10))
            setLimitTrans(sortedResult)
        }
        else
        {
            
            const sortedResult = transactions.slice((pageNum*10)-10, pageNum*10);
            setPageCount(Math.ceil(transactions.length / 10))
            setLimitTrans(sortedResult)
        }

        //eslint-disable-next-line
      },[pageNum,pageCount,searchValue])

    const handleSearchChange = (e)=>{
        setSearchValue(e.target.value)
    }

    return (
        <>
            <VendorNavbar />
            <div className="row my-5 mx-2">
                <div className="col-10">
                    <h4>Transactions List</h4>
                </div>
            </div>
            <div className="row mx-2 mb-3">
                <div className="col-2 offset-7 d-flex align-items-end flex-column">
                    <h6 className="text-right pt-2">Search</h6>
                </div>
                <div className="col-3">
                    <div className="form-group">
                        <input type="text" className="form-control" id="search" placeholder="Search" onChange={handleSearchChange} />
                    </div>
                </div>
            </div>
            <div className="my-2 mx-2">
                <table className="table table-hover table-striped table-responsive" id="vendorTransTable">
                <thead>
                    <tr>
                    <th>Unique Id</th>
                    <th>Money</th>
                    <th>Description</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                    {limitTransactions && limitTransactions.map((details) => {
                        return (<tr key={details._id}>
                            <td>{details.sequenceId}</td>
                            <td><i className="bi bi-currency-dollar"></i> {details.txnAmt}</td>
                            <td>{details.description}</td>
                            <td>{moment(details.date).format("Do MMM YYYY")}</td>
                        </tr>)}
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
        </>
    )
}


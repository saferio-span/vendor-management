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

    const handlePageClick = (data)=>{
        setPageNum(data.selected + 1)
    }

    useEffect(()=>{
        setLimitTrans([])
        setPageCount(Math.ceil(transactions.length / 5))
        const sortedResult = transactions.slice((pageNum*5)-5, pageNum*5);
        setLimitTrans(sortedResult)
    
        //eslint-disable-next-line
      },[pageNum,pageCount])

    return (
        <>
            <VendorNavbar />
            <div className="row my-5 mx-2">
                <div className="col-10">
                    <h4>Transactions List</h4>
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


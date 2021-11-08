import React from 'react'
import VendorNavbar from '../../components/Layout/VendorNavBar'


export const getServerSideProps = async (context)=>{
    const { req } = context;
    console.log(req.query)
    // const { origin } = absoluteUrl(req)

    // const transRes = await axios.get(`${origin}/api/merchant/getAllTransactions`)
    // const transactions = await transRes.data
  
    return{
      props:{ 
        transactions:''
      }
    }
  }
  
export default function Home(props) {

    return (
        <>
            <VendorNavbar />
            <div>
                Home
            </div>
        </>
    )
}


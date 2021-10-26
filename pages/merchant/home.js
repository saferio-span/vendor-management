import React,{useEffect} from "react"
import { getSession } from "next-auth/client"
import MerchantNavBar from "../../components/Layout/MerchantNavBar"
import { useUserValue } from '../../contexts/UserContext'
import { actionTypes } from "../../contexts/userReducer"

export const getServerSideProps = async (context)=>{
  const session = await getSession(context)

  if(!session)
  {
    return{
      redirect:{
        destination: '/merchant/login',
        permanent: false
      }
    }
  }
  else
  {
    // dispatch({
    //   type: actionTypes.SET_SESSION_DATA,
    //   data: session,
    // });
  }

  return{
    props:{ session }
  }
}



export default function Home(props) {
  console.log(`Home Props`)
  console.log(props)
  const [{session_user},dispatch] = useUserValue();
  useEffect(()=>{
    dispatch({
      type: actionTypes.SET_SESSION_DATA,
      data: props.session,
    })
  },[])

  return (
    <>
        <MerchantNavBar />
        <h1>
          Landing Page
        </h1>

    </>
  )
}



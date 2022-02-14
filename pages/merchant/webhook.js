import React,{useEffect,useState} from 'react'
import PostList from '../../components/Layout/PostList';
import absoluteUrl from 'next-absolute-url'
import MerchantNavBar from "../../components/Layout/MerchantNavBar"
import axios from 'axios';
import { useUserValue } from '../../contexts/UserContext'
import { actionTypes } from "../../contexts/userReducer"
import Link from "next/link"
import Select from 'react-select'

export const getServerSideProps = async (context)=>{
    const { req,query } = context;
    const { origin } = absoluteUrl(req)

    const res = await axios.post(`${origin}/api/merchant/getWebHook`,{
        envName: query.envName
    })
    const webHook = await res.data

    console.log(webHook)

    const res1099 = await axios.post(`${origin}/api/merchant/get1099StatusHook`,{
        envName: query.envName
    })
    const webHook1099 = await res1099.data

    const pdfRes = await axios.post(`${origin}/api/merchant/getPdfStatus`,{
        envName: query.envName
    })
    const webHookPdf = await pdfRes.data

    const businessCompletyeRes = await axios.post(`${origin}/api/merchant/getBusinessHook`,{
        envName: query.envName
    })
    const webHookBusiness = await businessCompletyeRes.data

    return{
        props:{
          env:query.envName,
          webHook,
          webHook1099,
          webHookPdf,
          webHookBusiness,
          pageUrl:req.url
        }
    }
}

const WebHook = (props) => {
    const [webHook,setWebHook]=useState([])
    const [webHookType,setWebhookType] = useState("whCertificate")
    const [{user_details,environment,variation},dispatch] = useUserValue();

    const handleHookChange = (name)=>{
        console.log(name)
        setWebhookType(name)
    }

    useEffect(() => {
        if(webHookType == "whCertificate")
        {
            setWebHook(props.webHook)
        }

        if(webHookType == "1099NecStatus")
        {
            setWebHook(props.webHook1099)
        }

        if(webHookType == "pdfComplete")
        {
            setWebHook(props.webHookPdf)
        }

        if(webHookType == "businessComplete")
        {
            setWebHook(props.webHookBusiness)
        }

        //eslint-disable-next-line
    }, [webHookType])
    console.log(webHook)

    return (
        <>
            <MerchantNavBar />
            <div className="container">
                <ul className="nav nav-tabs my-2">
                    <li className="nav-item">
                        {/* <a className="nav-link pe-auto" onChange={()=>handleHookChange("whCertificate")}>Wh Certificate</a> */}
                        <button className="nav-link pe-auto" onClick={()=>handleHookChange("whCertificate")}>Wh Certificate</button>
                    </li>
                    {
                       variation != "r0-1" && <>
                    <li className="nav-item">
                        {/* <a className="nav-link pe-auto" onChange={()=>handleHookChange("1099NecStatus")}>1099 Nec Status</a> */}
                        <button className="nav-link pe-auto" onClick={()=>handleHookChange("1099NecStatus")}>1099 Nec Status</button>
                    </li>
                    <li className="nav-item">
                        {/* <a className="nav-link pe-auto" onChange={()=>handleHookChange("pdfComplete")}>Pdf Complete</a> */}
                        <button className="nav-link pe-auto" onClick={()=>handleHookChange("pdfComplete")}>Pdf Complete</button>
                    </li>
                    </>}
                    {
                       variation != "t0-1" && <>
                    <li className="nav-item">
                        {/* <a className="nav-link pe-auto" onChange={()=>handleHookChange("pdfComplete")}>Pdf Complete</a> */}
                        <button className="nav-link pe-auto" onClick={()=>handleHookChange("businessComplete")}>Business Complete</button>
                    </li>
                    </>}
                </ul>
                {webHook && <PostList posts={webHook} />}
                {webHook.length === 0 && <h5>Records not found</h5> }
            </div>
        </>
    )
}

export default WebHook

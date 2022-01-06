import React,{useState} from 'react'
import Link from "next/link";
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import {useRouter} from 'next/router'
import 'react-toastify/dist/ReactToastify.css';
import { useUserValue } from '../../contexts/UserContext'
import MoonLoader from "react-spinners/MoonLoader";
import absoluteUrl from 'next-absolute-url'

export const getServerSideProps = async (context)=>{
    const { req } = context;
    const { origin } = absoluteUrl(req)
    // console.log(origin)
    return {
        props : {
            origin
        }
      }
}

const SignUpPif = (props) => {
    const random = Math.floor((Math.random() * 1000000000) + 1)
    const [loading,setLoading]=useState(false)
    const [{user_details,environment},dispatch] = useUserValue();
    const router = useRouter()
    const envName = router.query.envName
    const [payerRef,setPayerRef] = useState(`Pr${random}`)
    const [url,setUrl] = useState("")
    const [showForm,setShowForm] = useState(true)
    
    const handleSubmit =async ()=>{
        setLoading(true)
        setShowForm(false)
        const res = await axios.post('/api/merchant/requestByUrl',{
            envName: envName,
            payerRef: payerRef,
            returnUrl :`${origin}/merchant/login?envName=${envName}`
        })
        const data = res.data
        console.log(data)
        
        if(res.status == 200)
        {
            console.log(data.BusinessUrl)
            setUrl(data.BusinessUrl)
        }

        if(res.status == 202)
        {
            setLoading(false)
            setShowForm(true)
            toast.error(data.Message)
        }
    }

    const handleInputChange = (e)=>{
        const { name, value } = e.target;
        setPayerRef(value)
    }

    return (
        <>
           <h1 className="d-flex justify-content-center align-items-center my-5 "> Sign up using PIF</h1>
           <ToastContainer />
           <div className="container bg-light">
              <br />
              
                    {showForm && <>
                        <div className="col-6 offset-3">
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="payeeRef">Payer Ref<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="payeeRef" name="payeeRef" value={payerRef} placeholder="Payee Ref" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-center">
                                    <button type="submit" className="btn btn-success my-2" value="Submit" disabled={loading}>Get PIF Form {loading && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button>
                                </div>
                            </div>
                        </form>
                        <hr />
                        <div className="">
                            Already have an account ? -<Link href={{ pathname: '/merchant/login', query: { envName: envName}}}>
                                <a className="btn btn-link">Sign In !</a>
                            </Link>
                        </div>
                        <br />
                        </div>
           </>}
           {loading && <>
                <div className='my-5 d-flex justify-content-center'>
                    <MoonLoader className="my-5" color="#F26C20" loading={loading} size={100} />
                </div>
            </>}
           {
               
               !showForm && <>
                {
                  url !== "" && <>
                  <div className="col">
                  <Link href={url}>
                    <a target="_blank">{url}</a>
                  </Link>
                  <iframe className="my-1" title="wh" width="100%" height="600" onLoad={()=>setLoading(false)} src={url} /></div></>
                } 
               </>
           }
           
        </div></>
    )
}

export default SignUpPif

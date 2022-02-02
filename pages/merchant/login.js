import React,{useEffect,useState} from 'react'
import style from "../../styles/Login.module.css"
import Router,{useRouter} from 'next/router'
import Link from "next/link";
import { toast,ToastContainer } from "react-toastify"
import axios from "axios"
import 'react-toastify/dist/ReactToastify.css';
import { useUserValue } from '../../contexts/UserContext'
import { actionTypes } from "../../contexts/userReducer"
import Select from 'react-select'
import absoluteUrl from 'next-absolute-url'
import { credentials,urls } from '../../config/variables';

export const getServerSideProps = async (context)=>{
    const { req,query } = context;
    const { origin } = absoluteUrl(req)
  
    console.log(query.envName);
    const merchantRes = await axios.post(`${origin}/api/merchant/getAll`,{
      envName: query.envName,
    })
  
    const merchant = await merchantRes.data

    console.log(merchant);

    return{
      props:{ 
        merchant
      }
    }
}

// const Login = ({providers,session,host}) => {
const Login = (props) => {
    // console.log(credentials)
    const merchants = props.merchant

    console.log(merchants);
    // const [values, setValues] = useState({
    //     email: '',
	// 	// password: '',
	// });
    const [merchantId,setMerchantId]= useState("")
    const [loading,setLoading]=useState(false)
    const router = useRouter()
    const envName = router.query.envName
    const options = []
    
    const [{user_details,environment,variation},dispatch] = useUserValue();
    // console.log(environment)
    for(const key in merchants )
    {
        const name = `${merchants[key].name} (${merchants[key].email})`
        options.push({ value: merchants[key]._id, label: name,key: merchants[key]._id })
    }
    const setEnvironment = async()=>{
        const envName = envName
        const googleEmail = localStorage.getItem('googleEmail')
        const envRes = await axios.post(`${origin}/api/getEnvByName`,{
            email: googleEmail,
            envName : envName
        })
        const environCreds = await envRes.data

        // localStorage.clear();
        dispatch({
            type: actionTypes.SET_ENVIRONMENT_DETAILS,
            data: environCreds[0],
        })
    }
    
    useEffect(()=>{

        // const sess_email = localStorage.getItem('email')
        // console.log(environment)
        if(environment === undefined)
        {
            setEnvironment()
        }
     
        if(user_details)
        {
            Router.push({
                pathname: '/merchant/home',
                query: { 
                    payerRef : user_details.payerRef,
                    envName: environment != undefined ? environment.name : envName
                }
            })
        }

        if(variation == "")
        {
            dispatch({
                type: actionTypes.SET_VARIATION_DETAILS,
                data: localStorage.getItem('variant'),
            })
        }
        

        //eslint-disable-next-line  
    },[])
    // if(session) return null

    const handleSubmit = async (e)=>{
        e.preventDefault()    
        setLoading(true)  
        
        // const hasEmptyField = Object.values(values).some((element)=>element==='')
        if(merchantId=="") 
        {
            toast.error("Please select payer to login")
            setLoading(false)  
            return false
        }
        else
        {
            const user = merchants.filter(data=>data._id==merchantId)

            localStorage.setItem('email',user[0].email)
            localStorage.setItem('id',user[0]._id)
            localStorage.setItem('name',user[0].name)
            dispatch({
                type: actionTypes.SET_USER_DETAILS,
                data: user[0],
            })
            setLoading(false)
            Router.push({
                pathname: '/merchant/home',
                query: { 
                    payerRef : user[0].payerRef,
                    envName: envName
                }
            })
        }

        // try {

            // const res = await axios.post(`/api/merchant/login`,{
            //     email: values.email,
            //     // password: values.password,
            //     env: environment
            // })

            // const user = await res.data
            // if(user.length)
            // {
                // localStorage.setItem('email',user[0].email)
                // localStorage.setItem('id',user[0]._id)
                // localStorage.setItem('name',user[0].name)
                // dispatch({
                //     type: actionTypes.SET_USER_DETAILS,
                //     data: user[0],
                // })

                // // console.log(user[0])
                // // Router.push('/merchant/home')
                // setLoading(false)
                // Router.push({
                //     pathname: '/merchant/home',
                //     query: { 
                //         payerRef : user[0].payerRef,
                //         envName: envName
                //     }
                // })
            // }
        //   } catch (error) {
        //     // toast.error("Invalid Email Id or Password")
        //     setLoading(false)
        //     toast.error("Invalid Email Id")
        //     // console.log(error)
        //     return null
        //   }


        // signIn(providers.credentials.id,{
        //     email: values.email,
        //     password: values.password,
        //     url: host
        // })
    }

    const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	};

    const handleSelectChange = (e)=>{
        if(e !== null)
        {
            setMerchantId(e.value);
        }
        else
        {
            setValues("");
        }
    }
 
    return (
        <>
            <ToastContainer />
            {/* <h1 className="d-flex justify-content-center align-items-center my-5 "> Vendor Management</h1> */}
            <div className={`${style.loginContainer} d-flex justify-content-center align-items-center my-5`}>
                <div className={`${style.innerContainer} border border-1 max-auto p-4 shadow`}>
                    <div className="row">
                        <div className="col-10">
                            <h3 className={`${style.heading} fw-bolder text-center text-uppercase`}>
                                     Payer Login
                            </h3>
                        </div>
                        <div className="col-2">
                            <Link href='/'>
                                <a className="btn btn-warning">Back</a>
                            </Link>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group my-2">
                            <label htmlFor="email" className='my-1'>Payer</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue="0"
                                isSearchable="true"
                                isClearable="true"
                                name="payer"
                                options={options}
                                onChange={handleSelectChange}
                            />
                            {/* <input type="email" className="form-control my-2" id="email" name="email" placeholder="Email" onChange={handleInputChange} /> */}
                        </div>
                        {/* <div className="form-group my-2">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control my-2" id="password" name="password" placeholder="Password" onChange={handleInputChange} />
                        </div> */}
                        {/* <input type="submit" className="btn btn-success w-100 my-2 py-3" value="Sign In" /> */}
                        <button type="submit" className="btn btn-success w-100 my-2 py-3" value="Submit" disabled={loading}>Sign In {loading && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button>
                    </form>
                    <hr />
                    {variation == "t0-1" && <>Don{`'`}t have an account ? - <Link href={{ pathname: '/merchant/signUp', query: { envName: envName}}}><a className="btn btn-link">Sign Up !</a></Link></>}
                    {variation == "r0-1" && <>Don{`'`}t have an account ? - <Link href={{ pathname: '/merchant/signUpPif', query: { envName: envName}}}><a className="btn btn-link">Sign Up !</a></Link></>}
                    {variation == "all" && <>Have an account ? - <Link href={{ pathname: '/merchant/signUp', query: { envName: envName}}}><a className="btn btn-sm btn-link">Sign Up (BC)! </a></Link> | <Link href={{ pathname: '/merchant/signUpPif', query: { envName: envName}}}><a className="btn btn-sm btn-link">Sign Up (PIF)! </a></Link></>}
                </div>
            </div>
        </>   
    )
}

// Login.getInitialProps = async (context) => {
//     const { req, query, res, asPath, pathname } = context;
//     const { origin } = absoluteUrl(req)
//     return{
//         providers: await providers(context),
//         session: await getSession(context),
//         host: origin
//     }
// }

export default Login

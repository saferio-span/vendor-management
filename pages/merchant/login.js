import React,{useEffect,useState} from 'react'
import {providers,getSession,signIn} from "next-auth/client"
import style from "../../styles/Login.module.css"
import LoginBtn from '../../components/LoginBtn'
import Router from 'next/router'
import Link from "next/link";
import { toast,ToastContainer } from "react-toastify"
import axios from "axios"
import 'react-toastify/dist/ReactToastify.css';
import { useUserValue } from '../../contexts/UserContext'
import { actionTypes } from "../../contexts/userReducer"
import absoluteUrl from 'next-absolute-url'

// const Login = ({providers,session,host}) => {
const Login = () => {
    // console.log({session,host})
    const [values, setValues] = useState({
        email: '',
		password: ''
	});
    const [{user_details},dispatch] = useUserValue();
    
    useEffect(()=>{

        // const sess_email = localStorage.getItem('email')
        if(user_details)
        {
            Router.push('/merchant/home')
        }
        // if(session) Router.push('/merchant/home')
    })
    // if(session) return null

    const handleSubmit = async (e)=>{
        e.preventDefault()      
        const hasEmptyField = Object.values(values).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields")
            return false
        }

        try {
            const res = await axios.post(`/api/merchant/login`,{
                email: values.email,
                password: values.password,
            })
            const user = await res.data
            if(user.length)
            {
                localStorage.setItem('email',user[0].email)
                localStorage.setItem('id',user[0]._id)
                localStorage.setItem('name',user[0].name)
                dispatch({
                    type: actionTypes.SET_USER_DETAILS,
                    data: user[0],
                })
                Router.push('/merchant/home')
            }
          } catch (error) {
            console.log(error)
            return null
          }


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
 
    return (
        <>
            <ToastContainer />
            <h1 className="d-flex justify-content-center align-items-center my-5 "> Vendor Management</h1>
            <div className={`${style.loginContainer} d-flex justify-content-center align-items-center my-5`}>
                <div className={`${style.innerContainer} border border-1 max-auto p-4 shadow`}>
                    
                    <h2 className={`${style.heading} text-center fw-bolder text-uppercase`}>
                       Merchant Login
                    </h2>

                    {/* <LoginBtn
                        provider={providers.google}
                        bgColor='#f2573f'
                        txtColor="white"
                    />
                    <LoginBtn
                        provider={providers.facebook}
                        bgColor='#0404be'
                        txtColor="white"
                    />
                    <hr /> */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group my-2">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control my-2" id="email" name="email" placeholder="Email" onChange={handleInputChange} />
                        </div>
                        <div className="form-group my-2">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control my-2" id="password" name="password" placeholder="Password" onChange={handleInputChange} />
                        </div>
                        <input type="submit" className="btn btn-success w-100 my-2 py-3" value="Sign In" />
                    </form>
                    <hr />
                    Don't have an account ? -<Link href='/merchant/signUp'>
                        <a className="btn btn-link">Sign Up !</a>
                    </Link>
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

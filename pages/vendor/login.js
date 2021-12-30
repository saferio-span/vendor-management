import React,{useEffect,useState} from 'react'
import style from "../../styles/Login.module.css"
import Router from 'next/router'
import Link from "next/link";
import { toast,ToastContainer } from "react-toastify"
import axios from "axios"
import 'react-toastify/dist/ReactToastify.css';
import { useUserValue } from '../../contexts/UserContext'
import { actionTypes } from "../../contexts/userReducer"
import { credentials,urls } from '../../config/variables';

// const Login = ({providers,session,host}) => {
const Login = () => {
    // console.log({session,host})
    var options = []
    const [values, setValues] = useState({
        email: '',
		// password: '',
	});
    const [{user_details,environment},dispatch] = useUserValue();
    
    useEffect(()=>{

        // const sess_email = localStorage.getItem('email')
        // console.log(environment)
        if(Object.keys(environment).length === 0)
        {
            Router.push('/')
            return false
        }
        if(user_details)
        {
            // Router.push(`/vendor/home/${user_details.payeeRef}`)
            Router.push({
                pathname: `/vendor/home/${user_details.payeeRef}`,
                query: { envName: environment ? environment.name : localStorage.getItem("env") },
            })
        }
        
        

        //eslint-disable-next-line
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

            const res = await axios.post(`/api/affiliate/login`,{
                email: values.email,
                // password: values.password,
                env: environment,
                apiUrl:environment.apiUrl,
                authUrl:environment.authUrl
            })
            const user = await res.data
            if(user.length)
            {
                localStorage.setItem('email',user[0].email)
                localStorage.setItem('name',user[0].name)
                localStorage.setItem('id',user[0]._id)
                dispatch({
                    type: actionTypes.SET_USER_DETAILS,
                    data: user[0],
                })
                // Router.push({
                //     pathname: '/vendor/home',
                //     query: { user_details: user_details },
                // })
                // Router.push(`/vendor/home/${user[0].payeeRef}`)
                Router.push({
                    pathname: `/vendor/home/${user[0].payeeRef}`,
                    query: { envName: environment.name },
                })
            }
          } catch (error) {
            // toast.error("Invalid Email Id or Password")
            toast.error("Invalid Email Id")
            // console.log(error)
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


    if(credentials)
    {   
        for(const key in credentials )
        {
            options.push({ value: credentials[key].name, label: credentials[key].name })
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
                                     Payee Login
                            </h3>
                        </div>
                        <div className="col-2">
                            <Link href='/'>
                                <a className="btn btn-warning">Back</a>
                            </Link>
                        </div>
                    </div>

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
                        {/* <div className="form-group my-2">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control my-2" id="password" name="password" placeholder="Password" onChange={handleInputChange} />
                        </div> */}
                        <input type="submit" className="btn btn-success w-100 my-2 py-3" value="Sign In" />
                    </form>
                    <hr />
                    <span>Don{`'`}t have an account ? -<Link href={
                                        { 
                                            pathname: `/vendor/signUp`, 
                                            query: { 
                                                envName: environment ? environment.name : localStorage.getItem("env")
                                            }
                                        }
                                    }>
                        <a className="btn btn-link">Sign Up !</a>
                    </Link></span>
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

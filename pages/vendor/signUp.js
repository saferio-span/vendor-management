import React,{useState} from 'react'
import Select from 'react-select'
import {states,statesShort} from "../../config/variables"
import Link from "next/link";
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import Router,{useRouter} from 'next/router'
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'
import { useUserValue } from '../../contexts/UserContext'

export const getServerSideProps = async (context)=>{
    const { req,query } = context;
    const { origin } = absoluteUrl(req)
  
    const res = await axios.post(`${origin}/api/merchant/getAll`,{
        envName:query.envName
    })
    const merchantsData = await res.data

    const merchants = []

    merchantsData.forEach(element => {
        merchants.push({ value: element._id, label: element.name })
    });

    return{
      props:{ 
        merchants
       }
    }
  }

const SignUp = (props) => {

    var options = []
    const variation = localStorage.getItem("variant")
    const [{user_details,environment},dispatch] = useUserValue();
    // console.log(environment)
    const [random,setRandom]=useState(Math.floor((Math.random() * 1000000000) + 1))
    const [loading,setLoading]=useState(false)
    const [values, setValues] = useState({
		merchantId:'',
        name:'',
        address1:'',
        address2:'',
        city:'',
        state:'',
        zip:'',
        email: '',
        payeeRef:`Pe${random}`
		// password: '',
        // confirmPassword:''
	});

    const [validateValues, setValidateValues] = useState({
		merchantId:'',
        name:'',
        address1:'',
        city:'',
        state:'',
        zip:'',
        email: '',
        payeeRef:`Pe${random}`
		// password: '',
        // confirmPassword:''
	});

    const router = useRouter()
    const envName = router.query.envName

    const handleBusinessChange = (e)=>{
        if(e !== null)
        {
            setValues({ ...values, merchantId: e.value });
            setValidateValues({ ...validateValues, merchantId: e.value });
        }
        else
        {
            setValues({ ...values, merchantId: "" });
            setValidateValues({ ...validateValues, merchantId: "" });
        }
    }

    const handleSelectChange = (e)=>{
        if(e !== null)
        {
            setValues({ ...values, state: e.value });
            setValidateValues({ ...validateValues, state: e.value });
        }
        else
        {
            setValues({ ...values, state: "" });
            setValidateValues({ ...validateValues, state: "" });
        } 
    }

    const handleInputChange = (e) => {
		const { name, value } = e.target;

        if(name == "zip")
        {
            if(value.length <= 9)
            {
                setValues({ ...values, [name]: value });
            }
        }
        else
        {
            setValues({ ...values, [name]: value });
        }

        if(name !== "address2")
        {
            setValidateValues({ ...validateValues, [name]: value });
        }
	};

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setLoading(true)
        const hasEmptyField = Object.values(validateValues).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields which are mandatory(*)")
            setLoading(false)
            return false
        }
        else
        {
            if(values.zip.length < 9)
            {
                if(values.zip.length != 5)
                {
                    toast.error("Enter valid zipcode (5 or 9 digit)")
                    setLoading(false)
                    return false
                }
            }
        }

        const availablity = await axios.post(`/api/affiliate/findByEmail/${values.email}`,{
            envName: environment ? environment.name : localStorage.getItem("env")
        })

        if(availablity.data.length > 0)
        {
            toast.error("Email has been used already. Please try again using another email")
            setLoading(false)
            return false
        }
        else
        {

            // if(values.password === values.confirmPassword)
            // {
                // console.log(
                //     {
                //         merchantID: values.merchantId,
                //         name: values.name,
                //         address1: values.address1,
                //         address2: values.address2,
                //         city: values.city,
                //         state: values.state,
                //         zip: values.zip,
                //         email: values.email,
                //         password: values.password,
                //         envName: environment ? environment.name : localStorage.getItem("env")
                //     }
                // )
                // const res = await axios.post(`/api/affiliate/signUp`,{
                //     merchantID: values.merchantId,
                //     name: values.name,
                //     address1: values.address1,
                //     address2: values.address2,
                //     city: values.city,
                //     state: values.state,
                //     zip: values.zip,
                //     email: values.email,
                //     password: values.password,
                //     envName: environment.envName
                // })

                const res = await axios.post(`/api/affiliate/signUp`,{
                    merchantID: values.merchantId,
                    name: values.name,
                    address1: values.address1,
                    address2: values.address2,
                    city: values.city,
                    state: values.state,
                    zip: values.zip,
                    email: values.email,
                    password: values.password,
                    envName: envName,
                    payeeRef: values.payeeRef
                })
        
                const user = await res.data
                if(user)
                {
                    setRandom(Math.floor((Math.random() * 1000000000) + 1))
                    setValues({
                        merchantID: '',
                        name:'',
                        address1:'',
                        address2:'',
                        city:'',
                        state:'',
                        zip:'',
                        email: '',
                        payeeRef:`Pe${random}`
                        // password: '',
                        // confirmPassword:''
                    })
                    setValidateValues({
                        merchantId:'',
                        name:'',
                        address1:'',
                        city:'',
                        state:'',
                        zip:'',
                        email: '',
                        payeeRef:`Pe${random}`
                    })
                    toast("Account created successfully")
                    setLoading(false)
                    // Router.push('/vendor/login')
                    return true
                }
                else
                {
                    toast("Account cannot be created")
                    return false
                }
            // }
            // else
            // {
            //     toast.error("Password does not match !")
            //     return false
            // }
        }
    }
    if(states)
    {   
        for(const key in states )
        {
            // const short = statesShort.key
            options.push({ value: statesShort[key], label: states[key] })
        }
    }

    return (
        <>
            <h1 className="d-flex justify-content-center align-items-center my-5 ">Sign Up</h1>
            <div className="container bg-light">
                <br />
                <ToastContainer />
                <h3 className="my-2">Account details</h3>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group my-2">
                                <label htmlFor="business">Business<span className="text-danger font-weight-bold">*</span> </label>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue="0"
                                    isSearchable="true"
                                    isClearable="true"
                                    id="business"
                                    instanceId="business"
                                    name="business"
                                    options={props.merchants}
                                    onChange={handleBusinessChange}
                                />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group my-2">
                                <label htmlFor="email">Payee Ref<span className="text-danger font-weight-bold">*</span></label>
                                <input type="text" className="form-control" id="payeeRef" placeholder="Payee Ref" value={values.payeeRef} name="payeeRef" onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="name">Name<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="name" placeholder="Name" name="name" value={values.name} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="address1">Address 1<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="address1" name="address1" placeholder="Address 1" value={values.address1} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="city">City <span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="city" name="city" value={values.city} placeholder="City" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="zip">ZIP <span className="text-danger font-weight-bold">*</span></label>
                                        <input type="number" className="form-control" id="zip" name="zip" placeholder="ZIP" value={values.zip} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="email">Email<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="email" className="form-control" id="email" placeholder="Email" name="email" value={values.email}  onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="address2">Address 2</label>
                                        <input type="text" className="form-control" id="address2" name="address2" placeholder="Address 2" value={values.address2} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="state">State<span className="text-danger font-weight-bold">*</span> </label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            defaultValue="0"
                                            isSearchable="true"
                                            isClearable="true"
                                            id="state"
                                            instanceId="state"
                                            name="state"
                                            options={options}
                                            onChange={handleSelectChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="password">Password<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="password" className="form-control" id="password" placeholder="Password" name="password" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="confirmPassword">Confirm Password<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" name="confirmPassword" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <br />
                    <div className="row">
                        <div className="offset-10 col-2">
                            <button type="submit" className="btn btn-danger float-right" value="Submit" disabled={loading}>Submit {loading && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button>
                            {/* <input type="submit" name="submit" className="btn btn-danger float-right" /> */}
                        </div>
                    </div>
                </form>
                <br /><hr />
                <div className="mb-5">
                    Already have an account ? -<Link href={{ pathname: '/vendor/login', query: { envName: envName}}}>
                        <a className="btn btn-link">Sign In !</a>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default SignUp

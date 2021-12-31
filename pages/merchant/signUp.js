import React,{useState} from 'react'
import Select from 'react-select'
import {states,statesShort} from "../../config/variables"
import Link from "next/link";
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import {useRouter} from 'next/router'
import 'react-toastify/dist/ReactToastify.css';
import { useUserValue } from '../../contexts/UserContext'

const SignUp = () => {
    var options = []
    // const random = Math.floor((Math.random() * 1000000000) + 1);
    const [random,setRandom]=useState(Math.floor((Math.random() * 1000000000) + 1))
    const [loading,setLoading]=useState(false)
    const [{user_details,environment},dispatch] = useUserValue();
    const router = useRouter()
    const envName = router.query.envName
    const [values, setValues] = useState({
		businessName:'',
        ein:'',
        address1:'',
        address2:'',
        city:'',
        state:'',
        zip:'',
        contactName:'',
        email: '',
        payerRef:`Pr${random}`
		// password: '',
        // confirmPassword:''
	});

    const [validateValues, setValidateValues] = useState({
		businessName:'',
        ein:'',
        address1:'',
        city:'',
        state:'',
        zip:'',
        contactName:'',
        email: '',
        payerRef:`Pr${random}`
	});
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
		setValues({ ...values, [name]: value });
        if(name !== "address2")
        {
            setValidateValues({ ...validateValues, [name]: value });
        }
	};

    const handleSubmit = async (e)=>{
        setLoading(true)
        e.preventDefault()
        
        const hasEmptyField = Object.values(validateValues).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields which are mandatory(*)")
            setLoading(false)
            return false
        }

        const availablity = await axios.post(`/api/merchant/findByEmail/${values.email}`,{
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
                const res = await axios.post('/api/merchant/signUp',{
                    businessName:values.businessName,
                    ein:values.ein,
                    address1:values.address1,
                    address2:values.address2,
                    city:values.city,
                    state:values.state,
                    zip:values.zip,
                    contactName:values.contactName,
                    email: values.email,
                    // password: values.password,
                    envName: envName,
                    payerRef:values.payerRef
                })
                if(res.status == 200)
                {
                    toast("User registered successfully")
                    setRandom(Math.floor((Math.random() * 1000000000) + 1))
                    setValues({
                        businessName:'',
                        ein:'',
                        address1:'',
                        address2:'',
                        city:'',
                        state:'',
                        zip:'',
                        contactName:'',
                        email: '',
                        payerRef:`Pr${random}`
                    })
                    setValidateValues({
                        businessName:'',
                        ein:'',
                        address1:'',
                        city:'',
                        state:'',
                        zip:'',
                        contactName:'',
                        email: '',
                        payerRef:`Pr${random}`
                    })
                    setLoading(false)
                    // router.push('/merchant/login')
                }

                if(res.status != 200)
                {
                    // console.log(`401 Res`)
                    toast.error(res.data[0].Message)
                    // console.log(res.data)
                    setLoading(false)
                    // console.log(res)
                }
                
                // .then(() => {
                    
                // }).catch((error) => {
                //     toast.error(error)
                //     return false
                // })
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
            <h1 className="d-flex justify-content-center align-items-center my-5 "> Sign Up</h1>
            <div className="container bg-light">
                <br />
                <ToastContainer />
                <h3>Business Details</h3>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="businessName">Business Name<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="businessBame" name="businessName" value={values.businessName} placeholder="Business name" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="ein">EIN<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="ein" placeholder="EIN" name="ein"value={values.ein} maxLength="9" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="address2">Address 2</label>
                                        <input type="text" className="form-control" id="address2" name="address2" value={values.address2} placeholder="Address 2" onChange={handleInputChange} />
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
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="payerRef">PayerRef<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="payerRef" placeholder="PayerRef" name="payerRef" maxLength="50" value={values.payerRef} onChange={handleInputChange} />
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
                                        <label htmlFor="city">City<span className="text-danger font-weight-bold">*</span> </label>
                                        <input type="text" className="form-control" id="city" name="city" value={values.city} placeholder="City" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="zip">ZIP<span className="text-danger font-weight-bold">*</span> </label>
                                        <input type="text" className="form-control" id="zip" name="zip" value={values.zip} placeholder="ZIP" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h3 className="my-2">Account details</h3>
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="contactName">Contact Name<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="contactName" placeholder="Conatct Name" name="contactName" value={values.contactName} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            {/* <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="password">Password<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="password" className="form-control" id="password" placeholder="Password" name="password" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="contactEmail">Contact Email<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="email" className="form-control" id="email" placeholder="Conatct Email" name="email" value={values.email} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            {/* <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="confirmPassword">Confirm Password<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" name="confirmPassword" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="offset-10 col-2 text-right">
                            <button type="submit" className="btn btn-danger float-right" value="Submit" disabled={loading}>Submit {loading && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button>
                            {/* <input type="submit" name="submit" className="btn btn-danger float-right" /> */}
                        </div>
                    </div>
                </form>
                <br /><hr />
                <div className="mb-5">
                    Already have an account ? -<Link href={{ pathname: '/merchant/login', query: { envName: envName}}}>
                        <a className="btn btn-link">Sign In !</a>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default SignUp

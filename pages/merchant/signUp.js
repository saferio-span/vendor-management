import React,{useState} from 'react'
import Select from 'react-select'
import {states,statesShort} from "../../config/variables"
import Link from "next/link";
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import { useRouter } from 'next/router'
import 'react-toastify/dist/ReactToastify.css';
import { useUserValue } from '../../contexts/UserContext'

const SignUp = () => {

    const router = useRouter()
    var options = []

    // const [{user_details,environment},dispatch] = useUserValue();
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
		password: '',
        confirmPassword:''
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
		password: '',
        confirmPassword:''
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
        e.preventDefault()
        
        const hasEmptyField = Object.values(validateValues).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields which are mandatory(*)")
            return false
        }

        const availablity = await axios.get(`/api/merchant/findByEmail/${values.email}`)

        if(availablity.data.length > 0)
        {
            toast.error("Email has been used already. Please try again using another email")
            return false
        }
        else
        {
            if(values.password === values.confirmPassword)
            {
                await axios.post('/api/merchant/signUp',{
                    businessName:values.businessName,
                    ein:values.ein,
                    address1:values.address1,
                    address2:values.address2,
                    city:values.city,
                    state:values.state,
                    zip:values.zip,
                    contactName:values.contactName,
                    email: values.email,
                    password: values.password,
                }).then(() => {
                    toast("User registered successfully")
                    router.push('/merchant/login')
                }).catch((error) => {
                    toast.error(error)
                    return false
                })
            }
            else
            {
                toast.error("Password does not match !")
                return false
            }
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
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="businessName">Business Name<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="businessBame" name="businessName" placeholder="Business name" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="address1">Address 1<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="address1" name="address1" placeholder="Address 1" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="city">City<span className="text-danger font-weight-bold">*</span> </label>
                                        <input type="text" className="form-control" id="city" name="city" placeholder="City" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="zip">ZIP<span className="text-danger font-weight-bold">*</span> </label>
                                        <input type="text" className="form-control" id="zip" name="zip" placeholder="ZIP" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="ein">EIN<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="ein" placeholder="EIN" name="ein" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="address2">Address 2</label>
                                        <input type="text" className="form-control" id="address2" name="address2" placeholder="Address 2" onChange={handleInputChange} />
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
                    <h3 className="my-2">Account details</h3>
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="contactName">Contact Name<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="contactName" placeholder="Conatct Name" name="contactName" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
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
                                        <label htmlFor="contactEmail">Contact Email<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="email" className="form-control" id="email" placeholder="Conatct Email" name="email" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="confirmPassword">Confirm Password<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" name="confirmPassword" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="offset-11 col-1">
                            <input type="submit" name="submit" className="btn btn-danger float-right" />
                        </div>
                    </div>
                </form>
                <br /><hr />
                <div className="mb-5">
                    Already have an account ? -<Link href='/merchant/login'>
                        <a className="btn btn-link">Sign In !</a>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default SignUp

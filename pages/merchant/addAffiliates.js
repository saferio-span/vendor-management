import React,{useState,useEffect} from 'react'
import Select from 'react-select'
import {states,statesShort} from "../../config/variables"
import Router,{useRouter} from 'next/router'
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { useUserValue } from '../../contexts/UserContext'
import MerchantNavBar from "../../components/Layout/MerchantNavBar"
import Link from "next/link";

const AddAffiliates = (props) => {

    var options = []
    const [{ user_details,environment }, dispatch] = useUserValue();
    const [loading,setLoading]=useState(false)
    const router = useRouter()
    const envName = router.query.envName
    const [random,setRandom]=useState(Math.floor((Math.random() * 1000000000) + 1))
    const [merchantID,setMerchantID] = useState();
    const [values, setValues] = useState({
		name:'',
        address1:'',
        address2:'',
        city:'',
        state:'',
        zip:'',
        email: '',
        payeeRef:`Pe${random}`
        // password: ''
	});

    const [validateValues, setValidateValues] = useState({
        name:'',
        // address1:'',
        // city:'',
        // state:'',
        // zip:'',
        email: '',
        payeeRef:`Pe${random}`
		// password: '',
	});

    useEffect(()=>{
        if(user_details)
        {
            console.log(user_details)
            setMerchantID(user_details)
        }
        //eslint-disable-next-line
    },[])

    const handleSubmit =async (e)=>{
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

            const res = await axios.post(`/api/affiliate/signUp`,{
                merchantID: merchantID,
                name: values.name,
                address1: values.address1,
                address2: values.address2,
                city: values.city,
                state: values.state,
                zip: values.zip,
                email: values.email,
                // password: values.password,
                envName: envName,
                payeeRef: values.payeeRef
            })

            const user = await res.data
            if(user)
            {
                setRandom(Math.floor((Math.random() * 1000000000) + 1))
                setValues({
                    name:'',
                    address1:'',
                    address2:'',
                    city:'',
                    state:'',
                    zip:'',
                    email: '',
                    payeeRef:`Pe${random}`
                    // password: ''
                })
                toast("Affiliate created successfully")
                setLoading(false)
                Router.push({
                    pathname: '/merchant/home',
                    query: {
                        payerRef: user_details.payerRef,
                        envName:envName
                    }
                })
                return true
            }
            else
            {
                setLoading(false)
                toast("Affiliate cannot be created")
                return false
            }
            
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

    // const handlePasswordChange = (e) => {
	// 	const { name, value } = e.target;
	// 	setPasswordValues({ ...passwordValues, [name]: value });
	// };

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
            <MerchantNavBar />
            <h1 className="d-flex justify-content-center align-items-center my-4 ">Add Payees</h1>
            <div className="container bg-light">
                <br />
                <ToastContainer />
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="businessName">Name<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="text" className="form-control" id="name" name="name" placeholder="Name" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="address1">Address 1</label>
                                        <input type="text" className="form-control" id="address1" name="address1" placeholder="Address 1" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="state">State</label>
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
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="contactEmail">Email<span className="text-danger font-weight-bold">*</span></label>
                                        <input type="email" className="form-control" id="email" placeholder="Email" name="email" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div className="col-6">
                            
                            <div className="row">
                                <div className="col">
                                <div className="form-group my-2">
                                    <label htmlFor="email">Payee Ref<span className="text-danger font-weight-bold">*</span></label>
                                    <input type="text" className="form-control" id="payeeRef" placeholder="Payee Ref" value={values.payeeRef} name="payeeRef" onChange={handleInputChange} />
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
                                        <label htmlFor="city">City</label>
                                        <input type="text" className="form-control" id="city" name="city" placeholder="City" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="zip">ZIP</label>
                                        <input type="number" className="form-control" id="zip" name="zip" placeholder="ZIP" onChange={handleInputChange} />
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
                    </div>
                    <br />
                    {/* <div className="row"> */}
                        <div className="d-flex justify-content-between">
                            <Link href={{ pathname: '/merchant/home', query: { 
                                payerRef: user_details?.payerRef,
                                envName:envName
                            }}}>
                                <a className="btn btn-danger">Back</a>
                            </Link>
                            <button type="submit" className="btn btn-success" value="Submit" disabled={loading}>Submit {loading && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button>
                            {/* <input type="submit" name="submit" className="btn btn-danger float-right" /> */}
                        </div>
                    {/* </div> */}
                </form>
            </div>
        </>
    )
}

export default AddAffiliates

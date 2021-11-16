import React,{useState} from 'react'
import Select from 'react-select'
import {states,statesShort} from "../../config/variables"
import Link from "next/link";
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import Router from 'next/router'
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'

export const getServerSideProps = async (context)=>{
    const { req } = context;
    const { origin } = absoluteUrl(req)
  
    const res = await axios.get(`${origin}/api/merchant/getAll`)
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

    const [values, setValues] = useState({
		merchantId:'',
        name:'',
        address1:'',
        address2:'',
        city:'',
        state:'',
        zip:'',
        email: '',
		password: '',
        confirmPassword:''
	});

    const handleBusinessChange = (e)=>{
        if(e !== null)
        {
            setValues({ ...values, merchantId: e.value });
        }
        else
        {
            setValues({ ...values, merchantId: "" });
        }
    }

    const handleSelectChange = (e)=>{
        if(e !== null)
        {
            setValues({ ...values, state: e.value });
        }
        else
        {
            setValues({ ...values, state: "" });
        }
    }

    const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	};

    const handleSubmit = async (e)=>{
        e.preventDefault()
        
        const hasEmptyField = Object.values(values).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields")
            return false
        }

        if(values.password === values.confirmPassword)
        {
            const res = await axios.post(`/api/affiliate/signUp`,{
                merchantID: values.merchantId,
                name: values.name,
                address1: values.address1,
                address2: values.address2,
                city: values.city,
                state: values.state,
                zip: values.zip,
                email: values.email,
                password: values.password
            })
    
            const user = await res.data
            if(user)
            {
                setValues({
                    merchantID: '',
                    name:'',
                    address1:'',
                    address2:'',
                    city:'',
                    state:'',
                    zip:'',
                    email: '',
                    password: '',
                    confirmPassword:''
                })
                toast("Account created successfully")
                Router.push('/vendor/login')
                return true
            }
            else
            {
                toast("Account cannot be created")
                return false
            }
        }
        else
        {
            toast.error("Password does not match !")
            return false
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
                <h3 className="my-2">Account details</h3>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group my-2">
                                <label htmlFor="business">Business </label>
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
                        <div className="col-6"></div>
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" className="form-control" id="name" placeholder="Name" name="name" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="address1">Address 1</label>
                                        <textarea className="form-control" id="address1" name="address1" rows="3" onChange={handleInputChange}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="city">City </label>
                                        <input type="text" className="form-control" id="city" name="city" placeholder="City" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="zip">ZIP </label>
                                        <input type="text" className="form-control" id="zip" name="zip" placeholder="ZIP" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" className="form-control" id="email" placeholder="Email" name="email" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="address2">Address 2</label>
                                        <textarea className="form-control" id="address2" name="address2" rows="3" onChange={handleInputChange} ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="state">State </label>
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
                    
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" className="form-control" id="password" placeholder="Password" name="password" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
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
                    Already have an account ? -<Link href='/vendor/login'>
                        <a className="btn btn-link">Sign In !</a>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default SignUp

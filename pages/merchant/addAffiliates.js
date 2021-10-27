import React,{useState,useEffect} from 'react'
import Select from 'react-select'
import {states,statesShort} from "../../config/variables"
import Link from "next/link";
import Router from 'next/router'
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { useUserValue } from '../../contexts/UserContext'
import MerchantNavBar from "../../components/Layout/MerchantNavBar"


const AddAffiliates = () => {

    var options = []
    const [{ user_details }, dispatch] = useUserValue();
    const [merchantID,setMerchantID] = useState();
    const [values, setValues] = useState({
		name:'',
        address1:'',
        address2:'',
        city:'',
        state:'',
        zip:'',
        email: '',
        password: ''
	});

    useEffect(()=>{
        if(user_details)
        {
            setMerchantID(user_details)
        }
    },[])

    const handleSubmit =async (e)=>{
        e.preventDefault()

        const hasEmptyField = Object.values(values).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields")
            return false
        }

        const res = await axios.post(`/api/affiliate/signUp`,{
            merchantID: merchantID,
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
        console.log(`Success`)
        console.log(user)
        if(user)
        {
            setValues({
                name:'',
                address1:'',
                address2:'',
                city:'',
                state:'',
                zip:'',
                email: '',
                password: ''
            })
            toast("Affiliate created successfully")
            Router.push('/merchant/home')
            return true
        }
        else
        {
            toast("Affiliate cannot be created")
            return false
        }
    }

    const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	};

    // const handlePasswordChange = (e) => {
	// 	const { name, value } = e.target;
	// 	setPasswordValues({ ...passwordValues, [name]: value });
	// };

    const handleSelectChange = (e)=>{
        if(e !== null)
        {
            console.log(e.value)
            setValues({ ...values, state: e.value });
        }
        else
        {
            setValues({ ...values, state: "" });
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
            <h1 className="d-flex justify-content-center align-items-center my-4 ">Add Affiliates</h1>
            <div className="container bg-light">
                <br />
                <ToastContainer />
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="businessName">Name</label>
                                        <input type="text" className="form-control" id="name" name="name" placeholder="Name" onChange={handleInputChange} />
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
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="contactEmail">Email</label>
                                        <input type="email" className="form-control" id="email" placeholder="Email" name="email" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div className="col-6">
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
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" className="form-control" id="password" placeholder="Password" name="password" onChange={handleInputChange} />
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
            </div>
        </>
    )
}

export default AddAffiliates

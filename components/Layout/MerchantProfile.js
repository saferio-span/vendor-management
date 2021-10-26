import React,{useEffect,useState} from 'react'
import Select from 'react-select'
import {states,statesShort} from "../../config/variables"
import axios from 'axios'
import { useUserValue } from '../../contexts/UserContext'
import { toast,ToastContainer } from "react-toastify"
import { actionTypes } from "../../contexts/userReducer"
// import bcrypt from 'bcrypt';

const MerchantProfile = () => {
    var options = []
    const [{ session_user,user_details }, dispatch] = useUserValue();
    const [values, setValues] = useState({
		businessName:'',
        ein:'',
        address1:'',
        address2:'',
        city:'',
        state:'',
        zip:'',
        contactName:'',
        email: ''
	});

    const [passwordValues, setPasswordValues] = useState({
        oldPassword: '',
		newPassword: '',
        confirmPassword:''
	});
    
    useEffect(async()=>{
        // console.log(`Modal Session Data`)
        console.log(`User Details`)
        console.log(user_details)
        // console.log(bcrypt.compareSync("India@123", user_details.password))
        console.log(`Pass Check`)
        await axios.post('/api/merchant',{
            password:"India@123",
            hashPassword:user_details.password
        }).then((response)=>{
            console.log(response.data)
        }).catch((err,response)=>{
            console.log(`Error`)
            console.log(err)
            console.log(response)
        })
        const res = await axios.get('/api/merchant')
        const userData = await res.data
        console.log(`Profile object`)
        console.log(userData)
        if(userData.length)
        {
            const data = userData[0]
            setValues({ 
                ...values, 
                businessName: data.businessName,
                ein: data.ein,
                address1: data.address1,
                address2: data.address2,
                city: data.city,
                state: data.state,
                zip: data.zip,
                contactName: data.name,
                email: data.email
            });
        }
        else
        {
            setValues({ 
                ...values,
                contactName: session_user.user.name,
                email:session_user.user.email
            });
        }
        console.log(`State values`)
        console.log(values)
    },[session_user])

    const handleSubmit = (e)=>{
        e.preventDefault()

        const hasEmptyField = Object.values(values).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields")
            return false
        }

        // if(passwordValues.oldPassword !== "")
        // {
        //     bcrypt.compareSync(passwordValues.oldPassword, user_details.password).then(function(result) {
        //         if(result)
        //         {
        //             user.password=null
        //             res.send(user) 
        //         }
        //         else
        //         {
        //             toast.error("Password does not match with existing one")
        //             return false
        //         }
        //     })
        // }

    }

    const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	};

    const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswordValues({ ...passwordValues, [name]: value });
	};

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
            <ToastContainer />
            <div className="modal fade" id="merchantProfileModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Profile</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-6">
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group my-2">
                                                <label htmlFor="businessName">Business Name</label>
                                                <input type="text" className="form-control" id="businessBame" name="businessName" value={values.businessName} placeholder="Business name" onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group my-2">
                                                <label htmlFor="address1">Address 1</label>
                                                <textarea className="form-control" id="address1" name="address1" value={values.address1} rows="3" onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group my-2">
                                                <label htmlFor="city">City </label>
                                                <input type="text" className="form-control" id="city" name="city" placeholder="City" value={values.city} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group my-2">
                                                <label htmlFor="zip">ZIP </label>
                                                <input type="text" className="form-control" id="zip" name="zip" placeholder="ZIP" value={values.zip} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group my-2">
                                                <label htmlFor="ein">EIN</label>
                                                <input type="text" className="form-control" id="ein" placeholder="EIN" name="ein" value={values.ein} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group my-2">
                                                <label htmlFor="address2">Address 2</label>
                                                <textarea className="form-control" id="address2" name="address2" rows="3" value={values.address1} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group my-2">
                                                <label htmlFor="state">State </label>
                                                <Select
                                                    value = {
                                                        options.filter(option => 
                                                        option.value === values.state)
                                                    }
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
                                    <div className="form-group my-2">
                                        <label htmlFor="contactName">Contact Name</label>
                                        <input type="text" className="form-control" id="contactName" placeholder="Conatct Name" value={values.contactName} name="contactName" onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group my-2">
                                        <label htmlFor="contactEmail">Contact Email</label>
                                        <input type="email" className="form-control" id="email" placeholder="Conatct Email" name="email" value={values.email} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <h3 className="my-2">Update Password</h3>
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group my-2">
                                        <label htmlFor="password">Old Password</label>
                                        <input type="password" className="form-control" id="oldPassword" placeholder="Old Password" name="oldPassword" onChange={handlePasswordChange} />
                                    </div>
                                </div>
                                <div className="col-6"></div>
                                <div className="col-6">
                                    <div className="form-group my-2">
                                        <label htmlFor="password">New Password</label>
                                        <input type="password" className="form-control" id="newPassword" placeholder="New Password" name="newPassword" onChange={handlePasswordChange} />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group my-2">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" name="confirmPassword" onChange={handlePasswordChange} />
                                    </div>
                                </div>
                            </div>
                            {/* <br />
                            <div className="row">
                                <div className="offset-11 col-1">
                                    <input type="submit" name="submit" className="btn btn-danger float-right" />
                                </div>
                            </div> */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            {/* <button type="button" className="btn btn-primary">Submit</button> */}
                            <input type="submit" name="submit" className="btn btn-primary" />
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MerchantProfile

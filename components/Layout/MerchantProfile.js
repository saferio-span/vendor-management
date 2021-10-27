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
    const [{ user_details }, dispatch] = useUserValue();
    const [businessId,setBusinessID] = useState()
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

    // const [passwordValues, setPasswordValues] = useState({
    //     oldPassword: '',
	// 	newPassword: '',
    //     confirmPassword:''
	// });
     

    useEffect(()=>{
        if(user_details)
        {
            const data = user_details
            console.log(data.password)
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

            setBusinessID(data.businessID)
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

        const res = await axios.post(`/api/merchant/updateMerchant`,{
            id: user_details._id,
            update: {
                businessName: values.businessName,
                ein: values.ein,
                address1: values.address1,
                address2: values.address2,
                city: values.city,
                state: values.state,
                zip: values.zip,
                contactName: values.name,
                email: values.email
            }
        })

        const user = await res.data
        console.log(`Success`)
        console.log(user)
        if(user)
        {
            toast("User updated successfully")
            return true
        }
        else
        {
            toast("User cannot updated")
            return false
        }
        


        // if(passwordValues.oldPassword !== "" || passwordValues.newPassword !== "" || passwordValues.confirmPassword !== "")
        // {
        //     if(passwordValues.oldPassword !== "" && passwordValues.newPassword !== "" && passwordValues.confirmPassword !== "")
        //     {
        //         await axios.post('/api/comparePass',{
        //             password:"India@123",
        //             hashPassword:passwordValues.oldPassword
        //         }).then((response)=>{
        //             if(passwordValues.newPassword === passwordValues.confirmPassword)
        //             {

        //             }
        //             else
        //             {

        //             }
        //         }).catch((err,response)=>{
        //             console.log(`Error`)
        //             console.log(err)
        //             console.log(response)
        //         }) 
        //     }
        //     else
        //     {
        //         toast.error("Please provide Old password and new password to update the password")
        //     }
        // }

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
                            <p >Business Id : <b className="text-primary">{businessId}</b></p>
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
                            {/* <h3 className="my-2">Update Password</h3> 
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
                            </div> */}
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

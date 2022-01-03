import React,{useEffect,useState} from 'react'
import Select from 'react-select'
import {states,statesShort} from "../../config/variables"
import axios from 'axios'
import { useUserValue } from '../../contexts/UserContext'
import { toast,ToastContainer } from "react-toastify"
import VendorNavbar from '../../components/Layout/VendorNavBar'
import Link from "next/link";

const MerchantProfile = () => {
    var options = []
    const [{ user_details,environment}, dispatch] = useUserValue();
    const [loading,setLoading]=useState(false)
    const [whLoading,setWhLoading]=useState(false)
    const [values, setValues] = useState({
        id:"",
        name: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
	});     
    const [payeeRef,setPayeeRef] = useState('')
    const [envName,setEnvName] = useState('')

    useEffect(()=>{
        if(user_details)
        {
            const data = user_details
            setValues({ 
                ...values,
                id:data._id,
                name: data.name,
                email: data.email,
                address1: data.address1,
                address2: data.address2,
                city: data.city,
                state: data.state,
                zip: data.zip,
            });
            setPayeeRef(data.payeeRef)
        }
        setEnvName(localStorage.getItem("env"))
        //eslint-disable-next-line
    },[user_details])

    const handleSubmit =async (e)=>{
        e.preventDefault()
        setLoading(true)
        const hasEmptyField = Object.values(values).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields")
            setLoading(false)
            return false
        }

        const res = await axios.post(`/api/affiliate/updateVendor`,{
            id: user_details._id,
            update: {
                name: values.name,
                email: values.email,
                address1: values.address1,
                address2: values.address2,
                city: values.city,
                state: values.state,
                zip: values.zip,
            }
        })

        const user = await res.data
        if(user)
        {
            setLoading(false)
            toast("User updated successfully")
            return true
        }
        else
        {
            setLoading(false)
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
            <VendorNavbar />
            <ToastContainer />
            <h1 className="d-flex justify-content-center align-items-center my-2 "> Profile</h1>
            <div className="container bg-light my-3">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <p className="my-2" >Payee Ref : <b className="text-primary">{payeeRef}</b></p>
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" className="form-control" id="name" name="name" value={values.name} placeholder="Name" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="address1">Address 1</label>
                                        <input type="text" className="form-control" id="address1" name="address1" value={values.address1} placeholder="Address 1" onChange={handleInputChange} />
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
                                        <label htmlFor="email">Email</label>
                                        <input type="email" className="form-control" id="email" placeholder="Email" name="email" value={values.email} onChange={handleInputChange} />
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

                    <br />
                    <div className="row ">
                        <div className="offset-10 col-2">
                            <button type="submit" className="btn btn-danger float-right" value="Submit" disabled={loading}>Submit {loading && <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span>}</button>
                            {/* <input type="submit" name="submit" className="btn btn-danger float-right mb-2" /> */}
                        </div>
                    </div>
                </form>
            </div>    
            <hr />
            <br />
            <div className="position-relative my-2">
                {/* <Link href={{
                    pathname: '/vendor/w9/[id]',
                    query: { id: user_details._id },
                    }}
                > */}
                {/* <Link href={`/vendor/completeWh?id=${values.id}`}> */}
                {
                    !whLoading && <Link href={
                        { 
                            pathname: `/vendor/completeWh`, 
                            query: {
                                id: values.id,
                                envName: envName
                            }
                        }
                    }>
                        <a className="btn btn-warning position-absolute top-50 start-50 translate-middle" onClick={()=>setWhLoading(true)}>Complete Wh</a>
                    </Link>
                }
                {
                    whLoading && <button className='btn btn-warning position-absolute top-50 start-50 translate-middle' disabled>Complete Wh <span className='spinner-border spinner-border-sm' role="status" aria-hidden="true"></span></button>
                }
            </div>
        </>
    )
}

export default MerchantProfile

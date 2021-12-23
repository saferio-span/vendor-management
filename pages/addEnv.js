import React,{useState} from 'react'
import Select from 'react-select'
import axios from 'axios'
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link"

const AddEnv = () => {
    const [values, setValues] = useState({
        name:'',
		envType:'',
        clientId:'',
        clientSecret:'',
        userToken:'',
        authUrl:'',
        apiUrl:''
	});

    var options = [
        { value: "sandbox", label: "Sandbox" },
        { value: "staging", label: "Staging" },
        { value: "uat", label: "UAT" }
    ]

    const handleSubmit =async (e)=>{
        e.preventDefault()
        console.log(values)
        const hasEmptyField = Object.values(values).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields")
            return false
        }

        const res = await axios.post(`/api/addEnv`,{
           name:values.name,
           clientId:values.clientId,
           clientSecret:values.clientSecret,
           userToken:values.userToken,
           environment:values.envType,
           authUrl:values.authUrl,
           apiUrl:values.apiUrl
        })

        const envrn = await res.data
        if(envrn)
        {
            setValues({
                name:'',
                envType:'',
                clientId:'',
                clientSecret:'',
                userToken:'',
                authUrl:'',
                apiUrl:''
            });
            toast("Environment added successfully")
            return true
        }
        else
        {
            toast("Environment cannot be added")
            return false
        }
        
    }

    const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	};

    const handleSelectChange = (e)=>{
        if(e !== null)
        {
            setValues({ ...values, envType: e.value });
        }
        else
        {
            setValues({ ...values, envType: "" });
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-9 offset-1">
                    <h1 className="my-3 mx-3">Add Environment</h1>
                </div>
                <div className="col-1">
                    <Link href='/'>
                        <a className="btn btn-danger my-4" >Back</a>
                    </Link>
                </div>
            </div>
            {/* <div className="row">
                <div className="col-10">
                    <h1 className="d-flex justify-content-center align-items-center my-2 ">Add Environment</h1>
                </div>
                <div className="col-2">

                </div>
            </div> */}
            
            <div className="container bg-light my-3">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-4 offset-4">
                            <div className="form-group my-2">
                                <label htmlFor="businessName">Environment Type</label>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    defaultValue="0"
                                    isSearchable="true"
                                    isClearable="true"
                                    id="envType"
                                    instanceId="envType"
                                    name="envType"
                                    options={options}
                                    onChange={handleSelectChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" className="form-control" id="name" name="name" placeholder="Name" value={values.name} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="city">Client Secret </label>
                                        <input type="text" className="form-control" id="clientSecret" name="clientSecret" value={values.clientSecret} placeholder="Client Secret" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="authUrl">Auth Url </label>
                                        <input type="text" className="form-control" id="authUrl" name="authUrl" value={values.authUrl} placeholder="Auth Url" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="ein">Client ID</label>
                                        <input type="text" className="form-control" id="clientId" placeholder="Client Id" value={values.clientId} name="clientId" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="userToken">User Token</label>
                                        <input type="text" className="form-control" id="userToken" name="userToken" value={values.userToken} placeholder="User Token" onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group my-2">
                                        <label htmlFor="state">Api Url </label>
                                        <input type="text" className="form-control" id="apiUrl" name="apiUrl" placeholder="Api Url" value={values.apiUrl} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="offset-11 col-1 mb-3">
                            <input type="submit" name="submit" className="btn btn-danger float-right" />
                        </div>
                    </div>
                </form>
            </div>    
        </>
    )
}

export default AddEnv

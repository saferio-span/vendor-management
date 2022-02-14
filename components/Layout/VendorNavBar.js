import React,{useEffect, useState} from 'react'
import Router from 'next/router'
import { useUserValue } from '../../contexts/UserContext'
import { actionTypes } from "../../contexts/userReducer"
import Link from "next/link";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios';

const VendorNavbar = (props) => {
    const [{ user_details,environment }, dispatch] = useUserValue();
    const [payeeRef,setPayeeRef] = useState();
    const [pdfUrl,setPdfUrl] = useState(null);
    const [envName,setEnvName]=useState()

    const fetchdata = async ()=>{
        var id = localStorage.getItem('id')
        const affiliateRes = await axios.get(`/api/affiliate/${id}`)
        const details = affiliateRes.data

        // console.log(details)
        if(details.user[0].pdfUrl !== "-")
        {
            setPdfUrl(details.user[0].pdfUrl)
        }

        dispatch({
            type: actionTypes.SET_USER_DETAILS,
            data: details.user[0],
        })

        setPayeeRef(details.user[0].payeeRef)
    }

    const setEnvironment = async()=>{
        const envName = localStorage.getItem('env')
        setEnvName(envName)
        const googleEmail = localStorage.getItem('googleEmail')
        const envRes = await axios.post(`${origin}/api/getEnvByName`,{
            email: googleEmail,
            envName : envName
        })
        const environCreds = await envRes.data

        // localStorage.clear();
        dispatch({
            type: actionTypes.SET_ENVIRONMENT_DETAILS,
            data: environCreds[0],
        })
    }

    useEffect(() => {
        // if(!user_details)
        // {
        //     Router.push('/vendor/login')
        // }
        fetchdata()
        if(environment === undefined)
        {
            setEnvironment()
        }
        setEnvName(localStorage.getItem('env'))
        //eslint-disable-next-line
    }, [])

    const handleLogOut = ()=>{
        localStorage.clear();
        dispatch({
            type: actionTypes.SET_USER_DETAILS,
            data: null,
        })
        dispatch({
            type: actionTypes.SET_ENVIRONMENT_DETAILS,
            data: null,
        })
        Router.push('/')
        // Router.push({
        //     pathname: '/vendor/login',
        //     query: { 
        //         envName: envName
        //     }
        // })
    }
    return (
        <>
        <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">{user_details && user_details.name}</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                        <li key="Home" className="nav-item">
                            <Link href={{ 
                                pathname: `/vendor/home/${payeeRef}`, 
                                query: { 
                                    envName: envName
                                }
                            }}>
                                <a className="nav-link">Home</a>
                            </Link>
                        </li>
                        {
                            pdfUrl && <>
                                <li key="completedForm" className="nav-item">
                                    {/* <Link href={`/vendor/viewForms/${payeeRef}`}> */}
                                    <Link href={
                                        { 
                                            pathname: `/vendor/viewForms/${payeeRef}`, 
                                            query: { 
                                                envName: envName
                                            }
                                        }
                                    }>
                                        <a className="nav-link">View Completed Form</a>
                                    </Link>
                                </li>
                            </>
                        }
                        
                    </ul>

                    <span className="text-light">Environment : {envName}</span>
                    <Link href={{ 
                        pathname: `/vendor/profile`, 
                        query: { 
                            envName:envName
                        }
                    }} >
                        <a className="btn btn-outline-primary my-2 mx-2 float-end"><i className="bi bi-person-circle"></i> Profile</a>
                    </Link>
                    <button className="btn btn-danger my-2 float-end" onClick={handleLogOut}>Logout <i className="bi bi-box-arrow-right"></i></button>
                </div>
            </div>
        </nav>
        </>
    )
}

export default VendorNavbar

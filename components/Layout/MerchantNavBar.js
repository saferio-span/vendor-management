import React,{useState,useEffect} from 'react'
import Router from 'next/router'
import { useUserValue } from '../../contexts/UserContext'
import { actionTypes } from "../../contexts/userReducer"
import Link from "next/link";
import axios from 'axios';
import { credentials } from '../../config/variables';
import "bootstrap-icons/font/bootstrap-icons.css";

const MerchantNavBar = () => {
    
    const [payerRef,setPayerRef]=useState()
    const [businessId,setBusinessId]=useState()
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
    }

    const fetchdata = async ()=>{
        var id = localStorage.getItem('id')
        const res = await axios.get(`/api/merchant/${id}`)
        const details = res.data

        setPayerRef(details[0].payerRef)
        setBusinessId(details[0].businessID)

        dispatch({
            type: actionTypes.SET_USER_DETAILS,
            data: details[0],
        })
    }

    useEffect(() => {

        fetchdata()
        if(Object.keys(environment).length === 0)
        {
            const envName = localStorage.getItem('env')
            const cred = credentials.filter((user)=>user.name===envName)

            // localStorage.clear();
            dispatch({
                type: actionTypes.SET_ENVIRONMENT_DETAILS,
                data: cred[0],
            })
            // Router.push('/merchant/login')
        }
        //eslint-disable-next-line
    }, [])

    const [{ user_details,environment }, dispatch] = useUserValue();

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
                        <li key="home" className="nav-item">
                            {/* <Link href='/merchant/home'> */}
                            <Link href={{ pathname: '/merchant/home', query: { 
                                payerRef:payerRef,
                                envName: environment ? environment.name : localStorage.getItem("env")
                            }}}>
                                <a className="nav-link">Affiliates</a>
                            </Link>
                        </li>
                        <li key="transactions" className="nav-item">
                            {/* <Link href={`/merchant/transactions/${payerRef}`}> */}
                            <Link href={
                                { 
                                    pathname: `/merchant/transactions/${payerRef}`, 
                                    query: { 
                                        envName: environment ? environment.name : localStorage.getItem("env")
                                    }
                                }
                            }>

                                <a className="nav-link">Transactions</a>
                            </Link>
                        </li>
                        <li key="1099NECTMG" className="nav-item">
                            {/* <Link href={`/merchant/transactions/${payerRef}`}> */}
                            <Link href={
                                { 
                                    pathname: `/merchant/1099Nec/${businessId}`, 
                                    query: { 
                                        payerRef:payerRef,
                                        envName: environment ? environment.name : localStorage.getItem("env")
                                    }
                                }
                            }>

                                <a className="nav-link">1099 NEC</a>
                            </Link>
                        </li>
                    </ul>

                    <span className="text-light">Environment : {environment ? environment.name : localStorage.getItem("env")}</span>
                    <Link href='/merchant/profile'>
                        <a className="btn btn-outline-primary my-2 mx-2 float-end"><i className="bi bi-person-circle"></i> Profile</a>
                    </Link>
                    {/* <button className="btn btn-outline-primary my-2 mx-2 float-end" data-bs-toggle="modal" data-bs-target="#merchantProfileModal" ><i className="bi bi-person-circle"></i> Profile</button> */}
                    <button className="btn btn-danger my-2 float-end" onClick={handleLogOut}>Logout <i className="bi bi-box-arrow-right"></i></button>
                </div>
            </div>
        </nav>
        </>
    )
}

export default MerchantNavBar

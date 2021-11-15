import React,{useEffect, useState} from 'react'
import Router from 'next/router'
import { useUserValue } from '../../contexts/UserContext'
import { actionTypes } from "../../contexts/userReducer"
import Link from "next/link";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios';

const VendorNavbar = () => {
    const [{ user_details }, dispatch] = useUserValue();
    const [payeeRef,setPayeeRef] = useState();
    const handleLogOut = ()=>{
        localStorage.clear();
        dispatch({
            type: actionTypes.SET_USER_DETAILS,
            data: null,
        })
        Router.push('/vendor/login')
    }

    const fetchdata = async ()=>{
        var id = localStorage.getItem('id')
        const affiliateRes = await axios.get(`/api/affiliate/${id}`)
        const details = affiliateRes.data

        // console.log(details)

        dispatch({
            type: actionTypes.SET_USER_DETAILS,
            data: details.user[0],
        })

        setPayeeRef(details.user[0].payeeRef)
    }

    useEffect(() => {
        // if(!user_details)
        // {
        //     Router.push('/vendor/login')
        // }
        fetchdata()
        //eslint-disable-next-line
    }, [])
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
                            <Link href={`/vendor/home/${payeeRef}`}>
                                <a className="nav-link">Home</a>
                            </Link>
                        </li>
                    </ul>

                    <Link href='/vendor/profile'>
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

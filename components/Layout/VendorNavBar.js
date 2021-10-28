import React,{useEffect} from 'react'
import Router from 'next/router'
import { useUserValue } from '../../contexts/UserContext'
import { actionTypes } from "../../contexts/userReducer"
import Link from "next/link";
import "bootstrap-icons/font/bootstrap-icons.css";

const VendorNavbar = () => {
    const [{ user_details }, dispatch] = useUserValue();

    const handleLogOut = ()=>{
        localStorage.clear();
        dispatch({
            type: actionTypes.SET_USER_DETAILS,
            data: null,
        })
        Router.push('/vendor/login')
    }

    useEffect(() => {
        if(!user_details)
        {
            Router.push('/vendor/login')
        }
    }, [])
    return (
        <>
        <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Vendor Management</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarScroll">
                    <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
                        <li className="nav-item">
                            <Link href='/vendor/home'>
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

import React from 'react'
import { signOut } from "next-auth/client"
import MerchantProfile from './MerchantProfile'

const MerchantNavBar = () => {
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
                            <a className="nav-link active" aria-current="page" href="#">Active</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item float-end">
                            <a className="nav-link" href="#">Profile</a>
                        </li>
                    </ul>

                    <button className="btn btn-outline-primary my-2 mx-2 float-end" data-bs-toggle="modal" data-bs-target="#merchantProfileModal" >Profile</button>
                    <button className="btn btn-danger my-2 float-end" onClick={()=>signOut()}>Logout</button>
                </div>
            </div>
        </nav>
        <MerchantProfile />
        </>
    )
}

export default MerchantNavBar

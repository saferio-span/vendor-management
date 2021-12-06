import React,{ useState } from 'react'
import Link from "next/link";

const WhCertificate = ({content}) => {
    const keyVal = Math.floor(Math.random() * 10000000)
    const [display,setDisplayIframe] = useState()
    console.log(keyVal)
    console.log(content)
        
    return (
        <div className="container">
            <div className="row mt-3">
                <div className="col-11"><h1>Wh certificate</h1></div>
                
                
            </div>
            <div className="row">
                <div className="col-2">
                    <button onClick={ () => setDisplayIframe(true) }> Show iFrame </button>
                </div>
                <div className="col-8 ">
                    
                </div>
                <div className="col-2">
                    <Link href={'/list'}>
                        <a className="btn btn-primary">List</a>
                    </Link>
                </div>
            </div>
            

            {display && <iframe key={keyVal} className="my-1" title="W9" width="100%" height="625" src="https://testlinks.taxbandits.io?uId=16e2845b-3d9e-4621-bdcd-cba8751f0ab2" /> }
                       
        </div>
    )
}

export default WhCertificate

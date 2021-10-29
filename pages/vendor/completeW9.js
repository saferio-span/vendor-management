import React,{useState} from 'react'
import Link from "next/link";
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import Router from 'next/router'
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'
import VendorNavbar from '../../components/Layout/VendorNavBar'


export const getServerSideProps = async (context)=>{

    const { req } = context;
    const { id } = context.query;
    const { origin } = absoluteUrl(req)
  
    const affiliateRes = await axios.get(`${origin}/api/affiliate/${id}`)
    const affiliateData = await affiliateRes.data
    
    console.log(affiliateData)

    const res = await axios.post(`${origin}/api/affiliate/getW9Url`,
    { 
        payeeId:affiliateData[0].payeeRef, 
        fullName:affiliateData[0].name, 
        address1:affiliateData[0].address1,
        address2:affiliateData[0].address2, 
        city:affiliateData[0].city, 
        stateName:affiliateData[0].state, 
        zipCd:affiliateData[0].zip, 
        tinMatch:true 
    })

    const w9data = await res.data

    return {
        props : {w9data}
      }

}


const CompleteW9 = ({w9data}) => {

    const safariFix = (w9Url) => {
		var is_safari = navigator.userAgent.indexOf('Safari') > -1;
		// Chrome has Safari in the user agent so we need to filter (https://stackoverflow.com/a/7768006/1502448)
		var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
		if (is_chrome && is_safari) {
			is_safari = false;
		}
		if (is_safari) {
			console.log('safari found');
			// See if cookie exists (https://stackoverflow.com/a/25617724/1502448)
			if (!document.cookie.match(/^(.*;)?\s*fixed\s*=\s*[^;]+(.*)?$/)) {
				// Set cookie to maximum (https://stackoverflow.com/a/33106316/1502448)
				document.cookie =
					'fixed=fixed; expires=Tue, 19 Jan 2038 03:14:07 UTC; path=/';
				console.log('before replace');
				window.location.replace(w9Url);
			} else {
				console.log('no cookie');
				window.location.replace(w9Url);
			}
		}
	};

    console.log(w9data)
    return (
        <>
            <VendorNavbar />
            <div className="container">
                <div className="row">
                    <div className="col-11"><h1>Complete your W9</h1></div>
                    <div className="col">
                        <Link href={`/vendor/profile`}>
                            <a className="btn btn-danger my-2">Back</a>
                        </Link>
                    </div>
                </div>

            {w9data.W9Url && 
                <>
                    <div><span className="badge rounded-pill bg-secondary px-2 py-2">To get a TIN Match failure, the last three digits of the TIN must
                                be Zeroes (eg: 123-45-6000)</span></div>
                    
                    <Link href={w9data.W9Url}>
                        <a target="_blank">{w9data.W9Url}</a>
                    </Link>

                    {safariFix(w9data.W9Url)}
                    <iframe className="my-5" title="W9" width="100%" height="800" src={w9data.W9Url} />
                </>
            }

            {!w9data.W9Url && <>
                <h1 className="my-5"> Cannot load W9 Form</h1>
            </>}
            
            </div>
        </>
    )
}

export default CompleteW9

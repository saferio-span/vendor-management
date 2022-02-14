import React,{useState} from 'react'
import Link from "next/link";
import axios from 'axios';
import Router from 'next/router'
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'
import VendorNavbar from '../../components/Layout/VendorNavBar'
import MoonLoader from "react-spinners/MoonLoader";


export const getServerSideProps = async (context)=>{

    const { req } = context;
    const { id,envName,tin } = context.query;
    const { origin } = absoluteUrl(req)
    console.log(origin)
  
    const affiliateRes = await axios.get(`${origin}/api/affiliate/${id}`)
    const result = await affiliateRes.data
    const affiliateData = await result.user
    const merchantData = await result.merchant

    const res = await axios.post(`${origin}/api/affiliate/getWhUrl`,
    { 
        payeeId:affiliateData[0].payeeRef, 
        fullName:affiliateData[0].name, 
        address1:affiliateData[0].address1,
        address2:affiliateData[0].address2, 
        city:affiliateData[0].city, 
        stateName:affiliateData[0].state, 
        zipCd:affiliateData[0].zip, 
        tinMatch:true,
        businessId : merchantData.businessId,
        payerRef : merchantData.payerRef,
        envName : envName,
        successUrl : `${origin}/vendor/home/${affiliateData[0].payeeRef}`,
        returnUrl :`${origin}/vendor/profile`,
        tin
    })

    const whdata = await res.data

    if(res.status != 200)
    {
        const { res } = context;
        res.setHeader("location", "/profile");
        res.end();
        return;
    }


    return {
        props : {
            whdata,
        }
      }

}


const CompleteWh = ({whdata}) => {

    const [loading,setLoading]=useState(true)

    if(whdata === "Access token not set")
    {
        Router.push(`/profile`)
    }
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "red"
    }
    

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
    
    const handleLoader = ()=>{
        setLoading(false)
    }

    return (
        <>
            <VendorNavbar />
            <div className="container">
                <div className="row">
                    <div className="col-11"><h1>Complete your Wh</h1></div>
                    <div className="col">
                        <Link href={`/vendor/profile`}>
                            <a className="btn btn-danger my-2">Back</a>
                        </Link>
                    </div>
                </div>

            {whdata.Url && 
                <>
                    <div><span className="badge rounded-pill bg-secondary px-2 py-2">To get a TIN Match failure, the last three digits of the TIN must
                                be Zeroes (eg: 123-45-6000)</span></div>
                    
                    <Link href={`${whdata.Url}&hb=true`}>
                        <a target="_blank">{`${whdata.Url}&hb=true`}</a>
                    </Link>
                    {loading && <>
                        <div className='my-5 d-flex justify-content-center'>
                            <MoonLoader className="my-5" color="#F26C20" loading={loading} css={{override}} size={100} />
                        </div>
                    </>}
                    {/* {safariFix(whdata.Url)} */}
                    <iframe className="my-5" title="W9" width="100%" height="800" onLoad={handleLoader} src={`${whdata.Url}&hb=true`} />
                </>
            }

            {!whdata.Url && <>
                <h1 className="my-5"> Cannot load W9 Form</h1>
            </>}

            {/* {loading && <GridLoader color="#F26C20" loading={loading} size={150} />} */}
            
            </div>
        </>
    )
}

export default CompleteWh

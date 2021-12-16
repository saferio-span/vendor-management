import React,{useEffect,useState} from 'react'
import PostList from '../components/Layout/PostList';
import absoluteUrl from 'next-absolute-url'
import axios from 'axios';
import Link from "next/link"
import Select from 'react-select'

export const getServerSideProps = async (context)=>{
    const { req,query } = context;
    const { origin } = absoluteUrl(req)



    const res = await axios.get(`${origin}/api/merchant/getWebHook`)
    const webHook = await res.data
    if(query.envName != ""){
        const merchantRes = await axios.post(`${origin}/api/merchant/getAll`,{
            envName: query.envName
        })
        const merchants = await merchantRes.data
        const affRes = await axios.post(`${origin}/api/affiliate/getAll`,{
            envName: query.envName
        })
        const affiliates = await affRes.data
    
        return{
          props:{
            env:query.envName,
            webHook,
            merchants,
            affiliates
           }
        }
    }
    else
    {
        const merchantRes = await axios.get(`${origin}/api/merchant/getAll`)
        const merchants = await merchantRes.data
        const affRes = await axios.get(`${origin}/api/affiliate/getAll`)
        const affiliates = await affRes.data
    
        return{
          props:{
            env:"",
            webHook,
            merchants,
            affiliates
           }
        }
    } 
    
}

const WebHook = (props) => {

    // console.log(props.affiliates)
    // console.log(props.merchants)
    const [merchant,setMerchant]=useState("")
    const [affiliate,setAffiliate]=useState("")
    const [merchantFilter,setMerchantFilter]=useState(false)
    const [affiliateFilter,setAffiliateFilter]=useState(false)
    const [webHook,setWebHook]=useState(props.webHook)

    const merchantOptions = []
    const affiliateOptions = []

    for(const key in props.affiliates )
    {
        affiliateOptions.push({ value: props.affiliates[key].payeeRef, label: props.affiliates[key].name })
    }

    for(const key in props.merchants )
    {
        merchantOptions.push({ value: props.merchants[key].businessID, label: props.merchants[key].name })
    }

    const handleMerchantChange = (e)=>{
        if(e !== null)
        {
            setMerchant(e.value)
            setMerchantFilter(true)
            setAffiliateFilter(false)
        }
        else
        {
            setMerchantFilter(false)
            setAffiliateFilter(false)
            setMerchant("")
        }
    }

    const handleAffiliateChange = (e)=>{
        if(e !== null)
        {
            setAffiliate(e.value)
            setMerchantFilter(false)
            setAffiliateFilter(true)
        }
        else
        {
            setMerchantFilter(false)
            setAffiliateFilter(false)
            setAffiliate("")
        }
    }

    useEffect(() => {
        setWebHook([])
        if(merchantFilter)
        {
            const searchResult = []
            props.webHook.forEach(result => {
                if(result.FormType === "FormW9")
                {
                    if(result.FormW9.Requester.BusinessId === merchant)
                    {
                        searchResult.push(result)
                    }
                }
                else if(result.FormType === "W8Ben")
                {
                    if(result.FormW8Ben.Requester.BusinessId === merchant)
                    {
                        searchResult.push(result)
                    }
                }
            })
            setWebHook(searchResult)
        }
        else if(affiliateFilter)
        {
            const searchResult = []
            props.webHook.forEach(result => {
                if(result.FormType === "FormW9")
                {
                    if(result.FormW9.PayeeRef === affiliate)
                    {
                        searchResult.push(result)
                    }
                }
                else if(result.FormType === "W8Ben")
                {
                    if(result.FormW8Ben.PayeeRef === affiliate)
                    {
                        searchResult.push(result)
                    }
                }
            })
            setWebHook(searchResult)
        }
        else if(props.env !== "")
        {
            const searchResult = []
            props.webHook.forEach(result => {
                affiliateOptions.forEach(aff=>{
                    if(result.FormType === "FormW9")
                    {
                        if(result.FormW9.PayeeRef === aff.value)
                        {
                            searchResult.push(result)
                        }
                    }
                    else if(result.FormType === "W8Ben")
                    {
                        if(result.FormW8Ben.PayeeRef === aff.value)
                        {
                            searchResult.push(result)
                        }
                    }
                })
                
            })
            setWebHook(searchResult)
        }
        else
        {
            setWebHook(props.webHook)
        }
         //eslint-disable-next-line
    }, [merchant,affiliate])

    return (
        <>
            <div className="container">
                <div className="card px-3">
                    <div className="row">
                        <div className="col-11 s4">
                            <h4 className="my-3 mx-3">WebHook Log</h4>
                        </div>
                        <div className="col-1">
                            <Link href='/'>
                                <a className="btn btn-danger my-3" >Back</a>
                            </Link>
                        </div>
                    </div>
                    <div className="row mx-2 mb-3">
                        <div className="col-4">
                            <label className="form-label">Sort by merchant</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue="0"
                                isSearchable="true"
                                isClearable="true"
                                name="merchants"
                                id="merchants"
                                options={merchantOptions}
                                onChange={handleMerchantChange}
                            />
                        </div>
                        <div className="col-4">
                            <label className="form-label">Sort by affiliate</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue="0"
                                isSearchable="true"
                                isClearable="true"
                                name="affiliates"
                                id="affiliates"
                                options={affiliateOptions}
                                onChange={handleAffiliateChange}
                            />
                        </div>
                    </div>
                    <PostList posts={webHook} />
                </div>
            </div>
        </>
    )
}

export default WebHook

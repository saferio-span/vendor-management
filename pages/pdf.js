import React,{useEffect,useState} from 'react'
import absoluteUrl from 'next-absolute-url'
import axios from 'axios';
import Link from "next/link"

export const getServerSideProps = async (context)=>{
    const { req } = context;
    const { origin } = absoluteUrl(req)

    const res = await axios.get(`${origin}/api/getPdfUrl`)
    const urlData= await res.data

    console.log(urlData)
    
        return{
          props:{
            data:urlData
           }
        }
    
}

const WebHook = (props) => {

    // console.log(props.affiliates)
    console.log(props.data)

    const handleUrl=async(url)=>{
        console.log(url)
        const res = await axios.post(`/api/decryptPdf`,{
            urlLink:url
        })
        const result = await res.data
        console.log(result)
    }

    return (
        <>
            <div className="container">
                <div className="card px-3">
                    <div className="row">
                        <div className="col-11 s4">
                            <h4 className="my-3 mx-3">Pdf urls</h4>
                        </div>
                        <div className="col-1">
                            <Link href='/'>
                                <a className="btn btn-danger my-3" >Back</a>
                            </Link>
                        </div>
                    </div>
                </div>
                <table className="table table-hover table-striped table-responsive">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Files Unmasked</th>
                  <th>Files Masked</th>
                  
                </tr>
              </thead>
              <tbody>
                {props.data && props.data.Form1099NecRecords.SuccessRecords.map((details) => {
                    return (
                    <>
                        <tr key={details.RecordId}>
                            <td>{details.RecordId}</td>
                            <td>
                                <button key={`${details.Files.Copy1.Unmasked}`} className='btn btn-warning mx-1' onClick={()=>handleUrl(details.Files.Copy1.Unmasked)}>Copy1</button>
                                <button key={`${details.Files.Copy2.Unmasked}`} className='btn btn-warning mx-1' onClick={()=>handleUrl(details.Files.Copy2.Unmasked)}>Copy2</button>
                                <button key={`${details.Files.CopyB.Unmasked}`} className='btn btn-warning mx-1' onClick={()=>handleUrl(details.Files.CopyB.Unmasked)}>CopyB</button>
                                <button key={`${details.Files.CopyC.Unmasked}`} className='btn btn-warning mx-1' onClick={()=>handleUrl(details.Files.CopyC.Unmasked)}>CopyC</button>
                            </td>
                            <td>
                                <button key={`${details.Files.Copy1.Masked}`} className='btn btn-danger mx-1' onClick={()=>handleUrl(details.Files.Copy1.Masked)} >Copy1</button>
                                <button key={`${details.Files.Copy2.Masked}`} className='btn btn-danger mx-1' onClick={()=>handleUrl(details.Files.Copy2.Masked)} >Copy2</button>
                                <button key={`${details.Files.CopyB.Masked}`} className='btn btn-danger mx-1' onClick={()=>handleUrl(details.Files.CopyB.Masked)} >CopyB</button>
                                <button key={`${details.Files.CopyC.Masked}`} className='btn btn-danger mx-1' onClick={()=>handleUrl(details.Files.CopyC.Masked)} >CopyC</button>
                            </td>
                            
                        
                        </tr>
                    </>
                    )
                })}
              </tbody>
            </table>
            <button className='btn btn-danger mx-1' onClick={()=>handleUrl("https://expressirsforms.s3.us-east-1.amazonaws.com/MyEsign1888.png")} >Custom</button>
            </div>
        </>
    )
}

export default WebHook

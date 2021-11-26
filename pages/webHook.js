import React from 'react'
import PostList from '../components/Layout/PostList';
import absoluteUrl from 'next-absolute-url'
import axios from 'axios';

export const getServerSideProps = async (context)=>{
    const { req } = context;
    const { origin } = absoluteUrl(req)

    const res = await axios.get(`${origin}/api/merchant/getWebHook`)
    const webHook = await res.data

    return{
      props:{
        webHook
       }
    }
}

const WebHook = (props) => {
    return (
        <>
            <div className="container">
                <div className="card px-3">
                    <div className="row">
                        <div className="col s4">
                            <h4 className="my-3 mx-3">WebHook Log</h4>
                        </div>
                    </div>
                    <PostList posts={props.webHook} />
                </div>
            </div>
           
            
        </>
    )
}

export default WebHook

import React from 'react'
import Link from "next/link";

const W9Pdf = ({url,userId}) => {

    return (
        <>
            <div className="modal fade" id={`w9Pdf${userId}`} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={userId !== "" ? `staticBackdropLabel${userId}` : `staticBackdropLabel`} >W9 PDF</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <Link href={url}>
                                <a target="_blank">{url}</a>
                            </Link>
                            <iframe className="my-1" title="W9" width="100%" height="500" src={url} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default W9Pdf

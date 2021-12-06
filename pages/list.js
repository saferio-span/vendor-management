import React from 'react'
import Link from "next/link";

const List = () => {
    return (
        <div className="row my-5">
            <div className="col-11">
                <h3 className="mt-2 text-primary">List page</h3>
            </div>
            <div className="col-1">
                <Link href={'/check'}>
                    <a className="btn btn-primary">Back</a>
                </Link>
            </div>
        </div>
    )
}

export default List

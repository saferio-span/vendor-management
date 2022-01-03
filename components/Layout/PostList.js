import React from 'react';
import moment from 'moment';
import "bootstrap-icons/font/bootstrap-icons.css";

const PostList = ({ posts }) => {
	const handleRefresh=()=>{
		window.location.reload();
	}
	return (
		<div>
			<div className="row">
				<div className="col-2 offset-10 d-flex flex-row-reverse">
					<button className="btn btn-secondary mx-1 my-2" onClick={handleRefresh}>Refresh <i className="bi bi-arrow-clockwise"></i></button>
				</div>
			</div>
			<ul className="" style={{ padding: 0 }}>
				{posts && posts.map((post, ind) => (
					<li
						className="card"
						key={post._id}
						style={
							ind % 2 === 0
								? { backgroundColor: '#ffffff' }
								: { backgroundColor: '#faffff' }
						}
					>
						<div className="card-body" >
							{
								post.date && <strong style={{ color: 'crimson' }}>
									Received:{' '}
									{moment(post.date).format('dddd, MMMM Do YYYY, h:mm:ss a')}
								</strong>
							}
							<pre>{JSON.stringify(post, null, 2)}</pre>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default PostList;

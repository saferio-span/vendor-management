import React from 'react';
import moment from 'moment';


const PostList = ({ posts }) => {
	return (
		<div>
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

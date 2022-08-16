import React from 'react';
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactionButtons from './ReactionButtons';
import { Link } from 'react-router-dom';
//After createEntityAdapter used:
import { useSelector } from 'react-redux';
import { selectPostById } from './postsSlice';

// let PostsExcerpt = ({ post }) => {
// const PostsExcerpt = ({ post }) => {
const PostsExcerpt = ({ postId }) => {
  const post = useSelector((state) => selectPostById(state, postId));
  return (
    <article key={post.id}>
      <h2>{post.title}</h2>
      <p className="excerpt">{post.body.substring(0, 75)}</p>
      <p className="postCredit">
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  );
};

// PostsExcerpt renders all the 100 excerpts everytime a change hanppens. Ex: the increaseCount is clicked. To avoid this lets use .memo().
// PostsExcerpt = React.memo(PostsExcerpt); //  .memo() will not let the PostsExcerpt component to re-render if the prop {post} passed into it does not change.

// We can remove .memo() and use State Normalization instead:
// Normalization State Structure: Recommended approach for storing items. No duplication of data. Creates an ID Lookup which means items are store in a lookup table by item ID.
// State Structure: { posts: {ids:[1,2,3,..], entities:{'1':{userId:1, id:1, title:..etc}}}}
// When you are using Normalized data with redux toolkit the toolkit provides a "createEntityAdapter" API.
// createEntityAdapter" API: Makes redux slices less complicated and easier to manage. It abstracts more logic from components, has built-in CRUD methods, and has automatic selector generation.
export default PostsExcerpt;

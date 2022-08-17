import { useSelector } from 'react-redux';
// import { selectAllPosts, getPostsStatus, getPostsError } from './postsSlice';
// After createEntityAdapter changes:
import { selectPostIds, getPostsStatus, getPostsError } from './postsSlice';
import PostsExcerpt from './PostsExcerpt';

export default function PostsList() {
  // const posts = useSelector(selectAllPosts);
  const orderedPostIds = useSelector(selectPostIds);
  const postStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  let renderedPosts;
  if (postStatus === 'loading') {
    renderedPosts = <p>"Loading..."</p>;
  } else if (postStatus === 'succeeded') {
    // const orderedPosts = posts
    //   .slice()
    //   .sort((a, b) => b.date.localeCompare(a.date)); // order latest post on top

    // renderedPosts = orderedPosts.map((post) => (
    //   <PostsExcerpt key={post.id} post={post} />
    // ));

    // Since we do the sorting in the createEntityAdapter inside the postsSlice.js, we don't need to sort here and can use the orderedPostIds array to map over the posts:
    renderedPosts = orderedPostIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
  } else if (postStatus === 'failed') {
    renderedPosts = <p>{error}</p>;
  }

  return (
    <section>
      {/* <h2>Posts</h2> */}
      {renderedPosts}
    </section>
  );
}

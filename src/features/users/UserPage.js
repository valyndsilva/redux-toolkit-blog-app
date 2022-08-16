import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserById } from '../users/usersSlice';
import { selectPostsByUser } from '../posts/postsSlice';
import { Link, useParams } from 'react-router-dom';

export default function UserPage() {
  const { userId } = useParams();
  const user = useSelector((state) => selectUserById(state, Number(userId)));

  const postsForUser = useSelector(
    (state) =>
      //   const allPosts = selectAllPosts(state);
      //   return allPosts.filter(post => post.userId === Number(userId); // returns a new array everytime and useSelector runs everytime an action is dispatched.
      // useSelector runs everytime increaseCount is dispatched in the header and forces component to re-render. So UserPage keeps updating when we click on increaseCount button. This issue needs to be fixed with memoization.
      selectPostsByUser(state, Number(userId)) // https://react-redux.js.org/api/hooks#using-memoizing-selectors  check postsSlice.js
  );

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user?.name}</h2>

      <ol>{postTitles}</ol>
    </section>
  );
}

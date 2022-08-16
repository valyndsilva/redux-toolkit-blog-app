import PostsList from "./features/posts/PostsList";
import AddPostForm from "./features/posts/AddPostForm";
import SinglePosts from "./features/posts/SinglePosts";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import EditPostForm from "./features/posts/EditPostForm";
import UsersList from "./features/users/UsersList";
import UserPage from "./features/users/UserPage";
import Missing from "./components/Missing";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostsList />} />
        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePosts />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>
        <Route path="user">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>
        {/* Catch all non-existent paths and replace with 404 component if you want */}
        {/* <Route path="*" element={<Navigate to="/" replace  />} */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;

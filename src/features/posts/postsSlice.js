import {
  createSlice,
  nanoid,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import axios from 'axios';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});
// const initialState = [
//   {
//     id: '1',
//     title: 'Title 1',
//     body: 'lorem ipsum text 1 goes here',
//     date: sub(new Date(), { minutes: 10 }).toISOString(),
//     reactions: {
//       thumbsUp: 0,
//       wow: 0,
//       heart: 0,
//       rocket: 0,
//       coffee: 0,
//     },
//   },
//   {
//     id: '2',
//     title: 'Title 2',
//     body: 'lorem ipsum text 2 goes here',
//     date: sub(new Date(), { minutes: 5 }).toISOString(),
//     reactions: {
//       thumbsUp: 0,
//       wow: 0,
//       heart: 0,
//       rocket: 0,
//       coffee: 0,
//     },
//   },
// ];

// const initialState = {
//   posts: [],
//   status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
//   error: null,
//   count: 0,
// };

//when using createEntityAdapter we restructure the initial state
const initialState = postsAdapter.getInitialState({
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  count: 0,
});

//createAsyncThunk accepts a "Redux action type string" and a "callback function that should return a promise".
// It generates promise lifecycle action types based on the action type prefix that you pass in, and returns a thunk action creator that will run the promise callback and dispatch the lifecycle actions based on the returned promise.

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(POSTS_URL);
  return response.data;
});

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost);
    return response.data;
  }
);
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
      return response.data;
    } catch (err) {
      //return err.message;
      return initialPost; // only for testing Redux!
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const response = await axios.delete(`${POSTS_URL}/${id}`);
      if (response?.status === 200) return initialPost;
      return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
      return err.message;
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // this is where actions are defined
    postAdded: {
      reducer(state, action) {
        // state.push(action.payload);
        state.posts.push(action.payload);
      },
      // callback function
      prepare(title, body, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            body,
            date: new Date().toISOString(),
            userId,
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },
    reactionAdded: (state, action) => {
      const { postId, reaction } = action.payload;
      // const existingPost = state.find((post) => post.id === postId);
      // const existingPost = state.posts.find((post) => post.id === postId);
      // After using createEntityAdapter we chnage existingPost as below:
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    increaseCount: (state, action) => {
      state.count = state.count + 1;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here
    // The 'builder' parameter is an object that let's us define additional case reducers that run in response to the actions defined outside the Slice.

    // Cases below are listening to promise status action types that are dispatched by the fetchPosts Thunk.
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        //Adding date and reactions
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          // console.log(post);
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });
        // Add any fetched posts to the array
        // state.posts = state.posts.concat(loadedPosts); // does not work. causes duplicates so removed
        // state.posts = loadedPosts;
        // After using createEntityAdapter we can use pre-defined CRUD methods below:
        postsAdapter.upsertMany(state, loadedPosts); // loading post
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        console.log(action.payload);
        // state.posts.push(action.payload);
        // After using createEntityAdapter we can use pre-defined CRUD methods below:
        postsAdapter.addOne(state, action.payload); // adding new post
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          // if playload doesn't have the id
          console.log('Update could not complete');
          console.log(action.payload); // return err message
          return;
        }
        // const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        // const posts = state.posts.filter((post) => post.id !== id); // filter out the previous post
        // state.posts = [...posts, action.payload];
        // After using createEntityAdapter we can use pre-defined CRUD methods below:
        postsAdapter.upsertOne(state, action.payload); // update post
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Delete could not complete');
          console.log(action.payload); // returns status text
          return;
        }
        const { id } = action.payload;
        // const posts = state.posts.filter((post) => post.id !== id);
        // state.posts = posts;
        // After using createEntityAdapter we can use pre-defined CRUD methods below:
        postsAdapter.removeOne(state, id);
      });
  },
});

// export const selectAllPosts = (state) => state.posts;
// export const selectAllPosts = (state) => state.posts.posts;
// export const selectPostById = (state, postId) =>
//   state.posts.posts.find((post) => post.id === postId);

//Using getSelectors
// getSelectors creates these selectors and we rename them with aliases using destructuring:
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts);

export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

// Creating and using memoizing selector:
// When using useSelector with an inline selector, a new instance of the selector is created whenever the component is rendered.
// This works as long as the selector does not maintain any state. However, memoizing selectors (e.g. created via createSelector from reselect) do have internal state, and therefore care must be taken when using them.
// https://react-redux.js.org/api/hooks#using-memoizing-selectors
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId) // only when posts or userId changes we get a new output from this selector.
);

export const { postAdded, reactionAdded, increaseCount } = postsSlice.actions;
export default postsSlice.reducer;

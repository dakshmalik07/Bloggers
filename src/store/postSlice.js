import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    currentPost: null,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },

    updatePost: (state, action) => {
      const updatedPost = action.payload;

      // Update in the posts array
      const index = state.posts.findIndex(
        (post) => post.$id === updatedPost.$id
      );
      if (index !== -1) {
        state.posts[index] = updatedPost;
      } else {
        // If not found in array (possible if directly viewing/editing without listing), add it
        state.posts.push(updatedPost);
      }

      // Also update currentPost if it's the same post
      if (state.currentPost && state.currentPost.$id === updatedPost.$id) {
        state.currentPost = updatedPost;
      }
    },
    
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.$id !== action.payload);
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null; 
    },
  },
});

export const {
  setPosts,
  addPost,
  updatePost,
  deletePost,
  setCurrentPost,
  clearCurrentPost,
} = postSlice.actions;

export default postSlice.reducer;

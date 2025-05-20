import { createSlice } from "@reduxjs/toolkit";

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addComment: (state, action) => {
      state.comments.unshift(action.payload); // Add to beginning for newest first
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment.$id !== action.payload
      );
    },
    setCommentsLoading: (state) => {
      state.isLoading = true;
    },
    setCommentsError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearComments: (state) => {
      state.comments = [];
    }
  },
});

export const {
  setComments,
  addComment,
  deleteComment,
  setCommentsLoading,
  setCommentsError,
  clearComments
} = commentsSlice.actions;

export default commentsSlice.reducer;
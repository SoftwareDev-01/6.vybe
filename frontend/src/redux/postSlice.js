import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    postData: [],
  },
  reducers: {
    /* Load all posts */
    setPostData: (state, action) => {
      state.postData = action.payload;
    },

    /* Add new post (upload) */
    addPost: (state, action) => {
      state.postData.unshift(action.payload); // Instagram: newest on top
    },

    /* Update a single post (like, comment) */
    updatePost: (state, action) => {
      const index = state.postData.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.postData[index] = action.payload;
      }
    },

    /* Remove post (future delete feature) */
    removePost: (state, action) => {
      state.postData = state.postData.filter(
        (p) => p._id !== action.payload
      );
    },

    /* Reset on logout */
    resetPosts: (state) => {
      state.postData = [];
    },
  },
});

export const {
  setPostData,
  addPost,
  updatePost,
  removePost,
  resetPosts,
} = postSlice.actions;

export default postSlice.reducer;

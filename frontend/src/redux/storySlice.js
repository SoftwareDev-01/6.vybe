import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
  name: "story",
  initialState: {
    storyData: null,          // currently viewed story
    storyList: [],            // all stories feed
    currentUserStory: null,   // logged-in user's story
  },
  reducers: {
    /* Open a story */
    setStoryData: (state, action) => {
      state.storyData = action.payload;
    },

    /* Load all stories */
    setStoryList: (state, action) => {
      state.storyList = action.payload;
    },

    /* Upload / update current user's story */
    setCurrentUserStory: (state, action) => {
      state.currentUserStory = action.payload;

      // Replace existing story or add new
      const index = state.storyList.findIndex(
        (s) => s.author?._id === action.payload?.author?._id
      );

      if (index !== -1) {
        state.storyList[index] = action.payload;
      } else if (action.payload) {
        state.storyList.unshift(action.payload);
      }
    },

    /* Clear story viewer */
    clearStoryData: (state) => {
      state.storyData = null;
    },

    /* Reset on logout */
    resetStories: (state) => {
      state.storyData = null;
      state.storyList = [];
      state.currentUserStory = null;
    },
  },
});

export const {
  setStoryData,
  setStoryList,
  setCurrentUserStory,
  clearStoryData,
  resetStories,
} = storySlice.actions;

export default storySlice.reducer;

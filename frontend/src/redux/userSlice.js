import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    suggestedUsers: [],
    profileData: null,
    following: [],
    searchData: [],
    notificationData: [],
  },
  reducers: {
    /* Logged-in user */
    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    /* Suggestions */
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },

    /* Profile page data */
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },

    /* Search */
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },

    /* Notifications (full replace) */
    setNotificationData: (state, action) => {
      state.notificationData = action.payload;
    },

    /* 🔔 Append notification (socket-safe) */
    addNotification: (state, action) => {
      state.notificationData.unshift(action.payload);
    },

    /* Following list */
    setFollowing: (state, action) => {
      state.following = action.payload;
    },

    /* Follow / Unfollow (Instagram-style) */
    toggleFollow: (state, action) => {
      const targetUserId = action.payload;

      if (state.following.includes(targetUserId)) {
        state.following = state.following.filter(
          (id) => id !== targetUserId
        );

        if (state.profileData?._id === targetUserId) {
          state.profileData.followers.pop();
        }
      } else {
        state.following.push(targetUserId);

        if (state.profileData?._id === targetUserId) {
          state.profileData.followers.push(state.userData);
        }
      }
    },

    /* 🚪 Logout / reset */
    resetUser: (state) => {
      state.userData = null;
      state.suggestedUsers = [];
      state.profileData = null;
      state.following = [];
      state.searchData = [];
      state.notificationData = [];
    },
  },
});

export const {
  setUserData,
  setSuggestedUsers,
  setProfileData,
  setSearchData,
  setNotificationData,
  addNotification,
  setFollowing,
  toggleFollow,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    onlineUsers: [],
    typingUsers: {}, // { userId: true }
  },
  reducers: {
    /* Set socket instance */
    setSocket: (state, action) => {
      state.socket = action.payload;
    },

    /* Online users list */
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    /* Typing indicator ON */
    setTyping: (state, action) => {
      const { userId } = action.payload;
      state.typingUsers[userId] = true;
    },

    /* Typing indicator OFF */
    removeTyping: (state, action) => {
      const { userId } = action.payload;
      delete state.typingUsers[userId];
    },

    /* Reset everything on logout */
    resetSocket: (state) => {
      state.socket = null;
      state.onlineUsers = [];
      state.typingUsers = {};
    },
  },
});

export const {
  setSocket,
  setOnlineUsers,
  setTyping,
  removeTyping,
  resetSocket,
} = socketSlice.actions;

export default socketSlice.reducer;

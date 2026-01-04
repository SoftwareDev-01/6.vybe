import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    onlineUsers: [],
  },
  reducers: {
    /* ✅ Set socket ONLY once */
    setSocket: (state, action) => {
      if (!state.socket) {
        state.socket = action.payload;
      }
    },

    /* 🟢 Online users */
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    /* 🔄 Reset on logout */
    resetSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
      }
      state.socket = null;
      state.onlineUsers = [];
    },
  },
});

export const {
  setSocket,
  setOnlineUsers,
  resetSocket,
} = socketSlice.actions;

export default socketSlice.reducer;

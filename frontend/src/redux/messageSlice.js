import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    selectedUser: null,
    messages: [],
    prevChatUsers: [],
  },
  reducers: {
    /* Select chat user */
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = []; // reset on switch (Instagram-like)
    },

    /* Load full chat history */
    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    /* Append single message */
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    /* 🟡 DELETE FOR ME (REMOVE FROM UI) */
    deleteMessageForMe: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg._id !== action.payload
      );
    },

    /* 🔴 DELETE FOR EVERYONE (MARK AS DELETED) */
    deleteMessageForEveryone: (state, action) => {
      const msg = state.messages.find(
        (m) => m._id === action.payload
      );
      if (msg) {
        msg.isDeleted = true;
        msg.message = "This message was deleted";
        msg.image = "";
      }
    },

    /* Previous chat users */
    setPrevChatUsers: (state, action) => {
      state.prevChatUsers = action.payload;
    },

    /* Reset on logout */
    resetMessages: (state) => {
      state.selectedUser = null;
      state.messages = [];
      state.prevChatUsers = [];
    },
  },
});

export const {
  setSelectedUser,
  setMessages,
  addMessage,
  deleteMessageForMe,
  deleteMessageForEveryone,
  setPrevChatUsers,
  resetMessages,
} = messageSlice.actions;

export default messageSlice.reducer;

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
      state.messages = []; // reset messages on switch (like Instagram)
    },

    /* Load full chat history */
    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    /* Append single message (socket / send) */
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    /* Previous chat users list */
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
  setPrevChatUsers,
  resetMessages,
} = messageSlice.actions;

export default messageSlice.reducer;

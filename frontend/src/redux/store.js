import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import postReducer from "./postSlice";
import storyReducer from "./storySlice";
import loopReducer from "./loopSlice";
import messageReducer from "./messageSlice";
import socketReducer from "./socketSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    story: storyReducer,
    loop: loopReducer,
    message: messageReducer,
    socket: socketReducer,
  },

  devTools: process.env.NODE_ENV !== "production",

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // important for socket & FormData
    }),
});

export default store;

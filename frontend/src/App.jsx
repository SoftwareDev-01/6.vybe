import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

/* Pages */
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Upload from "./pages/Upload";
import Loops from "./pages/Loops";
import Story from "./pages/Story";
import Messages from "./pages/Messages";
import MessageArea from "./pages/MessageArea";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";

/* Hooks */
import getCurrentUser from "./hooks/getCurrentUser";
import getSuggestedUsers from "./hooks/getSuggestedUsers";
import getAllPost from "./hooks/getAllPost";
import getAllLoops from "./hooks/getAllLoops";
import getAllStories from "./hooks/getAllStories";
import getFollowingList from "./hooks/getFollowingList";
import getPrevChatUsers from "./hooks/getPrevChatUsers";
import getAllNotifications from "./hooks/getAllNotifications";

/* Redux */
import {
  setOnlineUsers,
  setSocket,
  resetSocket,
} from "./redux/socketSlice";
import { addNotification } from "./redux/userSlice";

export const serverUrl = "https://six-vybe-4kho.onrender.com";

function App() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);

  /* 🔹 App bootstrap (Instagram-style) */
  getCurrentUser();
  getSuggestedUsers();
  getAllPost();
  getAllLoops();
  getAllStories();
  getFollowingList();
  getPrevChatUsers();
  getAllNotifications();

  /* 🔹 Socket lifecycle */
  useEffect(() => {
    if (!userData) {
      if (socket) {
        socket.disconnect();
        dispatch(resetSocket());
      }
      return;
    }

    const socketIo = io(serverUrl, {
      query: { userId: userData._id },
      transports: ["websocket"],
    });

    dispatch(setSocket(socketIo));

    socketIo.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    socketIo.on("newNotification", (noti) => {
      dispatch(addNotification(noti)); // ✅ safe append
    });

    return () => {
      socketIo.off("getOnlineUsers");
      socketIo.off("newNotification");
      socketIo.disconnect();
    };
  }, [userData, dispatch]);

  return (
    /* 🌑 Instagram-like app shell */
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 font-[Inter] antialiased">
      <Routes>
        <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/" element={userData ? <Home /> : <Navigate to="/signin" />} />

        <Route
          path="/forgot-password"
          element={!userData ? <ForgotPassword /> : <Navigate to="/" />}
        />

        <Route
          path="/profile/:userName"
          element={userData ? <Profile /> : <Navigate to="/signin" />}
        />

        <Route
          path="/story/:userName"
          element={userData ? <Story /> : <Navigate to="/signin" />}
        />

        <Route
          path="/upload"
          element={userData ? <Upload /> : <Navigate to="/signin" />}
        />

        <Route
          path="/search"
          element={userData ? <Search /> : <Navigate to="/signin" />}
        />

        <Route
          path="/editprofile"
          element={userData ? <EditProfile /> : <Navigate to="/signin" />}
        />

        <Route
          path="/messages"
          element={userData ? <Messages /> : <Navigate to="/signin" />}
        />

        <Route
          path="/messageArea"
          element={userData ? <MessageArea /> : <Navigate to="/signin" />}
        />

        <Route
          path="/notifications"
          element={userData ? <Notifications /> : <Navigate to="/signin" />}
        />

        <Route
          path="/loops"
          element={userData ? <Loops /> : <Navigate to="/signin" />}
        />
      </Routes>
    </div>
  );
}

export default App;

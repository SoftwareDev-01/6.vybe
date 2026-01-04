import React, { useState } from "react";
import logo from "../assets/logo.png";
import { FaRegHeart } from "react-icons/fa6";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import OtherUser from "./OtherUser";
import Notifications from "../pages/Notifications";

function LeftHome() {
  const { userData, suggestedUsers, notificationData } = useSelector(
    (state) => state.user
  );

  const [showNotification, setShowNotification] = useState(false);
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside
      className={`hidden lg:flex flex-col w-[25%] h-screen 
      bg-[#0f0f0f] border-r border-gray-800
      ${showNotification ? "overflow-hidden" : "overflow-y-auto"}`}
    >
      {/* 🔹 Header */}
      <div className="sticky top-0 z-20 bg-[#0f0f0f] border-b border-gray-800">
        <div className="flex items-center justify-between px-5 py-4">
          <img src={logo} alt="logo" className="w-[90px]" />

          <div
            className="relative cursor-pointer"
            onClick={() => setShowNotification((prev) => !prev)}
          >
            <FaRegHeart className="text-gray-100 w-6 h-6" />
            {notificationData?.some((n) => !n.isRead) && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Main Content */}
      {!showNotification && (
        <>
          {/* Profile Card */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden cursor-pointer">
                <img
                  src={userData?.profileImage || dp}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-gray-100 font-semibold text-sm">
                  {userData?.userName}
                </p>
                <p className="text-gray-400 text-sm">{userData?.name}</p>
              </div>
            </div>

            <button
              onClick={handleLogOut}
              className="text-blue-500 text-sm font-semibold hover:text-blue-400"
            >
              Log out
            </button>
          </div>

          {/* Suggested Users */}
          <div className="px-5 py-5 flex flex-col gap-4">
            <h2 className="text-gray-400 text-sm font-semibold">
              Suggested for you
            </h2>

            {suggestedUsers?.slice(0, 3).map((user, index) => (
              <OtherUser key={index} user={user} />
            ))}
          </div>
        </>
      )}

      {/* 🔹 Notifications Panel */}
      {showNotification && <Notifications />}
    </aside>
  );
}

export default LeftHome;

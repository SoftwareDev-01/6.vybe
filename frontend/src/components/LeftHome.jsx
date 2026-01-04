import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa6";

import logo from "../assets/logo.png";
import dp from "../assets/dp.webp";

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
    <aside className="hidden lg:flex flex-col w-full h-full bg-[#0f0f0f] border-r border-gray-800">

      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-30 bg-[#0f0f0f]/95 backdrop-blur border-b border-gray-800">
        <div className="flex items-center justify-between px-5 py-4">
          <img src={logo} alt="logo" className="w-[90px]" />

          <button
            className="relative"
            onClick={() => setShowNotification((prev) => !prev)}
          >
            <FaRegHeart className="text-gray-100 w-6 h-6 hover:scale-110 transition" />
            {notificationData?.some((n) => !n.isRead) && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 overflow-y-auto">
        {!showNotification ? (
          <>
            {/* PROFILE */}
            <div className="px-5 py-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden">
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
                    <p className="text-gray-400 text-xs">
                      {userData?.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogOut}
                  className="text-blue-500 text-xs font-semibold hover:text-blue-400"
                >
                  Log out
                </button>
              </div>
            </div>

            {/* SUGGESTED */}
            <div className="px-5 py-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-400 text-sm font-semibold">
                  Suggested for you
                </h2>
                <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer">
                  See all
                </span>
              </div>

              {suggestedUsers?.length > 0 ? (
                suggestedUsers.slice(0, 5).map((user, index) => (
                  <OtherUser key={index} user={user} />
                ))
              ) : (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-gray-800" />
                    <div className="flex-1 space-y-2">
                      <div className="w-24 h-3 bg-gray-800 rounded" />
                      <div className="w-16 h-3 bg-gray-700 rounded" />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER */}
            <div className="mt-auto px-5 py-6">
              <p className="text-[11px] text-gray-500 leading-relaxed">
                About · Help · Press · API · Jobs · Privacy · Terms
                <br />
                © 2026 Vybe
              </p>
            </div>
          </>
        ) : (
          <Notifications />
        )}
      </div>
    </aside>
  );
}

export default LeftHome;

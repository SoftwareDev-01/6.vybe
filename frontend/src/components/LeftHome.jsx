import React, { memo, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa6";

import logo from "../assets/logo.png";
import dp from "../assets/dp.webp";

import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import OtherUser from "./OtherUser";
import Notifications from "../pages/Notifications";

function LeftHome() {
  const dispatch = useDispatch();
  const [showNotification, setShowNotification] = useState(false);

  /**
   * 🔹 Optimized selector
   * Prevents re-render unless these values actually change
   */
  const { userData, suggestedUsers, notificationData } = useSelector(
    (state) => ({
      userData: state.user.userData,
      suggestedUsers: state.user.suggestedUsers,
      notificationData: state.user.notificationData,
    }),
    shallowEqual
  );

  /**
   * 🔹 Memoized unread check
   */
  const hasUnreadNotifications = useMemo(() => {
    return notificationData?.some((n) => !n.isRead);
  }, [notificationData]);

  /**
   * 🔹 Stable handlers
   */
  const toggleNotifications = useCallback(() => {
    setShowNotification((prev) => !prev);
  }, []);

  const handleLogOut = useCallback(async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }
  }, [dispatch]);

  /**
   * 🔹 Memoized suggested users slice
   */
  const topSuggestedUsers = useMemo(() => {
    return suggestedUsers?.slice(0, 5) || [];
  }, [suggestedUsers]);

  return (
    <aside className="hidden lg:flex flex-col w-[320px] h-screen bg-black/80 backdrop-blur-xl border-r border-white/10">

      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-30 bg-black/70 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-5 py-4">
          <img
            src={logo}
            alt="logo"
            className="w-[90px] select-none"
            loading="lazy"
          />

          <button
            className="relative group"
            onClick={toggleNotifications}
          >
            <FaRegHeart className="w-6 h-6 text-gray-200 transition group-hover:scale-110" />
            {hasUnreadNotifications && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {!showNotification ? (
          <>
            {/* PROFILE */}
            <div className="px-5 py-5 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/10">
                    <img
                      src={userData?.profileImage || dp}
                      alt="profile"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <p className="text-gray-100 font-semibold text-sm leading-tight">
                      {userData?.userName}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {userData?.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogOut}
                  className="text-blue-500 text-xs font-semibold hover:text-blue-400 transition"
                >
                  Log out
                </button>
              </div>
            </div>

            {/* SUGGESTED USERS */}
            <div className="px-5 py-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-400 text-sm font-semibold">
                  Suggested for you
                </h2>
                <span className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer transition">
                  See all
                </span>
              </div>

              {topSuggestedUsers.length > 0 ? (
                topSuggestedUsers.map((user) => (
                  <OtherUser key={user._id} user={user} />
                ))
              ) : (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 animate-pulse"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="w-24 h-3 bg-white/10 rounded" />
                      <div className="w-16 h-3 bg-white/5 rounded" />
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

export default memo(LeftHome);

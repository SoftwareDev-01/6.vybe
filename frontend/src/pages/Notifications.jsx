import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import NotificationCard from "../components/NotificationCard";
import { serverUrl } from "../App";
import { setNotificationData } from "../redux/userSlice";

function Notifications() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notificationData } = useSelector((state) => state.user);

  /* 🔹 Extract unread ids safely */
  const unreadIds = useMemo(
    () => notificationData.filter((n) => !n.isRead).map((n) => n._id),
    [notificationData]
  );

  /* 🔹 Mark notifications as read */
  const markAsRead = async () => {
    if (unreadIds.length === 0) return;

    try {
      await axios.post(
        `${serverUrl}/api/user/markAsRead`,
        { notificationId: unreadIds },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  /* 🔹 Fetch notifications */
  const fetchNotifications = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getAllNotifications`,
        { withCredentials: true }
      );
      dispatch(setNotificationData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  /* 🔹 Initial load */
  useEffect(() => {
    fetchNotifications();
  }, []);

  /* 🔹 Mark read after load */
  useEffect(() => {
    markAsRead();
  }, [unreadIds]);

  return (
    <div className="w-full h-full bg-black flex flex-col">

      {/* 🔹 Sticky Header */}
      <div
        className="
          sticky top-0 z-30
          h-[64px]
          flex items-center gap-4
          px-4
          bg-black/80 backdrop-blur
          border-b border-gray-800
        "
      >
        <MdOutlineKeyboardBackspace
          className="text-white w-6 h-6 cursor-pointer lg:hidden"
          onClick={() => navigate(-1)}
        />

        <h1 className="text-white text-base font-semibold">
          Notifications
        </h1>
      </div>

      {/* 🔹 Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">

        {notificationData.length === 0 && (
          <div className="text-gray-400 text-center mt-20 text-sm">
            No notifications yet
          </div>
        )}

        {notificationData.map((noti) => (
          <NotificationCard key={noti._id} noti={noti} />
        ))}
      </div>
    </div>
  );
}

export default Notifications;

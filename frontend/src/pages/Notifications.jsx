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
    () => notificationData.filter(n => !n.isRead).map(n => n._id),
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
    <div className="w-full h-screen bg-black overflow-auto">
      {/* Header */}
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden">
        <MdOutlineKeyboardBackspace
          className="text-white cursor-pointer w-[25px] h-[25px]"
          onClick={() => navigate("/")}
        />
        <h1 className="text-white text-[20px] font-semibold">
          Notifications
        </h1>
      </div>

      {/* Content */}
      <div className="w-full flex flex-col gap-[16px] px-[12px] pb-[20px]">
        {notificationData.length === 0 && (
          <div className="text-gray-400 text-center mt-[40px]">
            No notifications yet
          </div>
        )}

        {notificationData.map((noti) => (
          <NotificationCard noti={noti} key={noti._id} />
        ))}
      </div>
    </div>
  );
}

export default Notifications;

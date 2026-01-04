import React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/messageSlice";
import dp from "../assets/dp.webp";

function Messages() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useSelector((s) => s.user);
  const { onlineUsers } = useSelector((s) => s.socket);
  const { prevChatUsers, messages } = useSelector((s) => s.message);

  /* 🔹 Helper: get last message of a user */
  const getLastMessage = (userId) =>
    [...messages]
      .reverse()
      .find(
        (m) =>
          m.sender === userId || m.receiver === userId
      );

  /* 🔹 Helper: unread count */
  const getUnreadCount = (userId) =>
    messages.filter(
      (m) =>
        m.sender === userId &&
        m.receiver === userData._id &&
        m.status !== "seen"
    ).length;

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="h-[56px] flex items-center gap-4 px-4 border-b border-gray-800">
        <MdOutlineKeyboardBackspace
          className="text-white w-6 h-6 cursor-pointer lg:hidden"
          onClick={() => navigate("/")}
        />
        <h1 className="text-white text-base font-semibold">
          Messages
        </h1>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {prevChatUsers?.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
            No conversations yet
          </p>
        )}

        {prevChatUsers?.map((user) => {
          const isOnline = onlineUsers?.includes(user._id);
          const lastMessage = getLastMessage(user._id);
          const unreadCount = getUnreadCount(user._id);

          return (
            <div
              key={user._id}
              onClick={() => {
                dispatch(setSelectedUser(user));
                navigate("/messageArea");
              }}
              className="
                flex items-center gap-3
                px-4 py-3
                cursor-pointer
                hover:bg-[#121212]
                transition
              "
            >
              {/* Avatar */}
              <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={user.profileImage || dp}
                  alt="user"
                  className="w-full h-full object-cover"
                />

                {/* Online dot */}
                {isOnline && (
                  <span className="
                    absolute bottom-0 right-0
                    w-3 h-3 rounded-full
                    bg-green-500
                    border-2 border-black
                  " />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white font-medium truncate">
                    {user.userName}
                  </span>

                  {lastMessage && (
                    <span className="text-[11px] text-gray-500">
                      {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 truncate max-w-[200px]">
                    {lastMessage?.image
                      ? "📷 Photo"
                      : lastMessage?.message || "Say hi 👋"}
                  </span>

                  {unreadCount > 0 && (
                    <span className="
                      min-w-[18px] h-[18px]
                      text-[11px]
                      bg-blue-500
                      text-white
                      rounded-full
                      flex items-center justify-center
                    ">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Messages;

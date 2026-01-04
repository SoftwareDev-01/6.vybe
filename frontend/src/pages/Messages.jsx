import React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OnlineUser from "../components/OnlineUser";
import { setSelectedUser } from "../redux/messageSlice";
import dp from "../assets/dp.webp";

function Messages() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userData } = useSelector((s) => s.user);
  const { onlineUsers } = useSelector((s) => s.socket);
  const { prevChatUsers } = useSelector((s) => s.message);

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

      {/* Online users */}
      <div className="px-4 py-3 border-b border-gray-800">
        <p className="text-xs text-gray-400 mb-2">
          Active now
        </p>
        <div className="flex gap-3 overflow-x-auto">
          {userData.following?.map(
            (user) =>
              onlineUsers?.includes(user._id) && (
                <OnlineUser key={user._id} user={user} />
              )
          )}
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {prevChatUsers?.map((user) => {
          const isOnline = onlineUsers?.includes(user._id);

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
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={user.profileImage || dp}
                  alt="user"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col leading-tight">
                <span className="text-sm text-white font-medium">
                  {user.userName}
                </span>
                {isOnline ? (
                  <span className="text-xs text-blue-500">
                    Active now
                  </span>
                ) : (
                  <span className="text-xs text-gray-500">
                    Offline
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Messages;

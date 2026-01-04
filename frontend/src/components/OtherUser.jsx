import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import FollowButton from "./FollowButton";

function OtherUser({ user }) {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <div
      className="
        w-full flex items-center justify-between
        py-3
        border-b border-gray-800
      "
    >
      {/* Left: Avatar + Info */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate(`/profile/${user.userName}`)}
      >
        <div className="w-11 h-11 rounded-full overflow-hidden">
          <img
            src={user.profileImage || dp}
            alt="user"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-sm text-white font-semibold">
            {user.userName}
          </span>
          <span className="text-xs text-gray-400">
            {user.name}
          </span>
        </div>
      </div>

      {/* Right: Follow Button */}
      {userData?._id !== user._id && (
        <FollowButton targetUserId={user._id} />
      )}
    </div>
  );
}

export default OtherUser;

import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { toggleFollow } from "../redux/userSlice";

function FollowButton({ targetUserId, tailwind = "", onFollowChange }) {
  const { following } = useSelector((state) => state.user);
  const isFollowing = following.includes(targetUserId);
  const dispatch = useDispatch();

  const handleFollow = async () => {
    try {
      await axios.get(
        `${serverUrl}/api/user/follow/${targetUserId}`,
        { withCredentials: true }
      );

      if (onFollowChange) onFollowChange();
      dispatch(toggleFollow(targetUserId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleFollow}
      className={`
        px-4 py-1.5 text-sm font-semibold rounded-full transition
        ${
          isFollowing
            ? "bg-transparent border border-gray-600 text-gray-200 hover:bg-gray-800"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }
        active:scale-95
        ${tailwind}
      `}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

export default FollowButton;

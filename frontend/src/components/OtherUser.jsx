import React, { memo, useCallback } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import FollowButton from "./FollowButton";

function OtherUser({ user }) {
  const navigate = useNavigate();

  /**
   * 🔹 Optimized selector
   * Only re-renders when current user changes
   */
  const currentUserId = useSelector(
    (state) => state.user.userData?._id,
    shallowEqual
  );

  /**
   * 🔹 Stable handler
   */
  const goToProfile = useCallback(() => {
    if (user?.userName) {
      navigate(`/profile/${user.userName}`);
    }
  }, [navigate, user]);

  const showFollowButton = currentUserId !== user?._id;

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
        className="flex items-center gap-3 cursor-pointer min-w-0"
        onClick={goToProfile}
      >
        <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={user?.profileImage || dp}
            alt="user"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-sm text-white font-semibold truncate">
            {user?.userName}
          </span>
          <span className="text-xs text-gray-400 truncate">
            {user?.name}
          </span>
        </div>
      </div>

      {/* Right: Follow Button */}
      {showFollowButton && (
        <FollowButton targetUserId={user._id} />
      )}
    </div>
  );
}

export default memo(OtherUser);

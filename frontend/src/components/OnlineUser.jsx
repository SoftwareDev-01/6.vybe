import React, { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../redux/messageSlice";
import dp from "../assets/dp.webp";

function OnlineUser({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * 🔹 Stable click handler
   * Prevents re-render cascades in lists
   */
  const handleClick = useCallback(() => {
    if (!user) return;
    dispatch(setSelectedUser(user));
    navigate("/messageArea");
  }, [dispatch, navigate, user]);

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer group flex-shrink-0"
    >
      {/* Avatar */}
      <div
        className="
          w-12 h-12 rounded-full overflow-hidden
          ring-2 ring-gray-700
          group-hover:ring-white
          transition
        "
      >
        <img
          src={user?.profileImage || dp}
          alt="user"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Online Indicator */}
      <span
        className="
          absolute bottom-0 right-0
          w-3 h-3 bg-green-500
          rounded-full
          border-2 border-[#0f0f0f]
        "
      />
    </div>
  );
}

export default memo(OnlineUser);

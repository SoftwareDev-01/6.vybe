import React, { memo, useCallback } from "react";
import { GoHomeFill } from "react-icons/go";
import { FiSearch, FiPlusSquare } from "react-icons/fi";
import { RxVideo } from "react-icons/rx";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

function Nav() {
  const navigate = useNavigate();

  /**
   * 🔹 Optimized selector
   * Only re-renders when userData changes
   */
  const userData = useSelector(
    (state) => state.user.userData,
    shallowEqual
  );

  /**
   * 🔹 Stable handlers
   */
  const goHome = useCallback(() => navigate("/"), [navigate]);
  const goSearch = useCallback(() => navigate("/search"), [navigate]);
  const goUpload = useCallback(() => navigate("/upload"), [navigate]);
  const goLoops = useCallback(() => navigate("/loops"), [navigate]);
  const goProfile = useCallback(() => {
    if (userData?.userName) {
      navigate(`/profile/${userData.userName}`);
    }
  }, [navigate, userData]);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <div
        className="
          flex items-center justify-between gap-8
          px-8 py-3
          bg-[#0f0f0f]/90 backdrop-blur
          border border-gray-800
          rounded-full shadow-xl
        "
      >
        {/* Home */}
        <button onClick={goHome} aria-label="Home">
          <GoHomeFill className="w-6 h-6 text-white hover:scale-110 transition" />
        </button>

        {/* Search */}
        <button onClick={goSearch} aria-label="Search">
          <FiSearch className="w-6 h-6 text-white hover:scale-110 transition" />
        </button>

        {/* Upload */}
        <button onClick={goUpload} aria-label="Upload">
          <FiPlusSquare className="w-7 h-7 text-white hover:scale-110 transition" />
        </button>

        {/* Loops */}
        <button onClick={goLoops} aria-label="Loops">
          <RxVideo className="w-7 h-7 text-white hover:scale-110 transition" />
        </button>

        {/* Profile */}
        <button onClick={goProfile} aria-label="Profile">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-700 hover:ring-white transition">
            <img
              src={userData?.profileImage || dp}
              alt="profile"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      </div>
    </div>
  );
}

export default memo(Nav);

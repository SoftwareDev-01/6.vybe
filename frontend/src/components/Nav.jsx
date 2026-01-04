import React from "react";
import { GoHomeFill } from "react-icons/go";
import { FiSearch, FiPlusSquare } from "react-icons/fi";
import { RxVideo } from "react-icons/rx";
import dp from "../assets/dp.webp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Nav() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

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
        <button onClick={() => navigate("/")}>
          <GoHomeFill className="w-6 h-6 text-white hover:scale-110 transition" />
        </button>

        {/* Search */}
        <button onClick={() => navigate("/search")}>
          <FiSearch className="w-6 h-6 text-white hover:scale-110 transition" />
        </button>

        {/* Upload */}
        <button onClick={() => navigate("/upload")}>
          <FiPlusSquare className="w-7 h-7 text-white hover:scale-110 transition" />
        </button>

        {/* Reels / Loops */}
        <button onClick={() => navigate("/loops")}>
          <RxVideo className="w-7 h-7 text-white hover:scale-110 transition" />
        </button>

        {/* Profile */}
        <button onClick={() => navigate(`/profile/${userData.userName}`)}>
          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-700 hover:ring-white transition">
            <img
              src={userData.profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      </div>
    </div>
  );
}

export default Nav;

import React, { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import dp from "../assets/dp.webp";
import { serverUrl } from "../App";

function StoryDp({ ProfileImage, userName, story }) {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { storyData, storyList } = useSelector((state) => state.story);
  const [viewed, setViewed] = useState(false);

  useEffect(() => {
    if (
      story?.viewers?.some(
        (v) =>
          v?._id?.toString() === userData?._id?.toString() ||
          v?.toString() === userData?._id?.toString()
      )
    ) {
      setViewed(true);
    } else {
      setViewed(false);
    }
  }, [story, userData, storyData, storyList]);

  const handleViewers = async () => {
    try {
      await axios.get(
        `${serverUrl}/api/story/view/${story._id}`,
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    if (!story && userName === "Your Story") {
      navigate("/upload");
    } else if (story && userName === "Your Story") {
      handleViewers();
      navigate(`/story/${userData?.userName}`);
    } else {
      handleViewers();
      navigate(`/story/${userName}`);
    }
  };

  return (
    <div className="flex flex-col items-center w-[78px] cursor-pointer group">
      {/* 🔹 Story Ring */}
      <div
        onClick={handleClick}
        className={`
          w-[78px] h-[78px] rounded-full p-[2px]
          ${
            !story
              ? "bg-transparent"
              : !viewed
              ? "bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]"
              : "bg-gray-700"
          }
          group-hover:scale-105 transition
        `}
      >
        <div className="w-full h-full rounded-full bg-black flex items-center justify-center relative">
          <div className="w-[66px] h-[66px] rounded-full overflow-hidden border border-black">
            <img
              src={ProfileImage || dp}
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* ➕ Add Story */}
          {!story && userName === "Your Story" && (
            <FiPlusCircle
              className="
                absolute bottom-0 right-0
                w-6 h-6
                text-blue-500
                bg-white rounded-full
              "
            />
          )}
        </div>
      </div>

      {/* 🔹 Username */}
      <span className="mt-1 text-xs text-white truncate max-w-[78px] text-center">
        {userName}
      </span>
    </div>
  );
}

export default StoryDp;

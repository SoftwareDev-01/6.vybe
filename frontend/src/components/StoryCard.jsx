import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FaEye } from "react-icons/fa6";

import dp from "../assets/dp.webp";
import VideoPlayer from "./VideoPlayer";

function StoryCard({ storyData }) {
  const { userData } = useSelector((state) => state.user);
  const [showViewers, setShowViewers] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/");
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex justify-center">
      <div className="relative w-full max-w-[430px] h-full bg-black">

        {/* 🔹 Progress Bar */}
        <div className="absolute top-2 left-2 right-2 h-[3px] bg-white/20 rounded-full overflow-hidden z-30">
          <div
            className="h-full bg-white transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 🔹 Header */}
        <div className="absolute top-5 left-4 right-4 flex items-center gap-3 z-30">
          <MdOutlineKeyboardBackspace
            className="text-white w-6 h-6 cursor-pointer"
            onClick={() => navigate("/")}
          />

          <img
            src={storyData?.author?.profileImage || dp}
            className="w-9 h-9 rounded-full object-cover"
          />

          <span className="text-white text-sm font-semibold truncate">
            {storyData?.author?.userName}
          </span>
        </div>

        {/* 🔹 Story Media */}
        {!showViewers && (
          <div className="w-full h-full flex items-center justify-center">
            {storyData?.mediaType === "image" && (
              <img
                src={storyData?.media}
                className="w-full h-full object-cover"
              />
            )}

            {storyData?.mediaType === "video" && (
              <VideoPlayer media={storyData?.media} />
            )}
          </div>
        )}

        {/* 🔹 Viewers Preview (Owner Only) */}
        {!showViewers &&
          storyData?.author?.userName === userData?.userName && (
            <div
              onClick={() => setShowViewers(true)}
              className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-sm cursor-pointer z-30"
            >
              <FaEye />
              <span>{storyData?.viewers?.length}</span>
            </div>
          )}

        {/* 🔹 Viewers Bottom Sheet */}
        {showViewers && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur z-40 flex flex-col">
            {/* Preview */}
            <div
              className="h-[35%] flex items-center justify-center cursor-pointer"
              onClick={() => setShowViewers(false)}
            >
              {storyData?.mediaType === "image" && (
                <img
                  src={storyData?.media}
                  className="h-full rounded-xl object-cover"
                />
              )}
              {storyData?.mediaType === "video" && (
                <VideoPlayer media={storyData?.media} />
              )}
            </div>

            {/* Viewer List */}
            <div className="flex-1 bg-[#0f0f0f] rounded-t-3xl px-5 py-4 overflow-y-auto">
              <div className="flex items-center gap-2 text-white mb-4">
                <FaEye />
                <span className="font-semibold">
                  {storyData?.viewers?.length} viewers
                </span>
              </div>

              <div className="space-y-3">
                {storyData?.viewers?.map((viewer, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={viewer?.profileImage || dp}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span className="text-white text-sm font-medium truncate">
                      {viewer?.userName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryCard;

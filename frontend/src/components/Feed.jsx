import React from "react";
import logo from "../assets/logo.png";
import { FaRegHeart } from "react-icons/fa6";
import { BiMessageAltDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import StoryDp from "./StoryDp";
import Nav from "./Nav";
import Post from "./Post";

function Feed() {
  const { postData } = useSelector((state) => state.post);
  const { userData, notificationData } = useSelector((state) => state.user);
  const { storyList, currentUserStory } = useSelector((state) => state.story);
  const navigate = useNavigate();

  return (
    // 🔥 FULL WIDTH – CENTER AREA CONTROLS WIDTH
    <main className="w-full min-h-screen bg-[#0f0f0f]">

      {/* 🔹 Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-20 bg-[#0f0f0f] border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <img src={logo} alt="logo" className="w-[90px]" />

          <div className="flex items-center gap-5">
            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/notifications")}
            >
              <FaRegHeart className="text-gray-100 w-6 h-6" />
              {notificationData?.some((n) => !n.isRead) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full" />
              )}
            </div>

            <BiMessageAltDetail
              className="text-gray-100 w-6 h-6 cursor-pointer"
              onClick={() => navigate("/messages")}
            />
          </div>
        </div>
      </div>

      {/* 🔹 STORIES */}
      <div className="w-full overflow-x-auto flex items-center gap-4 px-4 py-4 border-b border-gray-800">
        <StoryDp
          userName="Your Story"
          ProfileImage={userData?.profileImage}
          story={currentUserStory}
        />

        {storyList?.map((story, index) => (
          <StoryDp
            key={index}
            userName={story.author.userName}
            ProfileImage={story.author.profileImage}
            story={story}
          />
        ))}
      </div>

      {/* 🔹 POSTS */}
      <div className="flex flex-col gap-6 px-3 py-6 pb-28">
        <Nav />

        {postData?.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </div>
    </main>
  );
}

export default Feed;

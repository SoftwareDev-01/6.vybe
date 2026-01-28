import React, { memo, useCallback } from "react";
import logo from "../assets/logo.png";
import { FaRegHeart } from "react-icons/fa6";
import { BiMessageAltDetail } from "react-icons/bi";
import { useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";

import StoryDp from "./StoryDp";
import Nav from "./Nav";
import Post from "./Post";

/**
 * 🔹 Memoized Post component to avoid re-rendering
 * when unrelated state updates (VERY IMPORTANT)
 */
const MemoPost = memo(Post);

function Feed() {
  const navigate = useNavigate();

  /**
   * 🔹 Optimized selectors
   * shallowEqual prevents unnecessary re-renders
   */
  const { postData } = useSelector(
    (state) => state.post,
    shallowEqual
  );

  const { userData, notificationData } = useSelector(
    (state) => state.user,
    shallowEqual
  );

  const { storyList, currentUserStory } = useSelector(
    (state) => state.story,
    shallowEqual
  );

  /**
   * 🔹 Safe fallback (prevents crashes & rework)
   */
  const posts = Array.isArray(postData) ? postData : [];

  /**
   * 🔹 Memoized handlers (small but important)
   */
  const goToNotifications = useCallback(() => {
    navigate("/notifications");
  }, [navigate]);

  const goToMessages = useCallback(() => {
    navigate("/messages");
  }, [navigate]);

  const hasUnreadNotifications = notificationData?.some(
    (n) => !n.isRead
  );

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#090909] text-white">

      {/* 🔹 MOBILE TOP BAR */}
      <div className="lg:hidden sticky top-0 z-30 backdrop-blur-xl bg-black/70 border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <img
            src={logo}
            alt="logo"
            className="w-[90px] select-none"
            loading="lazy"
          />

          <div className="flex items-center gap-6">
            <div
              className="relative cursor-pointer"
              onClick={goToNotifications}
            >
              <FaRegHeart className="w-6 h-6 text-white" />
              {hasUnreadNotifications && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
              )}
            </div>

            <BiMessageAltDetail
              className="w-6 h-6 cursor-pointer text-white"
              onClick={goToMessages}
            />
          </div>
        </div>
      </div>

      {/* 🔹 MAIN CONTAINER */}
      <div className="max-w-[680px] mx-auto">

        {/* 🔹 STORIES */}
        <section className="w-full overflow-x-auto scrollbar-hide flex gap-4 px-4 py-5 border-b border-white/10 snap-x snap-mandatory">
          <StoryDp
            userName="Your Story"
            ProfileImage={userData?.profileImage}
            story={currentUserStory}
          />

          {storyList?.map((story) => (
            <div key={story._id} className="snap-start">
              <StoryDp
                userName={story.author.userName}
                ProfileImage={story.author.profileImage}
                story={story}
              />
            </div>
          ))}
        </section>

        {/* 🔹 FEED */}
        <section className="flex flex-col gap-7 px-3 py-6 pb-32 sm:px-0">
          <Nav />

          {posts.length === 0 ? (
            <p className="text-gray-400 text-center mt-16 text-sm">
              No posts yet. Start following people ✨
            </p>
          ) : (
            posts.map((post) => (
              <MemoPost key={post._id} post={post} />
            ))
          )}
        </section>
      </div>
    </main>
  );
}

export default memo(Feed);

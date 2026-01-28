import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import axios from "axios";

import dp from "../assets/dp.webp";
import { serverUrl } from "../App";

function StoryDp({ ProfileImage, userName, story }) {
  const navigate = useNavigate();

  /**
   * 🔹 Optimized selector
   * Only re-renders when user id changes
   */
  const currentUserId = useSelector(
    (state) => state.user.userData?._id,
    shallowEqual
  );

  const [viewed, setViewed] = useState(false);

  /**
   * 🔹 Derived viewer check (FAST + SAFE)
   */
  const hasViewed = useMemo(() => {
    if (!story?.viewers || !currentUserId) return false;

    return story.viewers.some(
      (v) =>
        v?._id?.toString() === currentUserId.toString() ||
        v?.toString() === currentUserId.toString()
    );
  }, [story?.viewers, currentUserId]);

  /**
   * 🔹 Sync local state only when it truly changes
   */
  useEffect(() => {
    setViewed(hasViewed);
  }, [hasViewed]);

  /**
   * 🔹 API call (isolated)
   */
  const markViewed = useCallback(async () => {
    if (!story?._id) return;

    try {
      await axios.get(
        `${serverUrl}/api/story/view/${story._id}`,
        { withCredentials: true }
      );
    } catch (err) {
      console.error("STORY VIEW ERROR:", err);
    }
  }, [story?._id]);

  /**
   * 🔹 Click handler
   */
  const handleClick = useCallback(async () => {
    // ➕ Add story
    if (!story && userName === "Your Story") {
      navigate("/upload");
      return;
    }

    // 👁 View story
    if (story) {
      await markViewed();

      if (userName === "Your Story") {
        navigate(`/story/${currentUserId}`);
      } else {
        navigate(`/story/${userName}`);
      }
    }
  }, [story, userName, navigate, markViewed, currentUserId]);

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
              loading="lazy"
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

export default memo(StoryDp);

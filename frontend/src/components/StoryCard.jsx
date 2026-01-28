import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FaEye } from "react-icons/fa6";

import dp from "../assets/dp.webp";
import VideoPlayer from "./VideoPlayer";

const STORY_DURATION = 15000; // 15s (Instagram-like)

function StoryCard({ storyData }) {
  const navigate = useNavigate();
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  const [showViewers, setShowViewers] = useState(false);

  /**
   * 🔹 Optimized selector
   */
  const currentUserName = useSelector(
    (state) => state.user.userData?.userName,
    shallowEqual
  );

  /**
   * 🔹 Derived values
   */
  const isOwner = storyData?.author?.userName === currentUserName;

  const viewers = useMemo(
    () => storyData?.viewers || [],
    [storyData?.viewers]
  );

  /**
   * 🔹 Smooth progress using requestAnimationFrame
   * (NO React state updates every tick)
   */
  useEffect(() => {
    startTimeRef.current = performance.now();

    const animate = (time) => {
      const elapsed = time - startTimeRef.current;
      const percent = Math.min((elapsed / STORY_DURATION) * 100, 100);

      if (progressRef.current) {
        progressRef.current.style.width = `${percent}%`;
      }

      if (percent >= 100) {
        navigate("/");
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [navigate]);

  /**
   * 🔹 Handlers
   */
  const goBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const openViewers = useCallback(() => {
    setShowViewers(true);
  }, []);

  const closeViewers = useCallback(() => {
    setShowViewers(false);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex justify-center">
      <div className="relative w-full max-w-[430px] h-full bg-black">

        {/* 🔹 Progress Bar */}
        <div className="absolute top-2 left-2 right-2 h-[3px] bg-white/20 rounded-full overflow-hidden z-30">
          <div
            ref={progressRef}
            className="h-full bg-white"
            style={{ width: "0%" }}
          />
        </div>

        {/* 🔹 Header */}
        <div className="absolute top-5 left-4 right-4 flex items-center gap-3 z-30">
          <MdOutlineKeyboardBackspace
            className="text-white w-6 h-6 cursor-pointer"
            onClick={goBack}
          />

          <img
            src={storyData?.author?.profileImage || dp}
            loading="lazy"
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
                loading="lazy"
                className="w-full h-full object-cover"
              />
            )}

            {storyData?.mediaType === "video" && (
              <VideoPlayer media={storyData?.media} />
            )}
          </div>
        )}

        {/* 🔹 Viewers Preview (Owner only) */}
        {!showViewers && isOwner && (
          <div
            onClick={openViewers}
            className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-sm cursor-pointer z-30"
          >
            <FaEye />
            <span>{viewers.length}</span>
          </div>
        )}

        {/* 🔹 Viewers Sheet */}
        {showViewers && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur z-40 flex flex-col">
            {/* Preview */}
            <div
              className="h-[35%] flex items-center justify-center cursor-pointer"
              onClick={closeViewers}
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
                  {viewers.length} viewers
                </span>
              </div>

              <div className="space-y-3">
                {viewers.map((viewer) => (
                  <div
                    key={viewer._id}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={viewer?.profileImage || dp}
                      loading="lazy"
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

export default memo(StoryCard);

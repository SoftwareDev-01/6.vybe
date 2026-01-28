import React, { memo, useMemo } from "react";
import dp from "../assets/dp.webp";

function NotificationCard({ noti }) {
  /**
   * 🔹 Memoized media preview
   * Prevents recalculation on every render
   */
  const previewMedia = useMemo(() => {
    if (noti?.loop?.media) {
      return (
        <video
          src={noti.loop.media}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
      );
    }

    if (noti?.post?.mediaType === "image") {
      return (
        <img
          src={noti.post.media}
          alt="post"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      );
    }

    if (noti?.post?.media) {
      return (
        <video
          src={noti.post.media}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
      );
    }

    return null;
  }, [noti]);

  return (
    <div
      className="
        w-full flex items-center justify-between
        px-4 py-3
        bg-[#0f0f0f]
        border border-gray-800
        rounded-xl
        hover:bg-[#161616]
        transition
      "
    >
      {/* 🔹 LEFT: Sender info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={noti?.sender?.profileImage || dp}
            alt="sender"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col min-w-0">
          <p className="text-sm text-white font-semibold truncate">
            {noti?.sender?.userName}
          </p>
          <p className="text-sm text-gray-400 line-clamp-1">
            {noti?.message}
          </p>
        </div>
      </div>

      {/* 🔹 RIGHT: Media preview */}
      {previewMedia && (
        <div className="w-11 h-11 rounded-lg overflow-hidden bg-black flex-shrink-0">
          {previewMedia}
        </div>
      )}
    </div>
  );
}

export default memo(NotificationCard);

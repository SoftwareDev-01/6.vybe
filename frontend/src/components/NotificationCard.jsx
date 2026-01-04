import React from "react";
import dp from "../assets/dp.webp";

function NotificationCard({ noti }) {
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
      {/* 🔹 Left: Sender info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={noti.sender.profileImage || dp}
            alt="sender"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-sm text-white font-semibold">
            {noti.sender.userName}
          </p>
          <p className="text-sm text-gray-400 line-clamp-1">
            {noti.message}
          </p>
        </div>
      </div>

      {/* 🔹 Right: Post / Loop Preview */}
      <div className="w-11 h-11 rounded-lg overflow-hidden bg-black flex-shrink-0">
        {noti.loop ? (
          <video
            src={noti.loop.media}
            muted
            className="w-full h-full object-cover"
          />
        ) : noti.post?.mediaType === "image" ? (
          <img
            src={noti.post.media}
            alt="post"
            className="w-full h-full object-cover"
          />
        ) : noti.post ? (
          <video
            src={noti.post.media}
            muted
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>
    </div>
  );
}

export default NotificationCard;

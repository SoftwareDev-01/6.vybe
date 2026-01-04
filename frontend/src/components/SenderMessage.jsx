import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";

function SenderMessage({ message, onDelete }) {
  const { userData } = useSelector((state) => state.user);
  const scrollRef = useRef(null);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message.message, message.image, message.isDeleted]);

  /* 🗑 Deleted for everyone */
  if (message.isDeleted) {
    return (
      <div className="flex justify-end max-w-[75%] ml-auto">
        <p className="text-xs italic text-gray-400">
          You deleted this message
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex justify-end items-end gap-2 max-w-[75%] ml-auto"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Delete Button */}
      {showActions && onDelete && (
        <button
          onClick={() => onDelete(message._id, "everyone")}
          className="text-gray-400 hover:text-red-400 transition"
        >
          <MdDelete size={16} />
        </button>
      )}

      {/* Bubble */}
      <div
        className="
          bg-gradient-to-br from-[#7c3aed] to-[#2563eb]
          text-white
          px-4 py-2
          rounded-2xl rounded-br-md
          shadow-sm
          flex flex-col gap-1
          max-w-full
        "
      >
        {message.image && (
          <img
            src={message.image}
            alt="sent"
            className="max-h-[220px] rounded-xl object-cover"
          />
        )}

        {message.message && (
          <p className="text-sm leading-relaxed break-words">
            {message.message}
          </p>
        )}

        {/* Timestamp + Status */}
        <div className="flex justify-end gap-2 text-[10px] text-white/80 mt-1">
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <span>
            {message.status === "seen"
              ? "Seen"
              : message.status === "delivered"
              ? "Delivered"
              : "Sent"}
          </span>
        </div>
      </div>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={userData.profileImage}
          alt="me"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default SenderMessage;

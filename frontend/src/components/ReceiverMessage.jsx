import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";

function ReceiverMessage({ message, onDelete }) {
  const { selectedUser } = useSelector((state) => state.message);
  const scrollRef = useRef(null);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message.message, message.image, message.isDeleted]);

  /* 🗑 Deleted for everyone */
  if (message.isDeleted) {
    return (
      <div className="flex justify-start max-w-[75%]">
        <p className="text-xs italic text-gray-400">
          This message was deleted
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex items-end gap-2 max-w-[75%]"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={selectedUser.profileImage}
          alt="user"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bubble */}
      <div
        className="
          relative
          bg-[#1f2933]
          text-white
          px-4 py-2
          rounded-2xl rounded-bl-md
          shadow-sm
          flex flex-col gap-1
          max-w-full
        "
      >
        {message.image && (
          <img
            src={message.image}
            alt="message"
            className="max-h-[220px] rounded-xl object-cover"
          />
        )}

        {message.message && (
          <p className="text-sm leading-relaxed break-words">
            {message.message}
          </p>
        )}

        {/* Timestamp */}
        <div className="text-[10px] text-gray-400 text-right mt-1">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {/* Delete for me */}
        {showActions && onDelete && (
          <button
            onClick={() => onDelete(message._id, "me")}
            className="
              absolute -right-7 top-2
              text-gray-400 hover:text-red-400
              transition
            "
          >
            <MdDelete size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ReceiverMessage;

import React, {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useSelector, shallowEqual } from "react-redux";
import dp from "../assets/dp.webp";
import { MdDelete } from "react-icons/md";

function ReceiverMessage({ message, onDelete }) {
  const scrollRef = useRef(null);
  const [showActions, setShowActions] = useState(false);

  /**
   * 🔹 Optimized selectors
   */
  const selectedUserImage = useSelector(
    (state) => state.message.selectedUser?.profileImage,
    shallowEqual
  );

  const currentUserId = useSelector(
    (state) => state.user.userData?._id,
    shallowEqual
  );

  /**
   * 🔹 Scroll into view only when message actually changes
   */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message._id, message.message, message.image, message.isDeleted]);

  /**
   * 🔹 Derived states
   */
  const isDeletedForMe = useMemo(() => {
    return message.deletedFor?.includes(currentUserId);
  }, [message.deletedFor, currentUserId]);

  const isDeletedForEveryone = message.isDeleted;

  /**
   * 🟡 DELETE FOR ME — HARD STOP
   */
  if (isDeletedForMe) return null;

  /**
   * 🔴 DELETE FOR EVERYONE
   */
  if (isDeletedForEveryone) {
    return (
      <div
        ref={scrollRef}
        className="flex justify-start max-w-[75%]"
      >
        <p className="text-xs italic text-gray-400">
          This message was deleted
        </p>
      </div>
    );
  }

  /**
   * 🔹 Stable handlers
   */
  const showDelete = useCallback(() => {
    setShowActions(true);
  }, []);

  const hideDelete = useCallback(() => {
    setShowActions(false);
  }, []);

  const handleDeleteForMe = useCallback(() => {
    onDelete?.(message._id, "me");
  }, [onDelete, message._id]);

  return (
    <div
      ref={scrollRef}
      className="flex items-end gap-2 max-w-[75%]"
      onMouseEnter={showDelete}
      onMouseLeave={hideDelete}
    >
      {/* 👤 Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={selectedUserImage || dp}
          alt="user"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 💬 Message Bubble */}
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
            loading="lazy"
            className="max-h-[220px] rounded-xl object-cover"
          />
        )}

        {message.message && (
          <p className="text-sm leading-relaxed break-words">
            {message.message}
          </p>
        )}

        {/* ⏱ Timestamp */}
        <div className="text-[10px] text-gray-400 text-right mt-1">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {/* 🗑 Delete for me */}
        {showActions && (
          <button
            onClick={handleDeleteForMe}
            className="
              absolute -right-7 top-2
              text-gray-400 hover:text-red-400
              transition
            "
            title="Delete for me"
          >
            <MdDelete size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(ReceiverMessage);

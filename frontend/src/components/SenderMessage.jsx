import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector, shallowEqual } from "react-redux";
import dp from "../assets/dp.webp";
import { MdDelete } from "react-icons/md";

function SenderMessage({ message, onDelete }) {
  const scrollRef = useRef(null);
  const [showActions, setShowActions] = useState(false);

  /**
   * 🔹 Optimized selector
   * Only re-renders when user id or avatar changes
   */
  const currentUser = useSelector(
    (state) => ({
      id: state.user.userData?._id,
      profileImage: state.user.userData?.profileImage,
    }),
    shallowEqual
  );

  /**
   * 🔹 Scroll only when content actually changes
   */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message._id, message.message, message.image, message.isDeleted]);

  /**
   * 🔹 Derived delete states
   */
  const isDeletedForMe = useMemo(() => {
    return message.deletedFor?.includes(currentUser.id);
  }, [message.deletedFor, currentUser.id]);

  const isDeletedForEveryone = message.isDeleted;

  /* 🟡 DELETE FOR ME — HARD STOP */
  if (isDeletedForMe) return null;

  /* 🔴 DELETE FOR EVERYONE */
  if (isDeletedForEveryone) {
    return (
      <div
        ref={scrollRef}
        className="flex justify-end max-w-[75%] ml-auto"
      >
        <p className="text-xs italic text-gray-400">
          You deleted this message
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

  const handleDeleteForEveryone = useCallback(() => {
    onDelete?.(message._id, "everyone");
  }, [onDelete, message._id]);

  /**
   * 🔹 Memoized status label
   */
  const statusLabel = useMemo(() => {
    switch (message.status) {
      case "seen":
        return "Seen";
      case "delivered":
        return "Delivered";
      default:
        return "Sent";
    }
  }, [message.status]);

  return (
    <div
      ref={scrollRef}
      className="flex justify-end items-end gap-2 max-w-[75%] ml-auto"
      onMouseEnter={showDelete}
      onMouseLeave={hideDelete}
    >
      {/* 🗑 Delete for everyone */}
      {showActions && (
        <button
          onClick={handleDeleteForEveryone}
          className="text-gray-400 hover:text-red-400 transition"
          title="Delete for everyone"
        >
          <MdDelete size={16} />
        </button>
      )}

      {/* 💬 Message Bubble */}
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
            loading="lazy"
            className="max-h-[220px] rounded-xl object-cover"
          />
        )}

        {message.message && (
          <p className="text-sm leading-relaxed break-words">
            {message.message}
          </p>
        )}

        {/* ⏱ Timestamp + Status */}
        <div className="flex justify-end gap-2 text-[10px] text-white/80 mt-1">
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span>{statusLabel}</span>
        </div>
      </div>

      {/* 👤 Avatar */}
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={currentUser.profileImage || dp}
          alt="me"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default memo(SenderMessage);

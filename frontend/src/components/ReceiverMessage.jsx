import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function ReceiverMessage({ message }) {
  const { selectedUser } = useSelector((state) => state.message);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message.message, message.image]);

  return (
    <div ref={scrollRef} className="flex items-end gap-2 max-w-[75%]">
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
          bg-[#1f2933]
          text-white
          px-4 py-2
          rounded-2xl rounded-bl-md
          shadow-sm
          flex flex-col gap-2
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
      </div>
    </div>
  );
}

export default ReceiverMessage;

import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function SenderMessage({ message }) {
  const { userData } = useSelector((state) => state.user);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message.message, message.image]);

  return (
    <div ref={scrollRef} className="flex justify-end items-end gap-2 max-w-[75%] ml-auto">
      {/* Bubble */}
      <div
        className="
          bg-gradient-to-br from-[#7c3aed] to-[#2563eb]
          text-white
          px-4 py-2
          rounded-2xl rounded-br-md
          shadow-sm
          flex flex-col gap-2
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

import React from "react";
import Messages from "../pages/Messages";

function RightHome() {
  return (
    <aside
      className="
        hidden lg:flex
        flex-col
        w-full
        h-full
        bg-[#0f0f0f]
        border-l border-gray-800
      "
    >
      {/* Messages scroll internally */}
      <div className="flex-1 overflow-y-auto">
        <Messages />
      </div>
    </aside>
  );
}

export default RightHome;

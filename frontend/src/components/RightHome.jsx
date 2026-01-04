import React from "react";
import Messages from "../pages/Messages";

function RightHome() {
  return (
    <aside
      className="
        hidden lg:block
        w-[25%] h-screen
        bg-[#0f0f0f]
        border-l border-gray-800
        sticky top-0
      "
    >
      <Messages />
    </aside>
  );
}

export default RightHome;

import React from "react";
import LeftHome from "../components/LeftHome";
import Feed from "../components/Feed";
import RightHome from "../components/RightHome";

const SIDEBAR_WIDTH = 320; // px (Instagram-like)

function Home() {
  return (
    <div className="relative w-full min-h-screen bg-black">

      {/* ================= LEFT ================= */}
      <div
        className="fixed top-0 left-0 h-screen z-40 border-r border-gray-800"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <LeftHome />
      </div>

      {/* ================= RIGHT ================= */}
      <div
        className="fixed top-0 right-0 h-screen z-40 border-l border-gray-800"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <RightHome />
      </div>

      {/* ================= CENTER (FILL EXACTLY) ================= */}
      <div
        className="min-h-screen"
        style={{
          marginLeft: SIDEBAR_WIDTH,
          marginRight: SIDEBAR_WIDTH,
          width: `calc(100% - ${SIDEBAR_WIDTH * 2}px)`,
        }}
      >
        <Feed />
      </div>

    </div>
  );
}

export default Home;

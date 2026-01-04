import React from "react";
import LeftHome from "../components/LeftHome";
import Feed from "../components/Feed";
import RightHome from "../components/RightHome";

function Home() {
  return (
    <div className="w-full min-h-screen bg-black flex justify-center">
      {/* Main container */}
      <div className="w-full max-w-[1400px] flex">
        {/* Left Sidebar */}
        <LeftHome />

        {/* Center Feed */}
        <div className="flex-1 flex justify-center">
          <Feed />
        </div>

        {/* Right Sidebar */}
        <RightHome />
      </div>
    </div>
  );
}

export default Home;

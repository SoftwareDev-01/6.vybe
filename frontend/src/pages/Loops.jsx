import React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoopCard from "../components/LoopCard";

function Loops() {
  const navigate = useNavigate();
  const { loopData } = useSelector((state) => state.loop);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex justify-center">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full h-[64px] flex items-center gap-4 px-5 z-50 bg-black/70 backdrop-blur">
        <MdOutlineKeyboardBackspace
          className="text-white w-6 h-6 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <h1 className="text-white text-lg font-semibold">Loops</h1>
      </div>

      {/* Reels Container */}
      <div className="w-full max-w-[500px] h-full pt-[64px] overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {loopData.map((loop, index) => (
          <div key={loop._id || index} className="h-screen snap-start flex justify-center">
            <LoopCard loop={loop} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Loops;

import React, { useEffect, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineComment } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import dp from "../assets/dp.webp";
import FollowButton from "./FollowButton";
import { serverUrl } from "../App";
import { setLoopData } from "../redux/loopSlice";

function LoopCard({ loop }) {
  const videoRef = useRef();
  const commentRef = useRef();

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const { userData } = useSelector((s) => s.user);
  const { socket } = useSelector((s) => s.socket);
  const { loopData } = useSelector((s) => s.loop);

  /* ================= VIDEO ================= */

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleLikeOnDoubleClick = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
    if (!loop.likes.includes(userData._id)) handleLike();
  };

  /* ================= API ================= */

  const handleLike = async () => {
    const res = await axios.get(
      `${serverUrl}/api/loop/like/${loop._id}`,
      { withCredentials: true }
    );
    dispatch(
      setLoopData(loopData.map((l) => (l._id === loop._id ? res.data : l)))
    );
  };

  const handleComment = async () => {
    const res = await axios.post(
      `${serverUrl}/api/loop/comment/${loop._id}`,
      { message },
      { withCredentials: true }
    );
    dispatch(
      setLoopData(loopData.map((l) => (l._id === loop._id ? res.data : l)))
    );
    setMessage("");
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    socket?.on("likedLoop", (data) => {
      dispatch(
        setLoopData(
          loopData.map((l) =>
            l._id === data.loopId ? { ...l, likes: data.likes } : l
          )
        )
      );
    });

    socket?.on("commentedLoop", (data) => {
      dispatch(
        setLoopData(
          loopData.map((l) =>
            l._id === data.loopId ? { ...l, comments: data.comments } : l
          )
        )
      );
    });

    return () => {
      socket?.off("likedLoop");
      socket?.off("commentedLoop");
    };
  }, [socket, loopData]);

  /* ================= UI ================= */

  return (
    <div className="relative w-full lg:w-[420px] h-screen bg-black overflow-hidden">

      {/* ❤️ DOUBLE TAP HEART */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center z-50 heart-animation">
          <GoHeartFill className="w-28 h-28 text-white drop-shadow-2xl" />
        </div>
      )}

      {/* 🎥 VIDEO */}
      <video
        ref={videoRef}
        src={loop.media}
        muted={isMute}
        autoPlay
        loop
        onClick={handleClick}
        onDoubleClick={handleLikeOnDoubleClick}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover"
      />

      {/* 🔊 VOLUME */}
      <button
        onClick={() => setIsMute((p) => !p)}
        className="absolute top-5 right-5 z-20 bg-black/40 p-2 rounded-full"
      >
        {!isMute ? (
          <FiVolume2 className="text-white w-5 h-5" />
        ) : (
          <FiVolumeX className="text-white w-5 h-5" />
        )}
      </button>

      {/* ⏱ PROGRESS */}
      <div className="absolute bottom-0 w-full h-[2px] bg-white/20">
        <div
          className="h-full bg-white transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 👤 USER + CAPTION */}
      <div className="absolute bottom-5 left-4 right-16 text-white space-y-2">
        <div className="flex items-center gap-2">
          <img
            src={loop.author?.profileImage || dp}
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="font-semibold text-sm truncate">
            {loop.author?.userName}
          </span>
          <FollowButton targetUserId={loop.author?._id} />
        </div>
        <p className="text-sm line-clamp-2">{loop.caption}</p>
      </div>

      {/* ❤️ ACTIONS */}
      <div className="absolute right-4 bottom-28 flex flex-col items-center gap-6 text-white">
        <button onClick={handleLike} className="flex flex-col items-center">
          {loop.likes.includes(userData._id) ? (
            <GoHeartFill className="w-7 h-7 text-red-500" />
          ) : (
            <GoHeart className="w-7 h-7" />
          )}
          <span className="text-xs">{loop.likes.length}</span>
        </button>

        <button
          onClick={() => setShowComment(true)}
          className="flex flex-col items-center"
        >
          <MdOutlineComment className="w-7 h-7" />
          <span className="text-xs">{loop.comments.length}</span>
        </button>
      </div>

      {/* 💬 COMMENTS SHEET */}
      <div
        ref={commentRef}
        className={`absolute inset-x-0 bottom-0 h-[70%] bg-[#0f0f0f] rounded-t-3xl
        transform transition-transform duration-300 z-40
        ${showComment ? "translate-y-0" : "translate-y-full"}`}
      >
        <h3 className="text-center text-white font-semibold py-3">
          Comments
        </h3>

        <div className="px-4 space-y-4 overflow-y-auto h-[calc(100%-120px)]">
          {loop.comments.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              No comments yet
            </p>
          )}

          {loop.comments.map((c, i) => (
            <div key={i}>
              <p className="text-sm font-semibold text-white">
                {c.author?.userName}
              </p>
              <p className="text-sm text-gray-300">{c.message}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-800">
          <img
            src={userData.profileImage || dp}
            className="w-9 h-9 rounded-full"
          />
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent outline-none text-white text-sm"
          />
          {message && (
            <IoSendSharp
              onClick={handleComment}
              className="text-blue-500 w-5 h-5 cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default LoopCard;

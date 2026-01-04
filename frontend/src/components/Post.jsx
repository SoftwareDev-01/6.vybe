import React, { useEffect, useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineComment, MdOutlineBookmarkBorder } from "react-icons/md";
import { GoBookmarkFill } from "react-icons/go";
import { IoSendSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import dp from "../assets/dp.webp";
import VideoPlayer from "./VideoPlayer";
import FollowButton from "./FollowButton";
import { serverUrl } from "../App";
import { setPostData } from "../redux/postSlice";
import { setUserData } from "../redux/userSlice";

function Post({ post }) {
  const { userData } = useSelector((s) => s.user);
  const { postData } = useSelector((s) => s.post);
  const { socket } = useSelector((s) => s.socket);

  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= API ================= */

  const handleLike = async () => {
    const res = await axios.get(
      `${serverUrl}/api/post/like/${post._id}`,
      { withCredentials: true }
    );
    dispatch(
      setPostData(postData.map((p) => (p._id === post._id ? res.data : p)))
    );
  };

  const handleComment = async () => {
    const res = await axios.post(
      `${serverUrl}/api/post/comment/${post._id}`,
      { message },
      { withCredentials: true }
    );
    dispatch(
      setPostData(postData.map((p) => (p._id === post._id ? res.data : p)))
    );
    setMessage("");
  };

  const handleSaved = async () => {
    const res = await axios.get(
      `${serverUrl}/api/post/saved/${post._id}`,
      { withCredentials: true }
    );
    dispatch(setUserData(res.data));
  };

  /* ================= SOCKET ================= */

  useEffect(() => {
    socket?.on("likedPost", (data) => {
      dispatch(
        setPostData(
          postData.map((p) =>
            p._id === data.postId ? { ...p, likes: data.likes } : p
          )
        )
      );
    });

    socket?.on("commentedPost", (data) => {
      dispatch(
        setPostData(
          postData.map((p) =>
            p._id === data.postId ? { ...p, comments: data.comments } : p
          )
        )
      );
    });

    return () => {
      socket?.off("likedPost");
      socket?.off("commentedPost");
    };
  }, [socket, postData, dispatch]);

  /* ================= UI ================= */

  return (
    <div className="w-full max-w-[470px] mx-auto bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/profile/${post.author.userName}`)}
        >
          <img
            src={post.author.profileImage || dp}
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-sm font-semibold text-white">
            {post.author.userName}
          </span>
        </div>

        {userData._id !== post.author._id && (
          <FollowButton targetUserId={post.author._id} />
        )}
      </div>

      {/* 🔹 Media */}
      <div className="w-full bg-black">
        {post.mediaType === "image" && (
          <img
            src={post.media}
            className="w-full max-h-[600px] object-cover"
          />
        )}

        {post.mediaType === "video" && (
          <VideoPlayer media={post.media} />
        )}
      </div>

      {/* 🔹 Actions */}
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <div className="flex items-center gap-4">
          <button onClick={handleLike}>
            {post.likes.includes(userData._id) ? (
              <GoHeartFill className="w-6 h-6 text-red-500" />
            ) : (
              <GoHeart className="w-6 h-6" />
            )}
          </button>

          <button onClick={() => setShowComment((p) => !p)}>
            <MdOutlineComment className="w-6 h-6" />
          </button>
        </div>

        <button onClick={handleSaved}>
          {userData.saved.includes(post._id) ? (
            <GoBookmarkFill className="w-6 h-6" />
          ) : (
            <MdOutlineBookmarkBorder className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* 🔹 Likes */}
      <div className="px-4 text-sm text-white font-semibold">
        {post.likes.length} likes
      </div>

      {/* 🔹 Caption */}
      {post.caption && (
        <div className="px-4 py-2 text-sm text-gray-200">
          <span className="font-semibold mr-2">
            {post.author.userName}
          </span>
          {post.caption}
        </div>
      )}

      {/* 🔹 Comments */}
      {showComment && (
        <div className="px-4 py-3 border-t border-gray-800">
          <div className="space-y-3 max-h-[200px] overflow-y-auto">
            {post.comments.map((c, i) => (
              <p key={i} className="text-sm text-gray-300">
                <span className="font-semibold text-white mr-2">
                  {c.author.userName}
                </span>
                {c.message}
              </p>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <img
              src={userData.profileImage || dp}
              className="w-8 h-8 rounded-full"
            />
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-sm text-white outline-none"
            />
            {message && (
              <IoSendSharp
                onClick={handleComment}
                className="text-blue-500 w-5 h-5 cursor-pointer"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;

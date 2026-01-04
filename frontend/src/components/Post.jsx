import React, { useEffect, useRef, useState } from "react";
import {
  GoHeart,
  GoHeartFill,
  GoBookmarkFill,
} from "react-icons/go";
import {
  MdOutlineComment,
  MdOutlineBookmarkBorder,
  MdDeleteOutline,
} from "react-icons/md";
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
  const { socket } = useSelector((s) => s.socket);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= SAFE USER ================= */
  const safeUser = {
    _id: userData?._id || "",
    userName: userData?.userName || "user",
    profileImage: userData?.profileImage || dp,
    saved: Array.isArray(userData?.saved) ? userData.saved : [],
  };

  /* ================= SAFE POST ================= */
  const safePost = {
    ...post,
    likes: Array.isArray(post?.likes) ? post.likes : [],
    comments: Array.isArray(post?.comments) ? post.comments : [],
    author: {
      _id: post?.author?._id || "",
      userName: post?.author?.userName || "user",
      profileImage: post?.author?.profileImage || dp,
    },
  };

  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const isLiked = safePost.likes.includes(safeUser._id);
  const isSaved = safeUser.saved.includes(safePost._id);

  /* ================= LIKE (BACKEND SOURCE OF TRUTH) ================= */

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/post/like/${safePost._id}`,
        {},
        { withCredentials: true }
      );

      dispatch(
        setPostData((prev) =>
          prev.map((p) => (p._id === safePost._id ? res.data : p))
        )
      );
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  /* ================= ADD COMMENT (NO FAKE ID) ================= */

  const handleComment = async () => {
    if (!message.trim()) return;

    try {
      const res = await axios.post(
        `${serverUrl}/api/post/comment/${safePost._id}`,
        { message },
        { withCredentials: true }
      );

      dispatch(
        setPostData((prev) =>
          prev.map((p) => (p._id === safePost._id ? res.data : p))
        )
      );

      setMessage("");
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  /* ================= DELETE COMMENT (BACKEND RESPONSE) ================= */

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(
        `${serverUrl}/api/post/comment/${safePost._id}/${commentId}`,
        { withCredentials: true }
      );

      dispatch(
        setPostData((prev) =>
          prev.map((p) =>
            p._id === safePost._id
              ? { ...p, comments: res.data }
              : p
          )
        )
      );
    } catch (err) {
      console.error("Delete comment failed", err);
    }
  };

  /* ================= SAVE ================= */

  const handleSaved = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/post/save/${safePost._id}`,
        {},
        { withCredentials: true }
      );
      dispatch(setUserData(res.data));
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ================= SOCKET (REAL-TIME SYNC) ================= */

  useEffect(() => {
    if (!socket) return;

    socket.on("likedPost", (data) => {
      dispatch(
        setPostData((prev) =>
          prev.map((p) =>
            p._id === data.postId ? { ...p, likes: data.likes } : p
          )
        )
      );
    });

    socket.on("commentedPost", (data) => {
      dispatch(
        setPostData((prev) =>
          prev.map((p) =>
            p._id === data.postId
              ? { ...p, comments: data.comments }
              : p
          )
        )
      );
    });

    return () => {
      socket.off("likedPost");
      socket.off("commentedPost");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (showComment) inputRef.current?.focus();
  }, [showComment]);

  /* ================= UI ================= */

  return (
    <article className="w-full bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(`/profile/${safePost.author.userName}`)}
        >
          <img
            src={safePost.author.profileImage}
            className="w-9 h-9 rounded-full"
          />
          <span className="text-sm font-semibold text-white">
            {safePost.author.userName}
          </span>
        </div>

        {safeUser._id !== safePost.author._id && (
          <FollowButton targetUserId={safePost.author._id} />
        )}
      </div>

      {/* MEDIA */}
      <div className="relative aspect-[4/5] bg-black">
        {safePost.mediaType === "image" && (
          <img src={safePost.media} className="w-full h-full object-cover" />
        )}
        {safePost.mediaType === "video" && (
          <VideoPlayer media={safePost.media} />
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between px-4 py-3 text-white">
        <div className="flex gap-4">
          <button onClick={handleLike}>
            {isLiked ? (
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
          {isSaved ? (
            <GoBookmarkFill className="w-6 h-6" />
          ) : (
            <MdOutlineBookmarkBorder className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* LIKES */}
      <div className="px-4 text-sm font-semibold text-white">
        {safePost.likes.length} likes
      </div>

      {/* COMMENTS */}
      {showComment && (
        <div className="border-t border-gray-800">
          <div className="max-h-48 overflow-y-auto px-4 py-3 space-y-2">
            {safePost.comments.map((c) => (
              <div
                key={c._id}
                className="flex justify-between text-sm text-gray-200"
              >
                <div>
                  <span className="font-semibold mr-1">
                    {c.author?.userName}
                  </span>
                  {c.message}
                </div>

                {c.author?._id === safeUser._id && (
                  <MdDeleteOutline
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => handleDeleteComment(c._id)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-800">
            <img
              src={safeUser.profileImage}
              className="w-8 h-8 rounded-full"
            />
            <input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a comment…"
              className="flex-1 bg-transparent text-sm text-white outline-none"
            />
            {message && (
              <button
                onClick={handleComment}
                className="text-blue-500 font-semibold"
              >
                Post
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default Post;

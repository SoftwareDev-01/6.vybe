import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import dp from "../assets/dp.webp";
import VideoPlayer from "./VideoPlayer";
import FollowButton from "./FollowButton";
import { serverUrl } from "../App";
import { setPostData } from "../redux/postSlice";
import { setUserData } from "../redux/userSlice";

function Post({ post }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  /**
   * 🔹 Optimized selectors
   */
  const { userData } = useSelector(
    (s) => ({ userData: s.user.userData }),
    shallowEqual
  );

  const { socket } = useSelector((s) => s.socket);

  /* ================= SAFE DATA ================= */

  const safeUser = useMemo(
    () => ({
      _id: userData?._id || "",
      userName: userData?.userName || "user",
      profileImage: userData?.profileImage || dp,
      saved: Array.isArray(userData?.saved) ? userData.saved : [],
    }),
    [userData]
  );

  const safePost = useMemo(
    () => ({
      ...post,
      likes: Array.isArray(post?.likes) ? post.likes : [],
      comments: Array.isArray(post?.comments) ? post.comments : [],
      author: {
        _id: post?.author?._id || "",
        userName: post?.author?.userName || "user",
        profileImage: post?.author?.profileImage || dp,
      },
    }),
    [post]
  );

  /* ================= STATE ================= */

  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");

  const isLiked = safePost.likes.includes(safeUser._id);
  const isSaved = safeUser.saved.includes(safePost._id);

  /* ================= HELPERS ================= */

  const updatePostInStore = useCallback(
    (updatedPost) => {
      dispatch(
        setPostData((prev) =>
          prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
        )
      );
    },
    [dispatch]
  );

  /* ================= API ================= */

  const handleLike = useCallback(async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/post/like/${safePost._id}`,
        {},
        { withCredentials: true }
      );
      updatePostInStore(res.data);
    } catch (err) {
      console.error("LIKE ERROR:", err);
    }
  }, [safePost._id, updatePostInStore]);

  const handleComment = useCallback(async () => {
    if (!message.trim()) return;

    try {
      const res = await axios.post(
        `${serverUrl}/api/post/comment/${safePost._id}`,
        { message },
        { withCredentials: true }
      );
      updatePostInStore(res.data);
      setMessage("");
    } catch (err) {
      console.error("COMMENT ERROR:", err);
    }
  }, [message, safePost._id, updatePostInStore]);

  const handleDeleteComment = useCallback(
    async (commentId) => {
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
        console.error("DELETE COMMENT ERROR:", err);
      }
    },
    [dispatch, safePost._id]
  );

  const handleSaved = useCallback(async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/post/save/${safePost._id}`,
        {},
        { withCredentials: true }
      );
      dispatch(setUserData(res.data));
    } catch (err) {
      console.error("SAVE ERROR:", err);
    }
  }, [dispatch, safePost._id]);

  /* ================= SOCKET (REGISTER ONCE) ================= */

  useEffect(() => {
    if (!socket) return;

    const onLike = (data) => {
      dispatch(
        setPostData((prev) =>
          prev.map((p) =>
            p._id === data.postId ? { ...p, likes: data.likes } : p
          )
        )
      );
    };

    const onComment = (data) => {
      dispatch(
        setPostData((prev) =>
          prev.map((p) =>
            p._id === data.postId
              ? { ...p, comments: data.comments }
              : p
          )
        )
      );
    };

    socket.on("likedPost", onLike);
    socket.on("commentedPost", onComment);

    return () => {
      socket.off("likedPost", onLike);
      socket.off("commentedPost", onComment);
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
            loading="lazy"
            className="w-9 h-9 rounded-full object-cover"
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
          <img
            src={safePost.media}
            loading="lazy"
            className="w-full h-full object-cover"
          />
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
                    onClick={() => handleDeleteComment(c._id)}
                    className="cursor-pointer hover:text-red-500"
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

export default memo(Post);

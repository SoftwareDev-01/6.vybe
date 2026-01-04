import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

import { serverUrl } from "../App";
import { setProfileData, setUserData } from "../redux/userSlice";
import { setSelectedUser } from "../redux/messageSlice";

import dp from "../assets/dp.webp";
import FollowButton from "../components/FollowButton";
import ProfilePostGrid from "../components/ProfilePostGrid";
import Post from "../components/Post";

function Profile() {
  const { userName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { profileData, userData } = useSelector((s) => s.user);
  const { postData } = useSelector((s) => s.post);

  const [postType, setPostType] = useState("posts");
  const [activePost, setActivePost] = useState(null); // 🔥 MODAL STATE

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/user/getProfile/${userName}`,
        { withCredentials: true }
      );
      dispatch(setProfileData(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userName]);

  if (!profileData || !userData) return null;

  const isOwnProfile = profileData._id === userData._id;

  /* ================= SAFE FILTERS ================= */

  const userPosts = postData.filter(
    (p) =>
      p.author === profileData._id ||
      p.author?._id === profileData._id
  );

  const savedPosts = postData.filter((p) =>
    userData.saved.includes(p._id)
  );

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <div className="h-[56px] flex items-center justify-between px-4 border-b border-gray-800">
        <MdOutlineKeyboardBackspace
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate(-1)}
        />

        <span className="text-sm font-semibold">
          {profileData.userName}
        </span>

        {isOwnProfile && (
          <span
            className="text-sm text-blue-500 cursor-pointer"
            onClick={handleLogout}
          >
            Log out
          </span>
        )}
      </div>

      {/* PROFILE INFO */}
      <div className="px-4 py-4">
        <div className="flex gap-4">
          <div className="w-[86px] h-[86px] rounded-full overflow-hidden">
            <img
              src={profileData.profileImage || dp}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between text-center">
              <div>
                <p className="text-sm font-semibold">
                  {profileData.posts.length}
                </p>
                <p className="text-xs text-gray-400">Posts</p>
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {profileData.followers.length}
                </p>
                <p className="text-xs text-gray-400">Followers</p>
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {profileData.following.length}
                </p>
                <p className="text-xs text-gray-400">Following</p>
              </div>
            </div>

            <div className="mt-3 text-sm">
              <p className="font-medium">{profileData.name}</p>
              {profileData.profession && (
                <p className="text-xs text-gray-400">
                  {profileData.profession}
                </p>
              )}
              {profileData.bio && (
                <p className="mt-1 leading-snug">
                  {profileData.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 mt-4">
          {isOwnProfile ? (
            <button
              className="flex-1 h-8 rounded-md border border-gray-700 text-sm"
              onClick={() => navigate("/editprofile")}
            >
              Edit profile
            </button>
          ) : (
            <>
              <FollowButton
                tailwind="flex-1 h-8 rounded-md bg-white text-black text-sm"
                targetUserId={profileData._id}
                onFollowChange={fetchProfile}
              />
              <button
                className="flex-1 h-8 rounded-md border border-gray-700 text-sm"
                onClick={() => {
                  dispatch(setSelectedUser(profileData));
                  navigate("/messageArea");
                }}
              >
                Message
              </button>
            </>
          )}
        </div>
      </div>

      {/* TABS */}
      {isOwnProfile && (
        <div className="flex justify-around border-t border-gray-800 text-sm">
          <button
            className={`py-3 ${
              postType === "posts"
                ? "border-b-2 border-white font-semibold"
                : "text-gray-400"
            }`}
            onClick={() => setPostType("posts")}
          >
            Posts
          </button>
          <button
            className={`py-3 ${
              postType === "saved"
                ? "border-b-2 border-white font-semibold"
                : "text-gray-400"
            }`}
            onClick={() => setPostType("saved")}
          >
            Saved
          </button>
        </div>
      )}

      {/* GRID */}
      <div className="pb-20">
        {postType === "posts" && (
          <ProfilePostGrid
            posts={userPosts}
            onPostClick={(post) => setActivePost(post)}
          />
        )}

        {postType === "saved" && (
          <ProfilePostGrid
            posts={savedPosts}
            onPostClick={(post) => setActivePost(post)}
          />
        )}
      </div>

      {/* ================= MODAL ================= */}
      {activePost && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setActivePost(null)}
        >
          {/* Stop click bubbling */}
          <div
            className="relative w-full max-w-[500px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Post post={activePost} />

            {/* Close Button */}
            <button
              className="absolute -top-10 right-0 text-white text-2xl"
              onClick={() => setActivePost(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

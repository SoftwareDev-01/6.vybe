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
  const [activePost, setActivePost] = useState(null);

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async () => {
    const res = await axios.get(
      `${serverUrl}/api/user/getProfile/${userName}`,
      { withCredentials: true }
    );
    dispatch(setProfileData(res.data));
  };

  const handleLogout = async () => {
    await axios.get(`${serverUrl}/api/auth/signout`, {
      withCredentials: true,
    });
    dispatch(setUserData(null));
  };

  useEffect(() => {
    fetchProfile();
  }, [userName]);

  /* ================= LOCK BODY SCROLL ================= */

  useEffect(() => {
    document.body.style.overflow = activePost ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [activePost]);

  if (!profileData || !userData) return null;

  const isOwnProfile = profileData._id === userData._id;

  const userPosts = postData.filter(
    (p) => p.author?._id === profileData._id
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

      {/* PROFILE */}
      <div className="px-4 py-4">
        <div className="flex gap-4">
          <img
            src={profileData.profileImage || dp}
            className="w-[86px] h-[86px] rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex justify-between text-center">
              <Stat label="Posts" value={profileData.posts.length} />
              <Stat label="Followers" value={profileData.followers.length} />
              <Stat label="Following" value={profileData.following.length} />
            </div>
            <div className="mt-3 text-sm">
              <p className="font-medium">{profileData.name}</p>
              {profileData.bio && <p className="mt-1">{profileData.bio}</p>}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {isOwnProfile ? (
            <button
              className="flex-1 h-8 border border-gray-700 rounded-md text-sm"
              onClick={() => navigate("/editprofile")}
            >
              Edit profile
            </button>
          ) : (
            <>
              <FollowButton
                tailwind="flex-1 h-8 bg-white text-black rounded-md text-sm"
                targetUserId={profileData._id}
                onFollowChange={fetchProfile}
              />
              <button
                className="flex-1 h-8 border border-gray-700 rounded-md text-sm"
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
          <Tab active={postType === "posts"} onClick={() => setPostType("posts")}>
            Posts
          </Tab>
          <Tab active={postType === "saved"} onClick={() => setPostType("saved")}>
            Saved
          </Tab>
        </div>
      )}

      {/* GRID */}
      <div className="pb-20">
        <ProfilePostGrid
          posts={postType === "posts" ? userPosts : savedPosts}
          onPostClick={setActivePost}
        />
      </div>

      {/* ================= MODERN MODAL ================= */}
      {activePost && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setActivePost(null)}
        >
          <div
            className="
              relative bg-black w-full max-w-[420px] max-h-[90vh]
              rounded-xl overflow-hidden
              animate-scaleIn
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrollable content */}
            <div className="h-full overflow-y-auto">
              <Post post={activePost} />
            </div>

            {/* Close */}
            <button
              className="absolute top-3 right-3 text-white text-xl"
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

/* ================= SMALL COMPONENTS ================= */

const Stat = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold">{value}</p>
    <p className="text-xs text-gray-400">{label}</p>
  </div>
);

const Tab = ({ active, children, ...props }) => (
  <button
    {...props}
    className={`py-3 ${active ? "border-b-2 border-white font-semibold" : "text-gray-400"}`}
  >
    {children}
  </button>
);

export default Profile;

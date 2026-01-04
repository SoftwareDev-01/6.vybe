import React, { useRef, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";

import dp from "../assets/dp.webp";
import { serverUrl } from "../App";
import { setProfileData, setUserData } from "../redux/userSlice";

function EditProfile() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const imageInput = useRef(null);

  const [frontendImage, setFrontendImage] = useState(
    userData.profileImage || dp
  );
  const [backendImage, setBackendImage] = useState(null);

  const [name, setName] = useState(userData.name || "");
  const [userName, setUserName] = useState(userData.userName || "");
  const [bio, setBio] = useState(userData.bio || "");
  const [profession, setProfession] = useState(userData.profession || "");
  const [gender, setGender] = useState(userData.gender || "");
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("userName", userName);
      formData.append("bio", bio);
      formData.append("profession", profession);
      formData.append("gender", gender);
      if (backendImage) {
        formData.append("profileImage", backendImage);
      }

      const res = await axios.post(
        `${serverUrl}/api/user/editProfile`,
        formData,
        { withCredentials: true }
      );

      dispatch(setProfileData(res.data));
      dispatch(setUserData(res.data));

      navigate(`/profile/${res.data.userName}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-[480px] px-5 pb-10">
        {/* Header */}
        <div className="flex items-center gap-4 h-[64px]">
          <MdOutlineKeyboardBackspace
            className="w-6 h-6 cursor-pointer"
            onClick={() => navigate(`/profile/${userData.userName}`)}
          />
          <h1 className="text-lg font-semibold">Edit Profile</h1>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-3 mt-6">
          <div
            className="w-24 h-24 rounded-full overflow-hidden cursor-pointer"
            onClick={() => imageInput.current.click()}
          >
            <img
              src={frontendImage}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <button
            className="text-blue-500 text-sm font-semibold"
            onClick={() => imageInput.current.click()}
          >
            Change profile photo
          </button>

          <input
            type="file"
            accept="image/*"
            hidden
            ref={imageInput}
            onChange={handleImage}
          />
        </div>

        {/* Form */}
        <div className="mt-8 space-y-4">
          <Input label="Name" value={name} onChange={setName} />
          <Input label="Username" value={userName} onChange={setUserName} />
          <Input label="Bio" value={bio} onChange={setBio} />
          <Input
            label="Profession"
            value={profession}
            onChange={setProfession}
          />
          <Input label="Gender" value={gender} onChange={setGender} />
        </div>

        {/* Save Button */}
        <button
          onClick={handleEditProfile}
          disabled={loading}
          className="
            w-full mt-8 h-11
            bg-white text-black
            rounded-lg font-semibold
            flex items-center justify-center
            disabled:opacity-70
          "
        >
          {loading ? <ClipLoader size={22} color="black" /> : "Save"}
        </button>
      </div>
    </div>
  );
}

/* 🔹 Reusable Input */
function Input({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-400">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-11 px-3
          bg-[#0f0f0f]
          border border-gray-700
          rounded-md
          text-white text-sm
          outline-none
          focus:border-gray-400
        "
      />
    </div>
  );
}

export default EditProfile;

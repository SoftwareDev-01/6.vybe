import React, { useRef, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FiPlusSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";

import VideoPlayer from "../components/VideoPlayer";
import { serverUrl } from "../App";
import { setPostData } from "../redux/postSlice";
import { setCurrentUserStory } from "../redux/storySlice";
import { setLoopData } from "../redux/loopSlice";

function Upload() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { postData } = useSelector((s) => s.post);
  const { loopData } = useSelector((s) => s.loop);

  const [uploadType, setUploadType] = useState("post");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const mediaInput = useRef(null);

  /* ================= MEDIA PICK ================= */

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaType(file.type.includes("image") ? "image" : "video");
    setBackendMedia(file);
    setFrontendMedia(URL.createObjectURL(file));
  };

  /* ================= UPLOAD ================= */

  const uploadPost = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("mediaType", mediaType);
    formData.append("media", backendMedia);

    const res = await axios.post(
      `${serverUrl}/api/post/upload`,
      formData,
      { withCredentials: true }
    );

    dispatch(setPostData([...postData, res.data]));
  };

  const uploadStory = async () => {
    const formData = new FormData();
    formData.append("mediaType", mediaType);
    formData.append("media", backendMedia);

    const res = await axios.post(
      `${serverUrl}/api/story/upload`,
      formData,
      { withCredentials: true }
    );

    dispatch(setCurrentUserStory(res.data));
  };

  const uploadLoop = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("media", backendMedia);

    const res = await axios.post(
      `${serverUrl}/api/loop/upload`,
      formData,
      { withCredentials: true }
    );

    dispatch(setLoopData([...loopData, res.data]));
  };

  const handleUpload = async () => {
    if (!backendMedia) return;

    setLoading(true);
    try {
      if (uploadType === "post") await uploadPost();
      else if (uploadType === "story") await uploadStory();
      else await uploadLoop();

      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="h-[56px] flex items-center gap-4 px-4 border-b border-gray-800">
        <MdOutlineKeyboardBackspace
          className="w-6 h-6 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <span className="text-sm font-semibold">Create new</span>
      </div>

      {/* Type selector */}
      <div className="flex justify-center gap-6 text-sm border-b border-gray-800">
        {["post", "story", "loop"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setUploadType(type);
              setFrontendMedia(null);
              setBackendMedia(null);
              setCaption("");
            }}
            className={`py-3 capitalize ${
              uploadType === type
                ? "border-b-2 border-white font-semibold"
                : "text-gray-400"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Upload area */}
      {!frontendMedia ? (
        <div
          className="flex flex-col items-center justify-center mt-24 cursor-pointer"
          onClick={() => mediaInput.current.click()}
        >
          <input
            ref={mediaInput}
            type="file"
            hidden
            accept={uploadType === "loop" ? "video/*" : ""}
            onChange={handleMedia}
          />
          <FiPlusSquare className="w-10 h-10 text-gray-400" />
          <p className="text-sm mt-2 text-gray-400">
            Select {uploadType}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10 px-4">
          {/* Preview */}
          <div className="w-full max-w-[400px]">
            {mediaType === "image" ? (
              <img
                src={frontendMedia}
                className="w-full rounded-md"
              />
            ) : (
              <VideoPlayer media={frontendMedia} />
            )}
          </div>

          {/* Caption */}
          {uploadType !== "story" && (
            <textarea
              placeholder="Write a caption…"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="
                w-full max-w-[400px] mt-4
                bg-transparent
                border-b border-gray-700
                text-sm
                outline-none
                resize-none
                placeholder-gray-500
              "
              rows={2}
            />
          )}

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className="
              w-full max-w-[400px] h-9 mt-6
              bg-blue-500
              rounded-sm
              text-sm font-semibold
              disabled:opacity-50
            "
          >
            {loading ? (
              <ClipLoader size={18} color="white" />
            ) : (
              `Share ${uploadType}`
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default Upload;

import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { serverUrl } from "../App";
import { setStoryData } from "../redux/storySlice";
import StoryCard from "../components/StoryCard";

function Story() {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const { storyData } = useSelector((state) => state.story);

  /* ================= FETCH STORY ================= */

  useEffect(() => {
    if (!userName) return;

    const fetchStory = async () => {
      dispatch(setStoryData(null)); // reset for clean transition
      try {
        const res = await axios.get(
          `${serverUrl}/api/story/getByUserName/${userName}`,
          { withCredentials: true }
        );
        dispatch(setStoryData(res.data[0]));
      } catch (error) {
        console.log(error);
      }
    };

    fetchStory();
  }, [userName, dispatch]);

  /* ================= UI ================= */

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center">
      {/* Story container */}
      <div className="w-full max-w-[420px] h-full flex justify-center items-center">
        {storyData && <StoryCard storyData={storyData} />}
      </div>
    </div>
  );
}

export default Story;

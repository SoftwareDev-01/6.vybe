import React, { useEffect, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

function VideoPlayer({ media }) {
  const videoRef = useRef(null);
  const [mute, setMute] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-black group">
      {/* 🎥 Video */}
      <video
        ref={videoRef}
        src={media}
        autoPlay
        loop
        muted={mute}
        onClick={handleClick}
        className="w-full h-full object-cover"
      />

      {/* ▶️ Play/Pause Feedback */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <span className="text-white text-sm font-semibold">
            Tap to play
          </span>
        </div>
      )}

      {/* 🔊 Volume Toggle */}
      <button
        onClick={() => setMute((prev) => !prev)}
        className="
          absolute bottom-3 right-3
          bg-black/50 backdrop-blur
          p-2 rounded-full
          text-white
          opacity-80 hover:opacity-100
          transition
        "
      >
        {!mute ? (
          <FiVolume2 className="w-5 h-5" />
        ) : (
          <FiVolumeX className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}

export default VideoPlayer;

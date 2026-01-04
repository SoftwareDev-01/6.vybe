import React, { useEffect, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

function VideoPlayer({ media }) {
  const videoRef = useRef(null);

  const [muted, setMuted] = useState(true);      // Instagram default
  const [isPlaying, setIsPlaying] = useState(false);
  const userPausedRef = useRef(false);           // 👈 prevents observer fight

  /* ================= USER INTERACTION ================= */

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
      userPausedRef.current = false;
    } else {
      video.pause();
      setIsPlaying(false);
      userPausedRef.current = true;
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation(); // 👈 don't trigger play/pause
    setMuted((prev) => !prev);
  };

  /* ================= VIEWPORT AUTOPLAY ================= */

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPausedRef.current) {
            video.play();
            setIsPlaying(true);
          }
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  /* ================= UI ================= */

  return (
    <div
      onClick={handleTogglePlay}
      className="
        relative w-full h-full
        bg-black overflow-hidden
        group cursor-pointer
      "
    >
      {/* 🎥 VIDEO */}
      <video
        ref={videoRef}
        src={media}
        loop
        muted={muted}
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ▶️ PLAY OVERLAY (Instagram style) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <span className="text-white text-sm font-semibold">
            Tap to play
          </span>
        </div>
      )}

      {/* 🔊 VOLUME BUTTON */}
      <button
        onClick={toggleMute}
        className="
          absolute bottom-3 right-3
          bg-black/50 backdrop-blur
          p-2 rounded-full
          text-white
          opacity-80 hover:opacity-100
          transition
        "
      >
        {muted ? (
          <FiVolumeX className="w-5 h-5" />
        ) : (
          <FiVolume2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}

export default VideoPlayer;

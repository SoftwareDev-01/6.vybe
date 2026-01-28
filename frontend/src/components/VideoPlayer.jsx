import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

function VideoPlayer({ media }) {
  const videoRef = useRef(null);
  const observerRef = useRef(null);

  const [muted, setMuted] = useState(true); // Instagram default
  const [isPlaying, setIsPlaying] = useState(false);

  /**
   * 👇 Prevents IntersectionObserver from
   * overriding explicit user pause
   */
  const userPausedRef = useRef(false);

  /* ================= USER INTERACTION ================= */

  const handleTogglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
      userPausedRef.current = false;
    } else {
      video.pause();
      setIsPlaying(false);
      userPausedRef.current = true;
    }
  }, []);

  const toggleMute = useCallback((e) => {
    e.stopPropagation(); // prevent play/pause toggle
    setMuted((prev) => !prev);
  }, []);

  /* ================= VIEWPORT AUTOPLAY ================= */

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (!video) return;

        if (entry.isIntersecting) {
          // 👇 only auto-play if user didn't pause manually
          if (!userPausedRef.current) {
            video.play().then(() => {
              setIsPlaying(true);
            }).catch(() => {});
          }
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    observerRef.current.observe(video);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  /* ================= UI ================= */

  return (
    <div
      onClick={handleTogglePlay}
      className="
        relative w-full h-full
        bg-black overflow-hidden
        cursor-pointer group
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

      {/* ▶️ PLAY OVERLAY */}
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
        aria-label="Toggle sound"
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

export default memo(VideoPlayer);

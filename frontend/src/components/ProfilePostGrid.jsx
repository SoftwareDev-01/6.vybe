import React, { memo, useCallback, useMemo } from "react";

function ProfilePostGrid({ posts = [], onPostClick }) {
  /**
   * 🔹 Stable click handler
   */
  const handlePostClick = useCallback(
    (post) => {
      onPostClick?.(post);
    },
    [onPostClick]
  );

  /**
   * 🔹 Memoized empty state
   */
  const isEmpty = useMemo(() => posts.length === 0, [posts.length]);

  if (isEmpty) {
    return (
      <div className="py-20 text-center text-gray-400 text-sm">
        No posts yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-[2px] px-[2px]">
      {posts.map((post) => (
        <div
          key={post._id}
          onClick={() => handlePostClick(post)}
          className="
            relative aspect-square bg-black cursor-pointer overflow-hidden
            hover:opacity-90 transition
          "
        >
          {post.mediaType === "image" && (
            <img
              src={post.media}
              alt="post"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {post.mediaType === "video" && (
            <video
              src={post.media}
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default memo(ProfilePostGrid);

import React from "react";

function ProfilePostGrid({ posts = [], onPostClick }) {
  if (!posts.length) {
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
          onClick={() => onPostClick(post)}
          className="relative aspect-square bg-black cursor-pointer overflow-hidden"
        >
          {post.mediaType === "image" && (
            <img
              src={post.media}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {post.mediaType === "video" && (
            <video
              src={post.media}
              muted
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default ProfilePostGrid;

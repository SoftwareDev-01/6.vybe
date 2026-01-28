import axios from "axios";
import React, { memo, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { serverUrl } from "../App";
import { toggleFollow } from "../redux/userSlice";

function FollowButton({ targetUserId, tailwind = "", onFollowChange }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  /**
   * 🔹 Optimized selector
   * Only re-renders when `following` actually changes
   */
  const following = useSelector(
    (state) => state.user.following,
    shallowEqual
  );

  /**
   * 🔹 Memoized follow check
   * Important when many buttons exist (feed, suggestions)
   */
  const isFollowing = useMemo(() => {
    return following.includes(targetUserId);
  }, [following, targetUserId]);

  /**
   * 🔹 Stable handler (prevents re-renders of children)
   */
  const handleFollow = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    try {
      await axios.post(
        `${serverUrl}/api/user/follow/${targetUserId}`,
        {},
        { withCredentials: true }
      );

      dispatch(toggleFollow(targetUserId));
      onFollowChange?.();

    } catch (error) {
      console.error(
        "FOLLOW ERROR:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  }, [loading, targetUserId, dispatch, onFollowChange]);

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`
        min-w-[96px]
        px-4 py-1.5 sm:py-2
        text-sm font-semibold
        rounded-full
        transition-all duration-200
        flex items-center justify-center
        select-none
        ${
          isFollowing
            ? `
              bg-white/5
              border border-white/15
              text-gray-200
              hover:bg-white/10
            `
            : `
              bg-blue-500
              text-white
              hover:bg-blue-600
            `
        }
        ${loading ? "opacity-70 cursor-not-allowed" : "active:scale-95"}
        ${tailwind}
      `}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        isFollowing ? "Following" : "Follow"
      )}
    </button>
  );
}

/**
 * 🔹 Memo export
 * CRUCIAL when used inside lists (posts, users, suggestions)
 */
export default memo(FollowButton);

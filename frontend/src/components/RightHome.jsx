import React, { memo, lazy, Suspense } from "react";

/**
 * 🔹 Lazy load Messages
 * Prevents heavy chat UI from loading unless needed
 */
const Messages = lazy(() => import("../pages/Messages"));

function RightHome() {
  return (
    <aside
      className="
        hidden lg:flex
        flex-col
        w-full
        h-full
        bg-[#0f0f0f]
        border-l border-gray-800
      "
    >
      {/* Messages scroll internally */}
      <div className="flex-1 overflow-y-auto">
        <Suspense
          fallback={
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              Loading messages…
            </div>
          }
        >
          <Messages />
        </Suspense>
      </div>
    </aside>
  );
}

export default memo(RightHome);

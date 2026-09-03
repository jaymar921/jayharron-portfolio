import React from "react";

function DragContainer({ children }) {
  return (
    // Pinned to the viewport origin: without top/left the container would sit
    // at its static position below the top bar, and every window inside it
    // would land that far lower than the desktop layout maths intends.
    <div className="absolute left-0 top-0 z-[99] bg-[rgba(0,0,0,0.5)] text-white w-[200vw] h-screen select-none">
      {children}
    </div>
  );
}

export default DragContainer;

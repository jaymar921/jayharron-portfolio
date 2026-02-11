import React from "react";

function DragContainer({ children }) {
  return (
    <div className="absolute z-[99] bg-[rgba(0,0,0,0.5)] text-white w-[200vw] h-screen select-none">
      {children}
    </div>
  );
}

export default DragContainer;

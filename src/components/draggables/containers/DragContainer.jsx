import React from "react";

function DragContainer({ children }) {
  return (
    <div className="absolute z-[99] bg-[rgba(22,78,99,0.1)] text-white w-[200vw] h-screen select-none">
      {children}
    </div>
  );
}

export default DragContainer;

import { useEffect, useState } from "react";

function DragWindow({
  posX = 0,
  posY = 0,
  icon = null,
  title = "Drag Window",
  show = true,
  setShow = () => {},
  content = null,
}) {
  const [position, setPosition] = useState({ x: posX, y: posY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className={`absolute w-fit rounded-2xl overflow-hidden shadow-2xlbg-transparent ${
        show ? "block" : "hidden"
      }`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      <div className="bg-blue-400 bg-opacity-40 backdrop-blur-lg rounded-t-lg drop-shadow-lg p-2 flex items-center cursor-grabbing">
        {icon && <span className="mr-2">{icon}</span>}
        <span>{title}</span>
        <button
          className="ml-auto cursor-pointer bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            setShow(false);
          }}
        >
          x
        </button>
      </div>
      <div className="p-4 bg-white bg-opacity-10 backdrop-blur-lg drop-shadow-lg">
        {content ? content : <p>This is the content area of the window.</p>}
      </div>
    </div>
  );
}

export default DragWindow;

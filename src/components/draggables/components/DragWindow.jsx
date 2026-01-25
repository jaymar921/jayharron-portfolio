import { useEffect, useState } from "react";

function DragWindow({
  id = "0",
  posX = 0,
  posY = 0,
  width = "fit",
  height = "fit",
  overflow = "overflow-hidden",
  background = null,
  icon = null,
  title = "Drag Window",
  show = true,
  setShow = () => {},
  content = null,
  active = false,
  activeTrigger = (e) => {},
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
    activeTrigger(id);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
    activeTrigger(id);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragOffset.x,
      y: touch.clientY - dragOffset.y,
    });
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div
      className={`${active && "z-[999999]"} absolute rounded-2xl overflow-hidden shadow-2xl bg-transparent ${
        show ? "block" : "hidden"
      }`}
      style={{ left: position.x, top: position.y }}
      onClick={() => {
        activeTrigger(id);
      }}
    >
      <div
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
        className={`bg-blue-400 bg-opacity-40 backdrop-blur-lg rounded-t-lg drop-shadow-lg p-2 flex items-center ${isDragging ? "cursor-grabbing" : "cursor-pointer"}`}
      >
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
      <div
        className={`p-4 ${background ? background : "bg-white bg-opacity-10 backdrop-blur-lg"} w-${width} h-${height} ${overflow} drop-shadow-lg`}
      >
        {content ? content : <p>This is the content area of the window.</p>}
      </div>
    </div>
  );
}

export default DragWindow;

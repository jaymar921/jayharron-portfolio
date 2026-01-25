import React, { useEffect, useState } from "react";

function DragIcon({ posX, posY, icon, title, onClick }) {
  const [position, setPosition] = useState({ x: posX, y: posY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setTimeout(() => {
      setIsDragging(true);
    }, 100);
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

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (!isDragging && onClick) {
      onClick();
      handleMouseUp();
    }
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      setIsDragging(false);
    }, 60);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove, false);
      document.addEventListener("mouseup", handleMouseUp, false);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove, false);
      document.removeEventListener("mouseup", handleMouseUp, false);
    };
  }, [isDragging]);

  return (
    <>
      <div
        className={`absolute w-fit h-fit cursor-pointer text-center ${
          isDragging ? "opacity-70" : "opacity-100"
        }`}
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleMouseDown}
        onClick={handleDoubleClick}
      >
        <div>
          <div className="absolute w-full h-full z-10" />
          {icon && (
            <img
              src={icon}
              alt={title}
              className="m-auto w-8 h-8 rounded-md select-none"
            />
          )}
        </div>
        <div>{title && <span className="m-1">{title}</span>}</div>
      </div>
    </>
  );
}

export default DragIcon;

import React, { useEffect, useState } from "react";

function DragIcon({ posX, posY, icon, title, onDoubleClick }) {
  const [position, setPosition] = useState({ x: posX, y: posY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastTap, setLastTap] = useState(0);

  const handleMouseDown = (e) => {
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    setIsDragging(true);
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

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (!isDragging && onDoubleClick) {
      onDoubleClick();
    }
  };

  // Touch support
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
    setIsDragging(true);

    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected
      if (onDoubleClick) onDoubleClick();
    }
    setLastTap(currentTime);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragOffset.x,
      y: touch.clientY - dragOffset.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove, false);
      document.addEventListener("mouseup", handleMouseUp, false);
      document.addEventListener("touchmove", handleTouchMove, false);
      document.addEventListener("touchend", handleTouchEnd, false);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove, false);
      document.removeEventListener("mouseup", handleMouseUp, false);
      document.removeEventListener("touchmove", handleTouchMove, false);
      document.removeEventListener("touchend", handleTouchEnd, false);
    };
  }, [isDragging]);

  return (
    <div
      className={`absolute w-fit h-fit cursor-pointer text-center ${
        isDragging ? "opacity-70" : "opacity-100"
      }`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onTouchStart={handleTouchStart}
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
  );
}

export default DragIcon;

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
  expandable = true,
}) {
  const [position, setPosition] = useState({ x: posX, y: posY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [fixedSize, setFixedSize] = useState({
    width,
    height,
    x: posX,
    y: posY,
  });
  const [size, setSize] = useState({ width, height });
  const [maximize, setMaximize] = useState(false);

  const resize = () => {
    if (maximize) {
      //reset back
      setSize({ width: fixedSize.width, height: fixedSize.height });
      setPosition({ x: fixedSize.x, y: fixedSize.y });
      setMaximize(false);
    } else {
      setSize({ width: "100vw", height: "100vh" });
      setPosition({ x: 0, y: 0 });
      setMaximize(true);
    }
  };

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
      className={`${active && "z-[999999]"} absolute rounded-md overflow-hidden shadow-2xl bg-transparent border-[1px] border-[rgba(255,255,255,0.5)] ${
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
        className={`bg-blue-400 bg-opacity-40 backdrop-blur-lg drop-shadow-lg p-2 flex items-center ${isDragging ? "cursor-grabbing" : "cursor-pointer"}`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span>{title}</span>

        <div className="w-auto m-auto mr-0 flex gap-2">
          {expandable && (
            <button
              className="ml-auto cursor-pointer bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              onClick={resize}
            >
              {maximize ? (
                <i class="fa-solid fa-minimize" />
              ) : (
                <i class="fa-solid fa-maximize" />
              )}
            </button>
          )}
          <button
            className="ml-auto cursor-pointer bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setShow(false);
              if (maximize) resize();
            }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
      </div>
      <div
        className={`${background ? background : "bg-white bg-opacity-10 backdrop-blur-lg"} ${overflow} drop-shadow-lg`}
        style={{ width: size.width, height: size.height }}
      >
        {content ? content : <p>This is the content area of the window.</p>}
      </div>
    </div>
  );
}

export default DragWindow;

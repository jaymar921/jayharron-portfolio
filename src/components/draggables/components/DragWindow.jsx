import { useEffect, useRef, useState } from "react";

const MIN_WIDTH = 280;
const MIN_HEIGHT = 180;

// Parses "1080px" / 1080 / "fit" into a plain pixel number for resize math.
function parseSize(value, fallback) {
  if (typeof value === "number") return value;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function DragWindow({
  id = "0",
  posX = 0,
  posY = 0,
  width = "fit",
  height = "fit",
  overflow = "overflow-y-auto overflow-x-hidden",
  background = null,
  icon = null,
  title = "Drag Window",
  show = true,
  setShow = () => {},
  content = null,
  active = false,
  activeTrigger = () => {},
  expandable = true,
  resizable = true,
}) {
  const [position, setPosition] = useState({ x: posX, y: posY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [fixedSize, setFixedSize] = useState({
    width: parseSize(width, 420),
    height: parseSize(height, 320),
    x: posX,
    y: posY,
  });
  const [size, setSize] = useState({
    width: parseSize(width, 420),
    height: parseSize(height, 320),
  });
  const [maximize, setMaximize] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const resizeState = useRef(null);

  const resize = () => {
    if (maximize) {
      //reset back
      setSize({ width: fixedSize.width, height: fixedSize.height });
      setPosition({ x: fixedSize.x, y: fixedSize.y });
      setMaximize(false);
    } else {
      setFixedSize({ width: size.width, height: size.height, ...position });
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
      setMaximize(true);
    }
  };

  const minimize = (e) => {
    e.stopPropagation();
    setMinimized(true);
  };

  const handleMouseDown = (e) => {
    if (maximize) return;
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
    if (maximize) return;
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

  const startResize = (direction) => (e) => {
    if (maximize) return;
    e.stopPropagation();
    e.preventDefault();
    activeTrigger(id);
    const point = e.touches ? e.touches[0] : e;
    resizeState.current = {
      direction,
      startX: point.clientX,
      startY: point.clientY,
      startWidth: size.width,
      startHeight: size.height,
      startPosX: position.x,
      startPosY: position.y,
    };
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", stopResize);
    document.addEventListener("touchmove", handleResizeMove, {
      passive: false,
    });
    document.addEventListener("touchend", stopResize);
  };

  const handleResizeMove = (e) => {
    const state = resizeState.current;
    if (!state) return;
    const point = e.touches ? e.touches[0] : e;
    const dx = point.clientX - state.startX;
    const dy = point.clientY - state.startY;
    const { direction } = state;

    let newWidth = state.startWidth;
    let newHeight = state.startHeight;
    let newX = state.startPosX;
    let newY = state.startPosY;

    if (direction.includes("e")) {
      newWidth = Math.max(MIN_WIDTH, state.startWidth + dx);
    }
    if (direction.includes("s")) {
      newHeight = Math.max(MIN_HEIGHT, state.startHeight + dy);
    }
    if (direction.includes("w")) {
      newWidth = Math.max(MIN_WIDTH, state.startWidth - dx);
      newX = state.startPosX + (state.startWidth - newWidth);
    }
    if (direction.includes("n")) {
      newHeight = Math.max(MIN_HEIGHT, state.startHeight - dy);
      newY = state.startPosY + (state.startHeight - newHeight);
    }

    setSize({ width: newWidth, height: newHeight });
    setPosition({ x: newX, y: newY });
    if (e.cancelable) e.preventDefault();
  };

  const stopResize = () => {
    resizeState.current = null;
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", stopResize);
    document.removeEventListener("touchmove", handleResizeMove);
    document.removeEventListener("touchend", stopResize);
  };

  const handles = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
  const handleClassNames = {
    n: "top",
    s: "bottom",
    e: "right",
    w: "left",
    ne: "corner top-right",
    nw: "corner top-left",
    se: "corner bottom-right",
    sw: "corner bottom-left",
  };

  return (
    <div
      className={`${active && "z-[999999]"} absolute rounded-lg overflow-hidden shadow-2xl bg-transparent border border-black/40 ${
        show ? "block" : "hidden"
      } ${minimized ? "!hidden" : ""}`}
      style={{ left: position.x, top: position.y }}
      onClick={() => {
        activeTrigger(id);
        if (minimized) setMinimized(false);
      }}
    >
      {resizable &&
        !maximize &&
        handles.map((dir) => (
          <div
            key={dir}
            className={`resize-handle ${handleClassNames[dir]}`}
            onMouseDown={startResize(dir)}
            onTouchStart={startResize(dir)}
          />
        ))}
      <div
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
        onDoubleClick={expandable ? resize : undefined}
        className={`window-titlebar select-none text-slate-200 p-1.5 flex items-center gap-2 ${
          isDragging ? "cursor-grabbing" : "cursor-pointer"
        }`}
      >
        <div className="w-auto flex gap-2 pl-1">
          <button
            className="window-btn bg-[#ff5f57] hover:brightness-110"
            onClick={(e) => {
              e.stopPropagation();
              setShow(false);
              if (maximize) resize();
            }}
            title="Close"
          />
          <button
            className="window-btn bg-[#febc2e] hover:brightness-110"
            onClick={minimize}
            title="Minimize"
          />
          {expandable && (
            <button
              className="window-btn bg-[#28c840] hover:brightness-110"
              onClick={(e) => {
                e.stopPropagation();
                resize();
              }}
              title={maximize ? "Restore" : "Maximize"}
            />
          )}
        </div>
        <div className="flex-1 flex items-center justify-center gap-2 min-w-0 pr-14">
          {icon && <span className="flex items-center">{icon}</span>}
          <span className="text-sm font-ubuntu truncate">{title}</span>
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

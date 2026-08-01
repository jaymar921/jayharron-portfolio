import React, { useEffect, useState } from "react";

function TopBar({ className = "", activeTitle = "" }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  const timeLabel = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateLabel = now.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`ubuntu-topbar z-[999999999] h-7 w-full flex items-center justify-between px-3 text-slate-200 text-xs font-ubuntu select-none ${className}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-semibold text-ubuntu-orange">Activities</span>
        {activeTitle && (
          <span className="truncate opacity-80">· {activeTitle}</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span>{dateLabel}</span>
        <span className="font-semibold">{timeLabel}</span>
        <i className="fa-solid fa-wifi" />
        <i className="fa-solid fa-volume-high" />
        <i className="fa-solid fa-battery-three-quarters" />
        <i className="fa-solid fa-power-off" />
      </div>
    </div>
  );
}

export default TopBar;

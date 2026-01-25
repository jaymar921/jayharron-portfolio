import React from "react";

import { exitIcon, jhlogo, resumeIcon } from "../../assets/icons";

function Taskbar({
  className = "",
  personalInfoClicked = () => {},
  resumeInfoClicked = () => {},
}) {
  return (
    <div className={className}>
      <div className="z-[99999999] h-16 w-[300px] bg-white bg-opacity-10 backdrop-blur-lg rounded-t-xl drop-shadow-lg">
        <div className="grid grid-cols-6 gap-4 px-4 h-[100%]">
          <div
            onClick={personalInfoClicked}
            className="h-10 w-10 cursor-pointer bg-[rgba(0,0,0,0.2)] my-auto flex items-center justify-center flex-bold shadow-md border-[1px] p-1 rounded-lg border-cyan-500"
          >
            <img src={jhlogo} />
          </div>
          {/* <div
            onClick={resumeInfoClicked}
            className="h-10 w-10 cursor-pointer bg-[rgba(0,0,0,0.2)] my-auto flex items-center justify-center flex-bold shadow-md border-[1px] rounded-lg"
          >
            <img src={resumeIcon} />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Taskbar;

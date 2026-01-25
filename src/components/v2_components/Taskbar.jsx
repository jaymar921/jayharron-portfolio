import React from "react";

import {
  exitIcon,
  jhlogo,
  medalIcon,
  projectIcon,
  resumeIcon,
} from "../../assets/icons";

function Taskbar({
  className = "",
  personalInfoClicked = () => {},
  aboutInfoClicked = () => {},
  projectInfoClicked = () => {},
}) {
  return (
    <div className={className}>
      <div className="z-[99999999] h-20 w-[300px] bg-white bg-opacity-10 backdrop-blur-lg rounded-t-xl drop-shadow-lg">
        <div className="grid grid-cols-6 gap-16 px-4 h-[100%]">
          <div
            onClick={personalInfoClicked}
            className="h-12 w-12 cursor-pointer bg-[rgba(0,0,0,0.2)] my-auto flex items-center justify-center flex-bold shadow-md border-[1px] p-1 rounded-lg border-cyan-500"
          >
            <img src={jhlogo} />
          </div>
          <div
            onClick={aboutInfoClicked}
            className="h-12 w-12 cursor-pointer bg-[rgba(0,0,0,0.2)] my-auto flex items-center justify-center flex-bold shadow-md border-[1px] rounded-lg"
          >
            <img src={medalIcon} />
          </div>
          <div
            onClick={projectInfoClicked}
            className="h-12 w-12 cursor-pointer bg-[rgba(0,0,0,0.2)] my-auto flex items-center justify-center flex-bold shadow-md border-[1px] rounded-lg border-cyan-500"
          >
            <img src={projectIcon} />
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

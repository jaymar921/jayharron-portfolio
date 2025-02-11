import React from "react";
import { githubmarkWhite, linkedin } from "../assets/icons";
import { Link } from "react-router-dom";

function ProfileCard({ className }) {
  return (
    <div className={`flex items-center justify-center h-screen`}>
      <div
        className={`${className} border-[1px] p-8 rounded-lg border-slate-700 text-white shadow-2xl bg-[rgba(0,0,0,0.2)] hover:p-10 transition-all duration-200 group select-none`}
      >
        <h1 className="green-gradient_text text-xl md:text-3xl font-bold drop-shadow-xl group-hover:text-2xl group-hover:md:text-4xl group-hover:transition-all group-hover:duration-200">
          Jayharron Mar Abejar
        </h1>
        <p className="text-md group-hover:text-xl group-hover:transition-all group-hover:duration-200">
          Software Developer
        </p>

        <div className="flex gap-2 pt-2">
          <Link
            className="w-[24px] md:w-[32px] group-hover:w-[32px] group-hover:md:w-[40px] group-hover:transition-all group-hover:duration-200"
            to={"https://github.com/jaymar921"}
            target="_blank"
          >
            <img className="w-full" src={githubmarkWhite} />
          </Link>
          <Link
            className="w-[24px] md:w-[32px] group-hover:w-[32px] group-hover:md:w-[40px] group-hover:transition-all group-hover:duration-200"
            to={"https://www.linkedin.com/in/jayharron-mar-abejar-b414a9169/"}
            target="_blank"
          >
            <img className="w-full" src={linkedin} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;

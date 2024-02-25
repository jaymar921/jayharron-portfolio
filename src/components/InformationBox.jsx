import React, { useEffect, useState } from "react";
import { ImageMapTemplate } from "../assets/images";
import { DownArrow } from "../assets/vectors";

const Content = {
  "-1": {
    text: (
      <p className="leading-none pb-2">
        Hi, I'm <a className="text-green-700">Jayharron Abejar</a>
      </p>
    ),
    more_info: (
      <p>
        A <a className="text-orange-500">Software Developer</a> specialized in{" "}
        <a className="text-blue-300">.NET</a>,{" "}
        <a className="text-blue-300">Flask</a> and{" "}
        <a className="text-blue-300">NextJS</a> from the Philippines.
      </p>
    ),
    link: "",
  },
  0: {
    text: <p>About me</p>,
    more_info:
      "💼 My journey is paved with collaboration, skill-building, and enriching experiences from working with top-notch companies and brilliant minds.",
    link: "/about",
    button_text: "Learn more...",
  },
  1: {
    text: <p>My Projects</p>,
    more_info:
      "🚀 Unlocking success one project at a time! Ready to discover the transformative power? ",
    link: "/projects",
    button_text: "View projects",
  },
  2: {
    text: <p>Contact</p>,
    more_info: (
      <p>
        🚀 Need a developer to bring your ideas to life? I'm just{" "}
        <a className="text-orange-200">one</a> click away!
      </p>
    ),
    button_text: "Contact me",
    link: "/contact",
  },
  3: {
    text: (
      <p className="leading-none pb-2">
        Hi, I'm <a className="text-green-700">Jayharron Abejar</a>
      </p>
    ),
    more_info:
      "A Software Developer specialized in .NET, and React.JS from the Philippines.",
    link: "",
  },
};

const InformationBox = ({ currentStage, worldMoving, handleNext }) => {
  const [Information, setInformation] = useState({
    text: "",
    more_info: "",
    link: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setInformation(Content[currentStage]);
    }, 1000);
  }, [currentStage]);
  return (
    <div
      className={`ease-in-out duration-1000 absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-20 items-center justify-center grid grid-rows-2 ${
        worldMoving ? "opacity-0 top-[-20%]" : "opacity-100"
      }`}
    >
      <div>
        <div className="w-[350px] fit-content overflow-hidden font-minecraft">
          <img className="top-0 w-[350px]" src={ImageMapTemplate} />
          <div className="absolute top-0 flex text-center justify-center w-[350px] h-full text-[#825419]">
            <p className="relative w-full font-sm text-[22px] p-8">
              {Information.text}
              <button
                className="z-20 text-[#634013] leading-none"
                onClick={handleNext}
                disabled={worldMoving}
              >
                <img className="w-8 h-8" src={DownArrow} />
              </button>
            </p>
          </div>
        </div>
        {Information.more_info !== "" && (
          <div className="absolute rounded-md mt-8 w-[350px] bg-[rgba(128,82,24,0.5)] border-2 border-[rgba(87,56,17,0.92)] text-[18px] font-minecraft text-white">
            <p className="p-2 text-justify">{Information.more_info}</p>
            {Information.link !== "" && (
              <div className="relative border-black border-2 w-[50%] my-auto mx-auto bg-gray-500 hover:bg-gray-400  overflow-hidden rounded-sm mb-2">
                <div className="absolute z-1 w-[100%] border-2 border-gray-700 hover:border-gray-500 bottom-0" />
                <div className="absolute z-1 w-[100%] h-[100%] border-2 border-gray-700 hover:border-gray-500 bottom-0" />
                <button
                  onClick={() => {
                    location.href = Information.link;
                  }}
                  className="relative text-center w-full z-2 text-white hover:text-gray-200"
                >
                  {Information.button_text}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InformationBox;

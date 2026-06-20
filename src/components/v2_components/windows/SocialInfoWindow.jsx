import React from "react";
import { jayPhoto } from "../../../assets/images";

function SocialInfoWindow() {
  return (
    <>
      <div className="w-[320px]">
        <div className="relative grid grid-cols-3 gap-0">
          <div className="w-fit rounded-md overflow-hidden m-0">
            <img className="w-[128px]" src={jayPhoto} />
          </div>
          <div className="col-span-2 m-0 relative pr-4">
            <h1 className="text-white text-2xl text-center font-bold">
              Jayharron Mar Abejar
            </h1>
            <h1 className="text-sm text-center text-green-400 font-bold">
              Software Engineer
            </h1>
            <h1 className="text-sm text-center text-green-400 font-bold">
              DevOps | Azure | Cloud
            </h1>
          </div>
        </div>
        <hr className="mt-4 mb-2" />
        <p className="px-2 text-sm text-justify">
          I'm a Filipino Software Engineer working remotely with clients in the
          United States. I'm open to collaborations too, though I usually take
          them on during my free time. Outside of tech, I'm a hobbyist who
          enjoys DIY projects, whether it's carpentry or tinkering with
          electrical setups. And when I'm not working, you'll probably find me
          hiking through mountains or spending time with family and friends.
        </p>
        <hr className="mt-2 mb-2" />
        <h2 className="text-white text-xl">Social Accounts:</h2>
        <div className="text-lg">
          <p className="px-4">
            <a href="https://github.com/jaymar921" target="_blank">
              <i class="fa-brands fa-github text-black"></i> GitHub
            </a>
          </p>
          <p className="px-4">
            <a
              href="https://www.linkedin.com/in/jayharron-mar-abejar-b414a9169/"
              target="_blank"
            >
              <i class="fa-brands fa-linkedin text-blue-500"></i> LinkedIn
            </a>
          </p>
          <p className="px-4">
            <a href="https://www.instagram.com/jerronabr/" target="_blank">
              <i class="fa-brands fa-instagram text-red-200"></i> Instagram
            </a>
          </p>
          {/* <p className="px-4">
            <a
              href="https://www.spigotmc.org/members/jaymar921.1073076/"
              target="_blank"
            >
              <i class="fa-solid fa-cube text-orange-300"></i> SpigotMC
            </a>
          </p> */}
        </div>
      </div>
    </>
  );
}

export default SocialInfoWindow;

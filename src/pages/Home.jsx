import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";
import Loader from "../components/Loader";
import MinecraftWorld from "../models/MinecraftWorld";
import InformationBox from "../components/InformationBox";
import Bee from "../models/Bee";
import { AnimalPositions } from "../constants";
import Allay from "../models/Allay";
import AmbientScene from "../models/AmbientScene";
import ProfileCard from "../components/ProfileCard";
import DragContainer from "../components/draggables/containers/DragContainer";
import Taskbar from "../components/v2_components/Taskbar";
import DragWindow from "../components/draggables/components/DragWindow";
import SocialInfoWindow from "../components/v2_components/windows/SocialInfoWindow";
import ResumeWindow from "../components/v2_components/windows/ResumeWindow";
import { jhlogo, medalIcon, projectIcon } from "../assets/icons";
import About from "./About";
import Projects from "./Projects";
import DragIcon from "../components/draggables/components/DragIcon";

// Function to check if the browser is in fullscreen mode
function isFullscreen() {
  return !!(
    document.fullscreenElement || // Standard
    document.webkitFullscreenElement || // Safari
    document.mozFullScreenElement || // Firefox
    document.msFullscreenElement // IE/Edge (old)
  );
}

const Home = () => {
  const totalWidth = Math.max(
    document.documentElement.scrollWidth,
    window.innerWidth,
  );

  const getScreenCenter = (x = 200, y = 150) => {
    const centerX = window.innerWidth / 2 - x;
    const centerY = window.innerHeight / 2 - y;
    return { x: centerX, y: centerY };
  };

  const [currentStage, setCurrentStage] = useState(-1); // -1
  const [worldMoving, setWorldMoving] = useState(true);
  const [worldPosRot, setWorldPosRot] = useState(undefined);
  const [DOFEnabled, enableDOF] = useState(
    /* totalWidth > 520 ? true :  false*/ false,
  );
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showCE3, setShowCE3] = useState(false);
  const [fullScreen, setFullScreen] = useState(isFullscreen());
  const [activeTrigger, setActiveTrigger] = useState("");

  const handleNext = () => {
    let s = currentStage;
    if (s++ >= 3) setCurrentStage(0);
    else setCurrentStage(s++);
  };

  const handleEnableDOF = () => {
    enableDOF(!DOFEnabled);
  };

  const personalInfoClicked = () => {
    setShowPersonalInfo(true);
    setActiveTrigger("social-window");
  };

  const resumeInfoClicked = () => {
    setShowResume(true);
    setActiveTrigger("about-window");
  };

  const projectInfoClicked = () => {
    setShowProject(true);
    setActiveTrigger("project-window");
  };

  const ce3Clicked = () => {
    setShowCE3(true);
    setActiveTrigger("ce3-window");
  };

  useEffect(() => {
    setInterval(() => {
      handleNext();
    }, 20_000);
  }, [currentStage]);

  const enterFullSceen = () => {
    if (!isFullscreen()) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        // Safari
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        // Firefox
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.msRequestFullscreen) {
        // IE/Edge
        document.documentElement.msRequestFullscreen();
      } else {
        console.warn("Fullscreen API is not supported by this browser.");
      }
    }
    setFullScreen(true);
  };

  return (
    <>
      <section className="w-full h-screen relative z-0 overflow-hidden">
        {/* {!fullScreen && (
          <div className="w-full h-screen relative overflow-hidden z-[999999999] bg-[rgba(0,0,0,0.8)] flex items-center place-content-center">
            <div className="text-white m-auto">
              <p className="py-1">Hello there...</p>
              <button onClick={enterFullSceen} className="btn cursor-pointer">
                Start Window
              </button>
            </div>
          </div>
        )} */}
        {/* <InformationBox
          handleNext={handleNext}
          worldMoving={worldMoving}
          currentStage={currentStage}
        /> */}
        <DragContainer>
          <DragIcon
            key={"icon-1"}
            posX={20}
            posY={15}
            icon={jhlogo}
            title={"Info"}
            onDoubleClick={setShowPersonalInfo}
          />
          <DragIcon
            key={"icon-2"}
            posX={10}
            posY={85}
            icon={medalIcon}
            title={"About"}
            onDoubleClick={setShowResume}
          />
          <DragIcon
            key={"icon-3"}
            posX={15}
            posY={155}
            icon={
              "https://jaymar921.github.io/jayharronabejar/assets/images/ce3.png"
            }
            title={"CE 3"}
            onDoubleClick={ce3Clicked}
          />
          <DragWindow
            key={"window-1"}
            id="social-window"
            posX={getScreenCenter(175, 260).x}
            posY={getScreenCenter(175, 260).y}
            show={showPersonalInfo}
            setShow={setShowPersonalInfo}
            icon={"📚"}
            title="Short Info"
            content={<SocialInfoWindow />}
            activeTrigger={setActiveTrigger}
            active={activeTrigger === "social-window"}
            expandable={false}
          />
          <DragWindow
            key={"window-2"}
            id="about-window"
            posX={getScreenCenter(totalWidth > 720 ? 360 : 175, 260).x}
            posY={getScreenCenter(175, 260).y}
            width={totalWidth > 720 ? "720px" : "350px"}
            height="450px"
            overflow="overflow-y-scroll"
            background="bg-slate-800"
            show={showResume}
            setShow={setShowResume}
            icon={<img className="w-4" src={medalIcon} />}
            title="About Me"
            activeTrigger={setActiveTrigger}
            active={activeTrigger === "about-window"}
            content={
              <>
                <div>
                  <About />
                </div>
              </>
            }
          />
          <DragWindow
            key={"window-3"}
            id="project-window"
            posX={getScreenCenter(totalWidth > 720 ? 360 : 175, 260).x}
            posY={getScreenCenter(175, 260).y}
            width={totalWidth > 720 ? "720px" : "350px"}
            height="450px"
            overflow="overflow-y-scroll"
            background="bg-slate-800"
            show={showProject}
            setShow={setShowProject}
            icon={<img className="w-4" src={projectIcon} />}
            title="My Projects"
            activeTrigger={setActiveTrigger}
            active={activeTrigger === "project-window"}
            content={
              <>
                <div>
                  <Projects />
                </div>
              </>
            }
          />
          <DragWindow
            key={"window-4"}
            id="ce3-window"
            posX={getScreenCenter(totalWidth > 720 ? 360 : 175, 260).x}
            posY={getScreenCenter(175, 260).y}
            width={totalWidth > 720 ? "720px" : "350px"}
            height="450px"
            overflow="overflow-y-scroll"
            background="bg-slate-800"
            show={showCE3}
            setShow={setShowCE3}
            icon={<img className="w-4" src={projectIcon} />}
            title="Custom Enchants 3"
            activeTrigger={setActiveTrigger}
            active={activeTrigger === "ce3-window"}
            content={
              <>
                <div className="h-[100%]">
                  <iframe
                    className="w-full h-[100%]"
                    src="https://jhprojects.vercel.app/ce3"
                  />
                </div>
              </>
            }
          />
        </DragContainer>
        <Canvas
          className="w-full h-full bg-transparent"
          camera={{ near: 0.1, far: 20, fov: 80, focus: 200 }}
          style={{ backgroundColor: "#171B21" }}
        >
          <Suspense fallback={<Loader />}>
            <directionalLight
              position={[-5, 2, 1]}
              color={"#D2D4A1"}
              intensity={3}
              castShadow
              shadow-mapSize-height={512}
              shadow-mapSize-width={512}
              shadow-mapSize={[1024, 1024]}
            />
            <fog attach="fog" args={["#171B21", 5, 15]} />
            <ambientLight intensity={0.5} />
            <hemisphereLight
              skyColor="#B1E1FF"
              groundColor="#212567"
              intensity={0.5}
            />

            <Bee
              receiveShadow
              currentStage={currentStage}
              setWorldMoving={setWorldMoving}
              worldPosRot={worldPosRot}
              BeePosition={AnimalPositions[0]}
            />
            <Bee
              receiveShadow
              currentStage={currentStage}
              setWorldMoving={setWorldMoving}
              worldPosRot={worldPosRot}
              BeePosition={AnimalPositions[1]}
            />
            <Bee
              receiveShadow
              currentStage={currentStage}
              setWorldMoving={setWorldMoving}
              worldPosRot={worldPosRot}
              BeePosition={AnimalPositions[2]}
            />
            <Bee
              receiveShadow
              currentStage={currentStage}
              setWorldMoving={setWorldMoving}
              worldPosRot={worldPosRot}
              BeePosition={AnimalPositions[3]}
            />
            <Allay
              receiveShadow
              currentStage={currentStage}
              setWorldMoving={setWorldMoving}
              worldPosRot={worldPosRot}
              BeePosition={AnimalPositions[4]}
            />
            <Allay
              receiveShadow
              currentStage={currentStage}
              setWorldMoving={setWorldMoving}
              worldPosRot={worldPosRot}
              BeePosition={AnimalPositions[5]}
            />
            <Allay
              receiveShadow
              currentStage={currentStage}
              setWorldMoving={setWorldMoving}
              worldPosRot={worldPosRot}
              BeePosition={AnimalPositions[6]}
            />

            <Allay
              receiveShadow
              currentStage={currentStage}
              setWorldMoving={setWorldMoving}
              worldPosRot={worldPosRot}
              BeePosition={AnimalPositions[7]}
            />
            <AmbientScene enableDoF={DOFEnabled} />
            <MinecraftWorld
              receiveShadow
              currentStage={currentStage}
              setWorldMoving={setWorldMoving}
              setWorldPosRot={setWorldPosRot}
            />
          </Suspense>
        </Canvas>

        {totalWidth > 520 && (
          <button
            className="z-[999999] absolute bottom-2 left-2 font-minecraft text-slate-300 border-2 border-slate-500 px-2 text-[15px]"
            onClick={handleEnableDOF}
          >
            {DOFEnabled ? "Disable DOF" : "Enable DOF"}
          </button>
        )}
        <Taskbar
          personalInfoClicked={personalInfoClicked}
          aboutInfoClicked={resumeInfoClicked}
          projectInfoClicked={projectInfoClicked}
          className="absolute bottom-0 w-screen flex place-content-center"
        />
      </section>
    </>
  );
};

export default Home;

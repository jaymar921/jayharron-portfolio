import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState } from "react";
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
import { resumeIcon } from "../assets/icons";

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

  const [currentStage, setCurrentStage] = useState(-2); // -1
  const [worldMoving, setWorldMoving] = useState(true);
  const [worldPosRot, setWorldPosRot] = useState(undefined);
  const [DOFEnabled, enableDOF] = useState(
    /* totalWidth > 520 ? true :  false*/ false,
  );
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showResume, setShowResume] = useState(false);

  const handleNext = () => {
    let s = currentStage;
    if (s++ >= 3) setCurrentStage(0);
    else setCurrentStage(s++);
  };

  const handleEnableDOF = () => {
    enableDOF(!DOFEnabled);
  };

  const personalInfoClicked = () => {
    setShowPersonalInfo(!showPersonalInfo);
  };

  const resumeInfoClicked = () => {
    setShowResume(!showResume);
  };

  return (
    <>
      <section className="w-full h-screen relative z-0 overflow-hidden">
        <InformationBox
          handleNext={handleNext}
          worldMoving={worldMoving}
          currentStage={currentStage}
        />
        <DragContainer>
          <DragWindow
            posX={getScreenCenter(175, 290).x}
            posY={getScreenCenter(175, 290).y}
            show={showPersonalInfo}
            setShow={setShowPersonalInfo}
            icon={"📚"}
            title="Short Info"
            content={<SocialInfoWindow />}
          />
          <DragWindow
            posX={getScreenCenter(175, 290).x}
            posY={getScreenCenter(175, 290).y}
            show={showResume}
            setShow={setShowResume}
            icon={<img className="w-4" src={resumeIcon} />}
            title="Jayharron's Resume"
            content={<ResumeWindow />}
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
        <button
          className="z-[999999] absolute bottom-2 left-2 font-minecraft text-slate-300 border-2 border-slate-500 px-2 text-[15px]"
          onClick={handleEnableDOF}
        >
          {DOFEnabled ? "Disable DOF" : "Enable DOF"}
        </button>
        <Taskbar
          personalInfoClicked={personalInfoClicked}
          resumeInfoClicked={resumeInfoClicked}
          className="absolute bottom-0 w-screen flex place-content-center"
        />
      </section>
    </>
  );
};

export default Home;

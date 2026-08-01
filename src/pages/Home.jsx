import { useEffect, useState } from "react";
import DragContainer from "../components/draggables/containers/DragContainer";
import Taskbar from "../components/v2_components/Taskbar";
import TopBar from "../components/v2_components/TopBar";
import DragWindow from "../components/draggables/components/DragWindow";
import SocialInfoWindow from "../components/v2_components/windows/SocialInfoWindow";
import { profile, medalIcon, projectIcon, resumeIcon } from "../assets/icons";
import About from "./About";
import Projects from "./Projects";
import DragIcon from "../components/draggables/components/DragIcon";
import ResumeWindow from "../components/v2_components/windows/ResumeWindow";

const DOCK_WIDTH = 88;
const TOPBAR_HEIGHT = 40;

const windowTitles = {
  "social-window": "Short Info",
  "about-window": "About Me",
  "project-window": "My Projects",
  "ce3-window": "Custom Enchants 3",
  "illuminary-peak-window": "Illuminary Peak, Inc.",
  "resume-window": "My Resume",
};

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
    const centerX = DOCK_WIDTH + (window.innerWidth - DOCK_WIDTH) / 2 - x;
    const centerY =
      TOPBAR_HEIGHT + (window.innerHeight - TOPBAR_HEIGHT) / 2 - y;
    return { x: centerX, y: centerY };
  };

  const [currentStage, setCurrentStage] = useState(-1); // -1
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showCE3, setShowCE3] = useState(false);
  const [showIP, setShowIP] = useState(false);
  const [fullScreen, setFullScreen] = useState(isFullscreen());
  const [activeTrigger, setActiveTrigger] = useState("");

  const handleNext = () => {
    let s = currentStage;
    if (s++ >= 3) setCurrentStage(0);
    else setCurrentStage(s++);
  };

  const personalInfoClicked = () => {
    setShowPersonalInfo(true);
    setActiveTrigger("social-window");
  };

  const resumeInfoClicked = () => {
    setShowResume(true);
    setActiveTrigger("resume-window");
  };

  const aboutInfoClicked = () => {
    setShowAbout(true);
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

  const illuminaryPeakClicked = () => {
    setShowIP(true);
    setActiveTrigger("illuminary-peak-window");
  };

  useEffect(() => {
    setInterval(() => {
      handleNext();
    }, 20_000);
  }, [currentStage, handleNext]);

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
    personalInfoClicked();
  };

  return (
    <>
      <section className="w-full h-screen relative z-0 overflow-hidden">
        {!fullScreen && (
          <div className="linux-wallpaper w-full h-screen relative overflow-hidden z-[999999999] flex items-center place-content-center">
            <div className="text-white m-auto text-center font-ubuntu">
              <i className="fa-brands fa-linux text-5xl text-ubuntu-orange mb-3 block" />
              <p className="py-1 text-md">
                Welcome to Jayharron&apos;s portfolio
              </p>
              <button onClick={enterFullSceen} className="btn cursor-pointer">
                Boot Desktop
              </button>
            </div>
          </div>
        )}
        <TopBar activeTitle={windowTitles[activeTrigger] || ""} />
        <DragContainer>
          <DragIcon
            key={"icon-1"}
            posX={DOCK_WIDTH + 24}
            posY={TOPBAR_HEIGHT + 16}
            icon={profile}
            title={"Info"}
            onDoubleClick={setShowPersonalInfo}
          />
          <DragIcon
            key={"icon-2"}
            posX={DOCK_WIDTH + 24}
            posY={TOPBAR_HEIGHT + 100}
            icon={medalIcon}
            title={"About"}
            onDoubleClick={setShowAbout}
          />
          <DragIcon
            key={"icon-3"}
            posX={DOCK_WIDTH + 24}
            posY={TOPBAR_HEIGHT + 184}
            icon={
              "https://jaymar921.github.io/jayharronabejar/assets/images/ce3.png"
            }
            title={"CE 3"}
            onDoubleClick={ce3Clicked}
          />
          <DragIcon
            key={"icon-4"}
            posX={DOCK_WIDTH + 24}
            posY={TOPBAR_HEIGHT + 268}
            icon={resumeIcon}
            title={"Resume"}
            onDoubleClick={setShowResume}
          />
          <DragIcon
            key={"icon-5"}
            posX={DOCK_WIDTH + 24}
            posY={TOPBAR_HEIGHT + 352}
            icon={"https://avatars.githubusercontent.com/u/259235313?s=64&v=4"}
            title={"IP Inc"}
            onDoubleClick={illuminaryPeakClicked}
          />
          <DragWindow
            key={"window-1"}
            id="social-window"
            posX={getScreenCenter(180, 260).x}
            posY={getScreenCenter(180, 260).y}
            width="360px"
            height="520px"
            show={showPersonalInfo}
            setShow={setShowPersonalInfo}
            icon={"📚"}
            title="Short Info"
            content={
              <div className="p-2">
                <SocialInfoWindow />
              </div>
            }
            activeTrigger={setActiveTrigger}
            active={activeTrigger === "social-window"}
            expandable={false}
          />
          <DragWindow
            key={"window-2"}
            id="about-window"
            posX={getScreenCenter(totalWidth > 1080 ? 540 : 175, 260).x}
            posY={getScreenCenter(175, 260).y}
            width={totalWidth > 1080 ? "1080px" : "350px"}
            height={totalWidth > 1080 ? "620px" : "450px"}
            overflow="overflow-y-scroll"
            background="bg-slate-800"
            show={showAbout}
            setShow={setShowAbout}
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
            posX={getScreenCenter(totalWidth > 1080 ? 540 : 175, 260).x}
            posY={getScreenCenter(175, 260).y}
            width={totalWidth > 1080 ? "1080px" : "350px"}
            height={totalWidth > 1080 ? "620px" : "450px"}
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
            posX={getScreenCenter(totalWidth > 1080 ? 540 : 175, 260).x}
            posY={getScreenCenter(175, 260).y}
            width={totalWidth > 1080 ? "1080px" : "350px"}
            height={totalWidth > 1080 ? "620px" : "450px"}
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

          <DragWindow
            key={"window-5"}
            id="illuminary-peak-window"
            posX={getScreenCenter(totalWidth > 1080 ? 540 : 175, 260).x}
            posY={getScreenCenter(175, 260).y}
            width={totalWidth > 1080 ? "1080px" : "350px"}
            height={totalWidth > 1080 ? "620px" : "450px"}
            overflow="overflow-y-scroll"
            background="bg-slate-800"
            show={showIP}
            setShow={setShowIP}
            icon={<img className="w-4" src={projectIcon} />}
            title="Illuminary Peak, Inc."
            activeTrigger={setActiveTrigger}
            active={activeTrigger === "illuminary-peak-window"}
            content={
              <>
                <div className="h-[100%]">
                  <iframe
                    className="w-full h-[100%]"
                    src="https://illuminary-peak.vercel.app/"
                  />
                </div>
              </>
            }
          />

          <DragWindow
            key={"window-6"}
            id="resume-window"
            posX={getScreenCenter(totalWidth > 1080 ? 540 : 175, 260).x}
            posY={getScreenCenter(175, 260).y}
            width={totalWidth > 1080 ? "1080px" : "350px"}
            height={totalWidth > 1080 ? "620px" : "450px"}
            overflow="overflow-y-scroll"
            background="bg-slate-800"
            show={showResume}
            setShow={setShowResume}
            icon={<img className="w-4" src={projectIcon} />}
            title="My Resume"
            activeTrigger={setActiveTrigger}
            active={activeTrigger === "resume-window"}
            content={
              <>
                <div>
                  <ResumeWindow />
                </div>
              </>
            }
          />
        </DragContainer>
        <Taskbar
          activeTrigger={activeTrigger}
          personalInfoClicked={personalInfoClicked}
          aboutInfoClicked={aboutInfoClicked}
          projectInfoClicked={projectInfoClicked}
          resumeInfoClicked={resumeInfoClicked}
          className="fixed left-3 top-1/2 -translate-y-1/2 z-[999999998]"
        />
        {/* Background */}
        <div className="linux-wallpaper fixed left-0 top-0 w-screen h-screen z-[-2]" />
      </section>
    </>
  );
};

export default Home;

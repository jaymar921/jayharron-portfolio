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
import MiniBrowserWindow from "../components/v2_components/windows/MiniBrowserWindow";

const DOCK_WIDTH = 88;
const TOPBAR_HEIGHT = 40;
const BROWSER_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23E95420'/%3E%3Cellipse cx='12' cy='12' rx='4.2' ry='10' fill='none' stroke='white' stroke-width='1.1'/%3E%3Cline x1='2' y1='12' x2='22' y2='12' stroke='white' stroke-width='1.1'/%3E%3Cpath d='M4 7.5c2.2 1.3 5 2 8 2s5.8-.7 8-2M4 16.5c2.2-1.3 5-2 8-2s5.8.7 8 2' fill='none' stroke='white' stroke-width='1.1'/%3E%3C/svg%3E";

const windowTitles = {
  "social-window": "Short Info",
  "about-window": "About Me",
  "project-window": "My Projects",
  "ce3-window": "Custom Enchants 3",
  "illuminary-peak-window": "Illuminary Peak, Inc.",
  "resume-window": "My Resume",
  "browser-window": "Mini Browser",
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

// The boot/fullscreen prompt is only relevant on the deployed production site.
const PROD_HOSTNAME = "jayharronabejar.vercel.app";
function isProdHost() {
  return window.location.hostname === PROD_HOSTNAME;
}

const Home = () => {
  const totalWidth = Math.max(
    document.documentElement.scrollWidth,
    window.innerWidth,
  );

  // x/y are half the window's width/height. On narrow (mobile) screens the
  // dock is skipped from the centering math and the result is clamped to the
  // viewport so windows never open off-screen or skewed toward the dock.
  const getScreenCenter = (x = 200, y = 150) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isCompact = viewportWidth < 768;
    const reservedLeft = isCompact ? 0 : DOCK_WIDTH;

    const idealX = reservedLeft + (viewportWidth - reservedLeft) / 2 - x;
    const idealY = TOPBAR_HEIGHT + (viewportHeight - TOPBAR_HEIGHT) / 2 - y;

    const minX = isCompact ? 8 : DOCK_WIDTH + 8;
    const maxX = Math.max(minX, viewportWidth - x * 2 - 8);
    const minY = TOPBAR_HEIGHT + 8;
    const maxY = Math.max(minY, viewportHeight - y * 2 - 8);

    return {
      x: Math.min(Math.max(idealX, minX), maxX),
      y: Math.min(Math.max(idealY, minY), maxY),
    };
  };

  // The dock moves to the bottom on mobile, so desktop icons no longer need
  // to clear its width and can sit close to the left edge instead.
  const iconOffsetX = window.innerWidth < 768 ? 16 : DOCK_WIDTH + 24;

  const [currentStage, setCurrentStage] = useState(-1); // -1
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showCE3, setShowCE3] = useState(false);
  const [showIP, setShowIP] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [fullScreen, setFullScreen] = useState(
    isProdHost() ? isFullscreen() : true,
  );
  const [activeTrigger, setActiveTrigger] = useState("");
  // Bumped on every icon/taskbar click so DragWindow can un-minimize even
  // when the window is already the active one (state values wouldn't
  // otherwise change and no re-render/effect would fire).
  const [reopenRequest, setReopenRequest] = useState({ id: "", tick: 0 });
  const requestReopen = (id) =>
    setReopenRequest((prev) => ({ id, tick: prev.tick + 1 }));

  const handleNext = () => {
    let s = currentStage;
    if (s++ >= 3) setCurrentStage(0);
    else setCurrentStage(s++);
  };

  const personalInfoClicked = () => {
    setShowPersonalInfo(true);
    setActiveTrigger("social-window");
    requestReopen("social-window");
  };

  const resumeInfoClicked = () => {
    setShowResume(true);
    setActiveTrigger("resume-window");
    requestReopen("resume-window");
  };

  const aboutInfoClicked = () => {
    setShowAbout(true);
    setActiveTrigger("about-window");
    requestReopen("about-window");
  };

  const projectInfoClicked = () => {
    setShowProject(true);
    setActiveTrigger("project-window");
    requestReopen("project-window");
  };

  const ce3Clicked = () => {
    setShowCE3(true);
    setActiveTrigger("ce3-window");
    requestReopen("ce3-window");
  };

  const illuminaryPeakClicked = () => {
    setShowIP(true);
    setActiveTrigger("illuminary-peak-window");
    requestReopen("illuminary-peak-window");
  };

  // Kept for when the browser desktop/dock icon is re-enabled.
  // eslint-disable-next-line no-unused-vars
  const browserClicked = () => {
    setShowBrowser(true);
    setActiveTrigger("browser-window");
    requestReopen("browser-window");
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
            posX={iconOffsetX}
            posY={TOPBAR_HEIGHT + 16}
            icon={profile}
            title={"Info"}
            onDoubleClick={setShowPersonalInfo}
          />
          <DragIcon
            key={"icon-2"}
            posX={iconOffsetX}
            posY={TOPBAR_HEIGHT + 100}
            icon={medalIcon}
            title={"About"}
            onDoubleClick={setShowAbout}
          />
          <DragIcon
            key={"icon-3"}
            posX={iconOffsetX}
            posY={TOPBAR_HEIGHT + 184}
            icon={
              "https://jaymar921.github.io/jayharronabejar/assets/images/ce3.png"
            }
            title={"CE 3"}
            onDoubleClick={ce3Clicked}
          />
          <DragIcon
            key={"icon-4"}
            posX={iconOffsetX}
            posY={TOPBAR_HEIGHT + 268}
            icon={resumeIcon}
            title={"Resume"}
            onDoubleClick={setShowResume}
          />
          <DragIcon
            key={"icon-5"}
            posX={iconOffsetX}
            posY={TOPBAR_HEIGHT + 352}
            icon={"https://avatars.githubusercontent.com/u/259235313?s=64&v=4"}
            title={"IP Inc"}
            onDoubleClick={illuminaryPeakClicked}
          />
          {/* Browser desktop icon disabled for now, see browserClicked/MiniBrowserWindow */}
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
            reopenSignal={
              reopenRequest.id === "social-window" ? reopenRequest.tick : 0
            }
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
            reopenSignal={
              reopenRequest.id === "about-window" ? reopenRequest.tick : 0
            }
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
            reopenSignal={
              reopenRequest.id === "project-window" ? reopenRequest.tick : 0
            }
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
            reopenSignal={
              reopenRequest.id === "ce3-window" ? reopenRequest.tick : 0
            }
            content={
              <>
                <div className="h-[100%]">
                  <iframe
                    className="w-full h-[100%]"
                    src="https://jhprojects.vercel.app/customenchantments3"
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
            reopenSignal={
              reopenRequest.id === "illuminary-peak-window"
                ? reopenRequest.tick
                : 0
            }
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
            reopenSignal={
              reopenRequest.id === "resume-window" ? reopenRequest.tick : 0
            }
            content={
              <>
                <div>
                  <ResumeWindow />
                </div>
              </>
            }
          />

          <DragWindow
            key={"window-7"}
            id="browser-window"
            posX={getScreenCenter(totalWidth > 1080 ? 400 : 175, 260).x}
            posY={getScreenCenter(175, 260).y}
            width={totalWidth > 1080 ? "800px" : "350px"}
            height={totalWidth > 1080 ? "560px" : "450px"}
            overflow="overflow-hidden"
            background="bg-white"
            show={showBrowser}
            setShow={setShowBrowser}
            icon={<img className="w-4" src={BROWSER_ICON} />}
            title="Mini Browser"
            activeTrigger={setActiveTrigger}
            active={activeTrigger === "browser-window"}
            reopenSignal={
              reopenRequest.id === "browser-window" ? reopenRequest.tick : 0
            }
            content={<MiniBrowserWindow />}
          />
        </DragContainer>
        <Taskbar
          activeTrigger={activeTrigger}
          personalInfoClicked={personalInfoClicked}
          aboutInfoClicked={aboutInfoClicked}
          projectInfoClicked={projectInfoClicked}
          resumeInfoClicked={resumeInfoClicked}
          className="fixed bottom-3 left-1/2 -translate-x-1/2 md:left-3 md:top-1/2 md:bottom-auto md:translate-x-0 md:-translate-y-1/2 z-[999999998]"
        />
        {/* Background */}
        <div className="linux-wallpaper fixed left-0 top-0 w-screen h-screen z-[-2]" />
      </section>
    </>
  );
};

export default Home;

import { useEffect, useState } from "react";
import DragContainer from "../components/draggables/containers/DragContainer";
import Taskbar from "../components/v2_components/Taskbar";
import TopBar from "../components/v2_components/TopBar";
import DragWindow from "../components/draggables/components/DragWindow";
import SocialInfoWindow from "../components/v2_components/windows/SocialInfoWindow";
import {
  profile,
  medalIcon,
  projectIcon,
  illuminaryPeakLogo,
  jhProjectsLogo,
  unixResume,
  unixFolder,
} from "../assets/icons";
import About from "./About";
import Projects from "./Projects";
import DragIcon from "../components/draggables/components/DragIcon";
import ResumeWindow from "../components/v2_components/windows/ResumeWindow";
import MiniBrowserWindow from "../components/v2_components/windows/MiniBrowserWindow";

const DOCK_WIDTH = 88;
const TOPBAR_HEIGHT = 40;
const BROWSER_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23E95420'/%3E%3Cellipse cx='12' cy='12' rx='4.2' ry='10' fill='none' stroke='white' stroke-width='1.1'/%3E%3Cline x1='2' y1='12' x2='22' y2='12' stroke='white' stroke-width='1.1'/%3E%3Cpath d='M4 7.5c2.2 1.3 5 2 8 2s5.8-.7 8-2M4 16.5c2.2-1.3 5-2 8-2s5.8.7 8 2' fill='none' stroke='white' stroke-width='1.1'/%3E%3C/svg%3E";

// Desktop icon grid. Icons flow top to bottom and wrap into the next column
// when the viewport runs out of room, so they stay aligned on one grid instead
// of each one carrying its own hand-tuned offset. The row pitch leaves room for
// a two-line label such as "Illuminary Peak".
const ICON_TOP_MARGIN = 16;
const ICON_SPACING_Y = 100;
const ICON_SPACING_X = 96;
// Clearance for the dock, which sits along the bottom edge on compact screens.
const COMPACT_DOCK_CLEARANCE = 88;

const windowTitles = {
  "social-window": "Short Info",
  "about-window": "About Me",
  "project-window": "My Projects",
  "illuminary-peak-window": "Illuminary Peak, Inc.",
  "jhprojects-window": "JHProjects",
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

// Normalises the vendor-prefixed fullscreen calls into a promise. The older
// prefixed versions return undefined rather than a promise, so the caller also
// has to confirm the request actually took effect.
function requestFullscreen() {
  const element = document.documentElement;
  const request =
    element.requestFullscreen ||
    element.webkitRequestFullscreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullscreen;

  if (!request) {
    return Promise.reject(new Error("Fullscreen API is not supported here"));
  }

  return Promise.resolve(request.call(element)).then(() => {
    if (!isFullscreen()) {
      throw new Error("Fullscreen request was not granted");
    }
  });
}

// Auto fullscreen is only wanted on the deployed production site. Locally it
// would fight with devtools on every hot reload.
const PROD_HOSTNAME = "jayharronabejar.vercel.app";
function shouldAutoFullscreen() {
  return window.location.hostname === PROD_HOSTNAME && !isFullscreen();
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

  // The dock is a left rail on desktop and a bottom bar on mobile, so each
  // layout gives up room on a different axis. Icons are laid out on one grid
  // and wrap into a new column once the usable height runs out.
  const isCompactViewport = window.innerWidth < 768;
  const iconOffsetX = isCompactViewport ? 16 : DOCK_WIDTH + 24;
  const iconTopY = TOPBAR_HEIGHT + ICON_TOP_MARGIN;
  const iconBottomClearance = isCompactViewport
    ? COMPACT_DOCK_CLEARANCE
    : ICON_TOP_MARGIN;
  const iconsPerColumn = Math.max(
    1,
    Math.floor(
      (window.innerHeight - iconTopY - iconBottomClearance) / ICON_SPACING_Y,
    ),
  );

  const getIconPosition = (index) => ({
    posX: iconOffsetX + Math.floor(index / iconsPerColumn) * ICON_SPACING_X,
    posY: iconTopY + (index % iconsPerColumn) * ICON_SPACING_Y,
  });

  const [currentStage, setCurrentStage] = useState(-1); // -1
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showIP, setShowIP] = useState(false);
  const [showJHProjects, setShowJHProjects] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [awaitingClickToFullscreen, setAwaitingClickToFullscreen] =
    useState(false);
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

  const illuminaryPeakClicked = () => {
    setShowIP(true);
    setActiveTrigger("illuminary-peak-window");
    requestReopen("illuminary-peak-window");
  };

  const jhProjectsClicked = () => {
    setShowJHProjects(true);
    setActiveTrigger("jhprojects-window");
    requestReopen("jhprojects-window");
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

  // The desktop tries to go fullscreen on its own. Browsers usually only grant
  // that from a user gesture, so when the automatic attempt is refused the Info
  // window stays closed and the visitor's first click anywhere does both: it
  // enters fullscreen and opens the window.
  useEffect(() => {
    let cancelled = false;

    const openInfoWindow = () => {
      if (cancelled) return;
      setShowPersonalInfo(true);
      setActiveTrigger("social-window");
      setReopenRequest((prev) => ({
        id: "social-window",
        tick: prev.tick + 1,
      }));
    };

    const onFirstClick = () => {
      window.removeEventListener("pointerdown", onFirstClick);
      setAwaitingClickToFullscreen(false);
      requestFullscreen().catch(() => {});
      openInfoWindow();
    };

    if (!shouldAutoFullscreen()) {
      openInfoWindow();
      return () => {
        cancelled = true;
      };
    }

    requestFullscreen()
      .then(openInfoWindow)
      .catch(() => {
        if (cancelled) return;
        setAwaitingClickToFullscreen(true);
        window.addEventListener("pointerdown", onFirstClick);
      });

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", onFirstClick);
    };
  }, []);

  return (
    <>
      <section className="w-full h-screen relative z-0 overflow-hidden">
        <TopBar activeTitle={windowTitles[activeTrigger] || ""} />
        <DragContainer>
          <DragIcon
            key={"icon-1"}
            {...getIconPosition(0)}
            icon={profile}
            title={"Info"}
            onDoubleClick={personalInfoClicked}
          />
          <DragIcon
            key={"icon-2"}
            {...getIconPosition(1)}
            icon={illuminaryPeakLogo}
            iconBg={"#FFFFFF"}
            title={"Illuminary Peak"}
            onDoubleClick={illuminaryPeakClicked}
          />
          <DragIcon
            key={"icon-3"}
            {...getIconPosition(2)}
            icon={jhProjectsLogo}
            title={"JHProjects"}
            onDoubleClick={jhProjectsClicked}
          />
          <DragIcon
            key={"icon-4"}
            {...getIconPosition(3)}
            icon={unixFolder}
            title={"About"}
            onDoubleClick={aboutInfoClicked}
          />
          <DragIcon
            key={"icon-5"}
            {...getIconPosition(4)}
            icon={unixResume}
            title={"Resume"}
            onDoubleClick={resumeInfoClicked}
          />
          {/* Browser desktop icon disabled for now, see browserClicked/MiniBrowserWindow */}
          <DragWindow
            key={"window-1"}
            id="social-window"
            posX={getScreenCenter(180, 260).x}
            posY={getScreenCenter(180, 260).y}
            width="360px"
            height="auto"
            show={showPersonalInfo}
            setShow={setShowPersonalInfo}
            icon={"📚"}
            title="Short Info"
            content={
              <div>
                <SocialInfoWindow />
              </div>
            }
            activeTrigger={setActiveTrigger}
            active={activeTrigger === "social-window"}
            reopenSignal={
              reopenRequest.id === "social-window" ? reopenRequest.tick : 0
            }
            expandable={false}
            resizable={false}
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
            key={"window-5"}
            id="jhprojects-window"
            posX={getScreenCenter(totalWidth > 1080 ? 540 : 175, 260).x}
            posY={getScreenCenter(175, 260).y}
            width={totalWidth > 1080 ? "1080px" : "350px"}
            height={totalWidth > 1080 ? "620px" : "450px"}
            overflow="overflow-y-scroll"
            background="bg-slate-800"
            show={showJHProjects}
            setShow={setShowJHProjects}
            icon={<img className="w-4" src={jhProjectsLogo} />}
            title="JHProjects"
            activeTrigger={setActiveTrigger}
            active={activeTrigger === "jhprojects-window"}
            reopenSignal={
              reopenRequest.id === "jhprojects-window" ? reopenRequest.tick : 0
            }
            content={
              <>
                <div className="h-[100%]">
                  <iframe
                    className="w-full h-[100%]"
                    title="JHProjects"
                    src="https://jhprojects.vercel.app/"
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
        {awaitingClickToFullscreen && (
          <div className="fullscreen-hint fixed left-1/2 top-10 -translate-x-1/2 md:left-auto md:right-4 md:top-auto md:bottom-4 md:translate-x-0 z-[999999999] flex items-center gap-2 rounded-full px-4 py-2 text-xs text-slate-100 font-ubuntu">
            <i
              className="fa-solid fa-up-right-and-down-left-from-center text-ubuntu-orange"
              aria-hidden="true"
            />
            Click anywhere to go fullscreen
          </div>
        )}
        {/* Background */}
        <div className="linux-wallpaper fixed left-0 top-0 w-screen h-screen z-[-2]" />
      </section>
    </>
  );
};

export default Home;

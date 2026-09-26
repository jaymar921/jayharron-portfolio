import { useEffect, useRef, useState } from "react";
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
  unixSideProjects,
} from "../assets/icons";
import About from "./About";
import Projects from "./Projects";
import SideProjects from "./SideProjects";
import DragIcon from "../components/draggables/components/DragIcon";
import ResumeWindow from "../components/v2_components/windows/ResumeWindow";
import MiniBrowserWindow from "../components/v2_components/windows/MiniBrowserWindow";
import {
  DESKTOP_TOPBAR_HEIGHT,
  WINDOW_CHROME_HEIGHT,
  WINDOW_CHROME_WIDTH,
} from "../constants/desktop";
import { CLICK_ACTIONS, PAGES, trackClick } from "../lib/analytics";

const DOCK_WIDTH = 88;
const TOPBAR_HEIGHT = DESKTOP_TOPBAR_HEIGHT;
const SCREEN_MARGIN = 8;
const COMPACT_BREAKPOINT = 768;
// Clearance for the dock, which sits along the bottom edge on compact screens.
const COMPACT_DOCK_CLEARANCE = 88;
const BROWSER_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23E95420'/%3E%3Cellipse cx='12' cy='12' rx='4.2' ry='10' fill='none' stroke='white' stroke-width='1.1'/%3E%3Cline x1='2' y1='12' x2='22' y2='12' stroke='white' stroke-width='1.1'/%3E%3Cpath d='M4 7.5c2.2 1.3 5 2 8 2s5.8-.7 8-2M4 16.5c2.2-1.3 5-2 8-2s5.8.7 8 2' fill='none' stroke='white' stroke-width='1.1'/%3E%3C/svg%3E";

// Desktop icon grid. Icons flow top to bottom and wrap into the next column
// when the viewport runs out of room, so they stay aligned on one grid instead
// of each one carrying its own hand-tuned offset. The row pitch leaves room for
// a two-line label such as "Illuminary Peak".
const ICON_TOP_MARGIN = 16;
const ICON_SPACING_Y = 100;
const ICON_SPACING_X = 96;

// Largest a content window is allowed to get, and the Short Info window's
// natural size. Both are capped by whatever the viewport can actually spare.
const MAX_WINDOW_WIDTH = 1080;
const MAX_WINDOW_HEIGHT = 620;
const INFO_WINDOW_WIDTH = 360;
const INFO_WINDOW_HEIGHT = 490;

const windowTitles = {
  "social-window": "Short Info",
  "about-window": "About Me",
  "project-window": "My Projects",
  "illuminary-peak-window": "Illuminary Peak, Inc.",
  "jhprojects-window": "JHProjects",
  "side-projects-window": "Side Projects",
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

function getFullscreenRequest() {
  const element = document.documentElement;
  return (
    element.requestFullscreen ||
    element.webkitRequestFullscreen ||
    element.mozRequestFullScreen ||
    element.msRequestFullscreen
  );
}

// Normalises the vendor-prefixed fullscreen calls into a promise. The older
// prefixed versions return undefined rather than a promise, so the caller also
// has to confirm the request actually took effect.
function requestFullscreen() {
  const element = document.documentElement;
  const request = getFullscreenRequest();

  if (!request) {
    return Promise.reject(new Error("Fullscreen API is not supported here"));
  }

  return Promise.resolve(request.call(element)).then(() => {
    if (!isFullscreen()) {
      throw new Error("Fullscreen request was not granted");
    }
  });
}

const FULLSCREEN_EVENTS = [
  "fullscreenchange",
  "webkitfullscreenchange",
  "mozfullscreenchange",
  "MSFullscreenChange",
];

// The desktop only insists on fullscreen for the deployed site. Locally it
// would fight with devtools on every hot reload, and a browser with no
// fullscreen support at all (iOS Safari cannot take the whole document) is
// never left waiting for something that will not happen.
const PROD_HOSTNAME = "jayharronabejar.vercel.app";
function wantsFullscreen() {
  return (
    window.location.hostname === PROD_HOSTNAME &&
    Boolean(getFullscreenRequest())
  );
}

function readViewport() {
  return { width: window.innerWidth, height: window.innerHeight };
}

const Home = () => {
  // Viewport is state rather than a direct window read, so entering fullscreen
  // or rotating a phone re-runs the layout instead of leaving windows homed to
  // whatever size the page happened to load at.
  const [viewport, setViewport] = useState(readViewport);
  const [hasEnteredFullscreen, setHasEnteredFullscreen] = useState(isFullscreen);
  const [needsFullscreen] = useState(wantsFullscreen);

  const isCompactViewport = viewport.width < COMPACT_BREAKPOINT;

  // Usable desktop: below the top bar and clear of the dock, which is a left
  // rail on wide screens and a bottom bar on compact ones.
  const bounds = {
    left: isCompactViewport ? SCREEN_MARGIN : DOCK_WIDTH + SCREEN_MARGIN,
    right: viewport.width - SCREEN_MARGIN,
    top: TOPBAR_HEIGHT + SCREEN_MARGIN,
    bottom:
      viewport.height -
      (isCompactViewport ? COMPACT_DOCK_CLEARANCE : SCREEN_MARGIN),
  };
  const usableWidth = Math.max(240, bounds.right - bounds.left);
  const usableHeight = Math.max(200, bounds.bottom - bounds.top);

  // Windows take the space they can actually have. The title bar counts toward
  // the frame height, so the whole window ends up centred rather than just its
  // content, and the bottom edge never lands under the dock.
  const windowSize = {
    width: Math.min(MAX_WINDOW_WIDTH, usableWidth - WINDOW_CHROME_WIDTH),
    height: Math.min(MAX_WINDOW_HEIGHT, usableHeight - WINDOW_CHROME_HEIGHT),
  };
  const infoSize = {
    width: Math.min(INFO_WINDOW_WIDTH, usableWidth - WINDOW_CHROME_WIDTH),
    height: Math.min(INFO_WINDOW_HEIGHT, usableHeight - WINDOW_CHROME_HEIGHT),
  };

  const getWindowPosition = (width, height) => {
    const frameWidth = width + WINDOW_CHROME_WIDTH;
    const frameHeight = height + WINDOW_CHROME_HEIGHT;
    const x = bounds.left + (usableWidth - frameWidth) / 2;
    const y = bounds.top + (usableHeight - frameHeight) / 2;

    return {
      x: Math.round(
        Math.max(bounds.left, Math.min(x, bounds.right - frameWidth)),
      ),
      y: Math.round(
        Math.max(bounds.top, Math.min(y, bounds.bottom - frameHeight)),
      ),
    };
  };

  const iconOffsetX = isCompactViewport ? 16 : DOCK_WIDTH + 24;
  const iconTopY = TOPBAR_HEIGHT + ICON_TOP_MARGIN;
  const iconsPerColumn = Math.max(
    1,
    Math.floor((bounds.bottom - iconTopY) / ICON_SPACING_Y),
  );

  const getIconPosition = (index) => ({
    posX: iconOffsetX + Math.floor(index / iconsPerColumn) * ICON_SPACING_X,
    posY: iconTopY + (index % iconsPerColumn) * ICON_SPACING_Y,
  });

  // Icons and windows keep their placement in their own state, so re-homing
  // them after a viewport change means remounting them under a new key.
  const layoutKey = `${viewport.width}x${viewport.height}`;

  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showIP, setShowIP] = useState(false);
  const [showJHProjects, setShowJHProjects] = useState(false);
  const [showSideProjects, setShowSideProjects] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);
  const [activeTrigger, setActiveTrigger] = useState("");
  // Bumped on every icon/taskbar click so DragWindow can un-minimize even
  // when the window is already the active one (state values wouldn't
  // otherwise change and no re-render/effect would fire).
  const [reopenRequest, setReopenRequest] = useState({ id: "", tick: 0 });
  const requestReopen = (id) =>
    setReopenRequest((prev) => ({ id, tick: prev.tick + 1 }));

  // Every window open is a tracked click, labelled with the window's title,
  // so the dashboard can say which parts of the desktop visitors actually
  // look at. The desktop itself is the page; the windows are the buttons.
  const openWindow = (id, setShow) => {
    trackClick(PAGES.HOME, { action: CLICK_ACTIONS.OPEN, label: windowTitles[id] });
    setShow(true);
    setActiveTrigger(id);
    requestReopen(id);
  };

  const personalInfoClicked = () => openWindow("social-window", setShowPersonalInfo);
  const resumeInfoClicked = () => openWindow("resume-window", setShowResume);
  const aboutInfoClicked = () => openWindow("about-window", setShowAbout);
  const projectInfoClicked = () => openWindow("project-window", setShowProject);
  const illuminaryPeakClicked = () =>
    openWindow("illuminary-peak-window", setShowIP);
  const jhProjectsClicked = () => openWindow("jhprojects-window", setShowJHProjects);
  const sideProjectsClicked = () =>
    openWindow("side-projects-window", setShowSideProjects);

  // Kept for when the browser desktop/dock icon is re-enabled.
  // eslint-disable-next-line no-unused-vars
  const browserClicked = () => openWindow("browser-window", setShowBrowser);

  // Keep the layout in step with the viewport. Fullscreen and rotation settle
  // their dimensions a beat after the event fires, so the read is debounced.
  useEffect(() => {
    let timer = 0;

    const sync = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setViewport((previous) => {
          const next = readViewport();
          return previous.width === next.width && previous.height === next.height
            ? previous
            : next;
        });
      }, 180);
    };

    const onFullscreenChange = () => {
      if (isFullscreen()) setHasEnteredFullscreen(true);
      sync();
    };

    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    FULLSCREEN_EVENTS.forEach((event) =>
      document.addEventListener(event, onFullscreenChange),
    );

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      FULLSCREEN_EVENTS.forEach((event) =>
        document.removeEventListener(event, onFullscreenChange),
      );
    };
  }, []);

  // Fullscreen needs a user gesture, so the request rides on the visitor's
  // first interaction. The listeners stay armed until it is granted, in case
  // the first attempt is refused.
  useEffect(() => {
    if (!needsFullscreen || hasEnteredFullscreen) return undefined;

    const onInteract = () => {
      requestFullscreen().catch(() => {});
    };

    window.addEventListener("pointerdown", onInteract);
    window.addEventListener("keydown", onInteract);

    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, [needsFullscreen, hasEnteredFullscreen]);

  // The Short Info window is the desktop's welcome, so it waits until the
  // desktop is actually fullscreen. The delay lets the fullscreen transition
  // and the viewport sync above finish first, so the window opens already
  // centred on the new screen size instead of jumping into place.
  const desktopReady = hasEnteredFullscreen || !needsFullscreen;
  const infoWindowOpened = useRef(false);

  useEffect(() => {
    if (!desktopReady || infoWindowOpened.current) return undefined;
    infoWindowOpened.current = true;

    const timer = window.setTimeout(() => {
      setShowPersonalInfo(true);
      setActiveTrigger("social-window");
      setReopenRequest((previous) => ({
        id: "social-window",
        tick: previous.tick + 1,
      }));
    }, 260);

    return () => window.clearTimeout(timer);
  }, [desktopReady]);

  return (
    <>
      <section className="w-full h-screen relative z-0 overflow-hidden">
        <TopBar activeTitle={windowTitles[activeTrigger] || ""} />
        <DragContainer>
          <DragIcon
            key={`icon-1-${layoutKey}`}
            {...getIconPosition(0)}
            icon={profile}
            title={"Info"}
            onDoubleClick={personalInfoClicked}
          />
          <DragIcon
            key={`icon-2-${layoutKey}`}
            {...getIconPosition(1)}
            icon={illuminaryPeakLogo}
            iconBg={"#FFFFFF"}
            title={"Illuminary Peak"}
            onDoubleClick={illuminaryPeakClicked}
          />
          <DragIcon
            key={`icon-3-${layoutKey}`}
            {...getIconPosition(2)}
            icon={jhProjectsLogo}
            title={"JHProjects"}
            onDoubleClick={jhProjectsClicked}
          />
          <DragIcon
            key={`icon-6-${layoutKey}`}
            {...getIconPosition(3)}
            icon={unixSideProjects}
            title={"Side Projects"}
            onDoubleClick={sideProjectsClicked}
          />
          <DragIcon
            key={`icon-4-${layoutKey}`}
            {...getIconPosition(4)}
            icon={unixFolder}
            title={"About"}
            onDoubleClick={aboutInfoClicked}
          />
          <DragIcon
            key={`icon-5-${layoutKey}`}
            {...getIconPosition(5)}
            icon={unixResume}
            title={"Resume"}
            onDoubleClick={resumeInfoClicked}
          />
          {/* Browser desktop icon disabled for now, see browserClicked/MiniBrowserWindow */}
          <DragWindow
            key={`window-1-${layoutKey}`}
            id="social-window"
            posX={getWindowPosition(infoSize.width, infoSize.height).x}
            posY={getWindowPosition(infoSize.width, infoSize.height).y}
            width={infoSize.width}
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
            key={`window-2-${layoutKey}`}
            id="about-window"
            posX={getWindowPosition(windowSize.width, windowSize.height).x}
            posY={getWindowPosition(windowSize.width, windowSize.height).y}
            width={windowSize.width}
            height={windowSize.height}
            overflow="overflow-y-auto overflow-x-hidden"
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
            content={<About />}
          />
          <DragWindow
            key={`window-3-${layoutKey}`}
            id="project-window"
            posX={getWindowPosition(windowSize.width, windowSize.height).x}
            posY={getWindowPosition(windowSize.width, windowSize.height).y}
            width={windowSize.width}
            height={windowSize.height}
            overflow="overflow-y-auto overflow-x-hidden"
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
            content={<Projects />}
          />

          <DragWindow
            key={`window-4-${layoutKey}`}
            id="illuminary-peak-window"
            posX={getWindowPosition(windowSize.width, windowSize.height).x}
            posY={getWindowPosition(windowSize.width, windowSize.height).y}
            width={windowSize.width}
            height={windowSize.height}
            overflow="overflow-hidden"
            background="bg-slate-800"
            show={showIP}
            setShow={setShowIP}
            icon={<img className="w-4" src={illuminaryPeakLogo} />}
            title="Illuminary Peak, Inc."
            activeTrigger={setActiveTrigger}
            active={activeTrigger === "illuminary-peak-window"}
            reopenSignal={
              reopenRequest.id === "illuminary-peak-window"
                ? reopenRequest.tick
                : 0
            }
            content={
              <iframe
                className="w-full h-full block"
                title="Illuminary Peak, Inc."
                src="https://illuminary-peak.vercel.app/"
              />
            }
          />

          <DragWindow
            key={`window-5-${layoutKey}`}
            id="jhprojects-window"
            posX={getWindowPosition(windowSize.width, windowSize.height).x}
            posY={getWindowPosition(windowSize.width, windowSize.height).y}
            width={windowSize.width}
            height={windowSize.height}
            overflow="overflow-hidden"
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
              <iframe
                className="w-full h-full block"
                title="JHProjects"
                src="https://jhprojects.vercel.app/"
              />
            }
          />

          <DragWindow
            key={`window-8-${layoutKey}`}
            id="side-projects-window"
            posX={getWindowPosition(windowSize.width, windowSize.height).x}
            posY={getWindowPosition(windowSize.width, windowSize.height).y}
            width={windowSize.width}
            height={windowSize.height}
            overflow="overflow-y-auto overflow-x-hidden"
            background="bg-slate-800"
            show={showSideProjects}
            setShow={setShowSideProjects}
            icon={<img className="w-4" src={unixSideProjects} />}
            title="Side Projects"
            activeTrigger={setActiveTrigger}
            active={activeTrigger === "side-projects-window"}
            reopenSignal={
              reopenRequest.id === "side-projects-window"
                ? reopenRequest.tick
                : 0
            }
            content={<SideProjects />}
          />

          <DragWindow
            key={`window-6-${layoutKey}`}
            id="resume-window"
            posX={getWindowPosition(windowSize.width, windowSize.height).x}
            posY={getWindowPosition(windowSize.width, windowSize.height).y}
            width={windowSize.width}
            height={windowSize.height}
            overflow="overflow-y-auto overflow-x-hidden"
            background="bg-slate-800"
            show={showResume}
            setShow={setShowResume}
            icon={<img className="w-4" src={unixResume} />}
            title="My Resume"
            activeTrigger={setActiveTrigger}
            active={activeTrigger === "resume-window"}
            reopenSignal={
              reopenRequest.id === "resume-window" ? reopenRequest.tick : 0
            }
            content={<ResumeWindow />}
          />

          <DragWindow
            key={`window-7-${layoutKey}`}
            id="browser-window"
            posX={getWindowPosition(windowSize.width, windowSize.height).x}
            posY={getWindowPosition(windowSize.width, windowSize.height).y}
            width={windowSize.width}
            height={windowSize.height}
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
        {needsFullscreen && !hasEnteredFullscreen && (
          <div className="fullscreen-hint fixed left-1/2 top-10 -translate-x-1/2 md:left-auto md:right-4 md:top-auto md:bottom-4 md:translate-x-0 z-[999999999] flex items-center gap-2 rounded-full px-4 py-2 text-xs text-slate-100 font-ubuntu">
            <i
              className="fa-solid fa-up-right-and-down-left-from-center text-ubuntu-orange"
              aria-hidden="true"
            />
            Tap anywhere to enter the desktop
          </div>
        )}
        {/* Background */}
        <div className="linux-wallpaper fixed left-0 top-0 w-screen h-screen z-[-2]" />
      </section>
    </>
  );
};

export default Home;

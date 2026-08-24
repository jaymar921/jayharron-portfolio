import {
  jhlogo,
  profile,
  unixFolder,
  unixProject,
  unixResume,
} from "../../assets/icons";

// Kept for when the browser dock icon is re-enabled.
// eslint-disable-next-line no-unused-vars
const BROWSER_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23E95420'/%3E%3Cellipse cx='12' cy='12' rx='4.2' ry='10' fill='none' stroke='white' stroke-width='1.1'/%3E%3Cline x1='2' y1='12' x2='22' y2='12' stroke='white' stroke-width='1.1'/%3E%3Cpath d='M4 7.5c2.2 1.3 5 2 8 2s5.8-.7 8-2M4 16.5c2.2-1.3 5-2 8-2s5.8.7 8 2' fill='none' stroke='white' stroke-width='1.1'/%3E%3C/svg%3E";

function DockIcon({ icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`ubuntu-dock-icon ${
        active ? "is-active" : ""
      } h-10 w-10 rounded-xl overflow-hidden bg-black/20 border border-white/10 flex items-center justify-center shadow-md`}
    >
      <img className="h-full w-full object-cover" src={icon} alt={label} />
    </button>
  );
}

function Taskbar({
  className = "",
  activeTrigger = "",
  personalInfoClicked = () => {},
  aboutInfoClicked = () => {},
  projectInfoClicked = () => {},
  resumeInfoClicked = () => {},
  // eslint-disable-next-line no-unused-vars
  browserClicked = () => {},
}) {
  return (
    <div className={className}>
      <div className="ubuntu-dock z-[99999999] rounded-2xl flex flex-row md:flex-col items-center gap-3 shadow-2xl px-3 py-2 md:px-0 md:py-3 md:w-14">
        <div className="h-9 w-9 rounded-lg overflow-hidden mb-0 md:mb-1 bg-ubuntu-orange/20 flex items-center justify-center">
          <img className="h-6 w-6" src={jhlogo} alt="Logo" />
        </div>
        <DockIcon
          icon={profile}
          label="Info"
          onClick={personalInfoClicked}
          active={activeTrigger === "social-window"}
        />
        <DockIcon
          icon={unixFolder}
          label="About"
          onClick={aboutInfoClicked}
          active={activeTrigger === "about-window"}
        />
        <DockIcon
          icon={unixProject}
          label="Projects"
          onClick={projectInfoClicked}
          active={activeTrigger === "project-window"}
        />
        <DockIcon
          icon={unixResume}
          label="Resume"
          onClick={resumeInfoClicked}
          active={activeTrigger === "resume-window"}
        />
        {/* Browser dock icon disabled for now, see BROWSER_ICON/browserClicked */}
      </div>
    </div>
  );
}

export default Taskbar;

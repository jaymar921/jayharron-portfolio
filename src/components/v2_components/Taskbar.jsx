import {
  jhlogo,
  profile,
  medalIcon,
  projectIcon,
  resumeIcon,
} from "../../assets/icons";

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
}) {
  return (
    <div className={className}>
      <div className="ubuntu-dock z-[99999999] w-14 py-3 rounded-2xl flex flex-col items-center gap-3 shadow-2xl">
        <div className="h-9 w-9 rounded-lg overflow-hidden mb-1 bg-ubuntu-orange/20 flex items-center justify-center">
          <img className="h-6 w-6" src={jhlogo} alt="Logo" />
        </div>
        <DockIcon
          icon={profile}
          label="Info"
          onClick={personalInfoClicked}
          active={activeTrigger === "social-window"}
        />
        <DockIcon
          icon={medalIcon}
          label="About"
          onClick={aboutInfoClicked}
          active={activeTrigger === "about-window"}
        />
        <DockIcon
          icon={projectIcon}
          label="Projects"
          onClick={projectInfoClicked}
          active={activeTrigger === "project-window"}
        />
        <DockIcon
          icon={resumeIcon}
          label="Resume"
          onClick={resumeInfoClicked}
          active={activeTrigger === "resume-window"}
        />
      </div>
    </div>
  );
}

export default Taskbar;

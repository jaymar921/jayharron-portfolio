import { jayPhoto } from "../../../assets/images";
import { CLICK_ACTIONS, trackClick } from "../../../lib/analytics";

/** Records which link out was taken, then lets the browser follow it. */
const trackOut = (label, target) => () =>
  trackClick(null, { action: CLICK_ACTIONS.EXTERNAL, label, target });

function SocialInfoWindow() {
  return (
    <>
      <div className="w-full bg-ubuntu-aubergine-dark text-white p-3 rounded-b-md font-ubuntu">
        <div className="relative grid grid-cols-[100px_minmax(0,1fr)] items-center gap-3">
          <div className="w-full overflow-hidden rounded-md">
            <img
              className="aspect-square w-full object-cover"
              src={jayPhoto}
              alt="Jayharron Mar Abejar"
            />
          </div>
          <div className="min-w-0 text-center">
            <h1 className="text-white text-xl font-bold leading-tight sm:text-2xl">
              Jayharron Mar Abejar
            </h1>
            <h1 className="text-sm text-center text-ubuntu-orange font-bold">
              Software Engineer
            </h1>
            <h1 className="text-sm text-center text-ubuntu-orange font-bold">
              DevOps | Azure | Cloud
            </h1>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
          <span className="rounded-full border border-ubuntu-orange/40 bg-ubuntu-orange/10 px-2.5 py-1 text-ubuntu-orange">
            Cebu, Philippines
          </span>
          <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-emerald-300">
            Open to select projects
          </span>
        </div>
        <hr className="mt-4 mb-2 border-white/10" />
        <p className="px-2 text-left text-sm leading-5">
          I build web applications on .NET and React, ship them to Azure, and
          stay with them once they are live. Most of my week goes to remote work
          with teams in the United States, and I take on a small number of
          outside projects when the problem is interesting. Away from the
          keyboard you will usually find me mid DIY build, somewhere on a
          mountain trail, or with family.
        </p>
        <hr className="mt-2 mb-2 border-white/10" />
        <h2 className="text-white text-xl">Find me here:</h2>
        <div className="text-lg">
          <p className="px-4">
            <a
              href="https://github.com/jaymar921"
              target="_blank"
              rel="noreferrer"
              onClick={trackOut("GitHub", "https://github.com/jaymar921")}
            >
              <i className="fa-brands fa-github text-white" /> GitHub
            </a>
          </p>
          <p className="px-4">
            <a
              href="https://www.linkedin.com/in/jayharron-mar-abejar-b414a9169/"
              target="_blank"
              rel="noreferrer"
              onClick={trackOut(
                "LinkedIn",
                "https://www.linkedin.com/in/jayharron-mar-abejar-b414a9169/",
              )}
            >
              <i className="fa-brands fa-linkedin text-blue-500" /> LinkedIn
            </a>
          </p>
          <p className="px-4">
            <a
              href="https://www.instagram.com/jerronabr/"
              target="_blank"
              rel="noreferrer"
              onClick={trackOut("Instagram", "https://www.instagram.com/jerronabr/")}
            >
              <i className="fa-brands fa-instagram text-red-200" /> Instagram
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

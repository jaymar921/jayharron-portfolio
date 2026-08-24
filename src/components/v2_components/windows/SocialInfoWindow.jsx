import { jayPhoto } from "../../../assets/images";

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
        <hr className="mt-4 mb-2 border-white/10" />
        <p className="px-2 text-left text-sm leading-5">
          I&apos;m a Filipino Software Engineer working remotely with clients in
          the United States. I&apos;m open to collaborations too, though I
          usually take them on during my free time. Outside of tech, I&apos;m a
          hobbyist who enjoys DIY projects, whether it&apos;s carpentry or
          tinkering with electrical setups. And when I&apos;m not working,
          you&apos;ll probably find me hiking through mountains or spending time
          with family and friends.
        </p>
        <hr className="mt-2 mb-2 border-white/10" />
        <h2 className="text-white text-xl">Social Accounts:</h2>
        <div className="text-lg">
          <p className="px-4">
            <a
              href="https://github.com/jaymar921"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-github text-white" /> GitHub
            </a>
          </p>
          <p className="px-4">
            <a
              href="https://www.linkedin.com/in/jayharron-mar-abejar-b414a9169/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-linkedin text-blue-500" /> LinkedIn
            </a>
          </p>
          <p className="px-4">
            <a
              href="https://www.instagram.com/jerronabr/"
              target="_blank"
              rel="noreferrer"
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

import { projects } from "../constants";
import { Link } from "../routing";

const Projects = () => {
  return (
    <section className="min-h-full bg-ubuntu-aubergine-dark p-4 pb-10 font-mono text-white sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ubuntu-warm-grey">
            <span className="flex items-center gap-2">
              <i
                className="fa-solid fa-folder-open text-ubuntu-orange"
                aria-hidden="true"
              />
              ~/jayharron/projects
            </span>
            <span>{projects.length} entries</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            My Projects
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ubuntu-warm-grey">
            A working directory of applications, tools, and experiments built
            across web, cloud, and game development.
          </p>
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs text-ubuntu-warm-grey">
          <span className="text-ubuntu-orange">$</span>
          <span>ls -la ./projects</span>
          <span className="ml-auto hidden sm:inline">
            open-source / websites
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.name}
              className="group flex min-w-0 flex-col border border-white/10 bg-black/20 p-4 transition-colors hover:border-ubuntu-orange/70 hover:bg-black/30"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/10 bg-ubuntu-panel p-2">
                  <img
                    src={project.iconUrl}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h2 className="break-words text-base font-bold text-white group-hover:text-ubuntu-orange-light">
                      {project.name}
                    </h2>
                    <span className="text-[11px] text-ubuntu-warm-grey">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-2 break-words text-sm leading-6 text-slate-300">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex min-h-8 items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs">
                <span className="text-ubuntu-warm-grey">
                  <span className="text-ubuntu-orange">●</span>{" "}
                  {project.isOpenSource
                    ? "open source"
                    : project.link
                      ? "website"
                      : "private / offline"}
                </span>
                {project.link ? (
                  <Link
                    to={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 font-bold text-ubuntu-orange hover:text-white"
                  >
                    {project.isOpenSource ? "Open project" : "Open website"}
                    <i
                      className="fa-solid fa-arrow-up-right-from-square"
                      aria-hidden="true"
                    />
                  </Link>
                ) : (
                  <span className="text-ubuntu-warm-grey">
                    private / offline
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 border border-white/10 bg-black/20 p-3 text-xs text-ubuntu-warm-grey">
          <span className="text-ubuntu-orange">$</span> printf &quot;keep
          building&quot;
          <span className="ml-2 text-slate-500">
            # more projects in progress
          </span>
        </div>
      </div>
    </section>
  );
};

export default Projects;

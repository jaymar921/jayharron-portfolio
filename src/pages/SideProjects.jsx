import { sideProjects } from "../constants";
import { CLICK_ACTIONS, trackClick } from "../lib/analytics";

const SideProjects = () => {
  return (
    <section className="min-h-full bg-ubuntu-aubergine-dark p-4 pb-10 font-mono text-white sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ubuntu-warm-grey">
            <span className="flex items-center gap-2">
              <i
                className="fa-solid fa-star text-ubuntu-orange"
                aria-hidden="true"
              />
              ~/jayharron/side-projects
            </span>
            <span>{sideProjects.length} entries</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Side Projects
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ubuntu-warm-grey">
            Freelance engagements and the things I build after hours, kept
            separate from my full-time roles.
          </p>
        </div>

        <div className="mb-3 flex items-center gap-2 text-xs text-ubuntu-warm-grey">
          <span className="text-ubuntu-orange">$</span>
          <span>cat side-projects.log</span>
        </div>

        <div className="space-y-3">
          {sideProjects.map((project) => (
            <article
              key={project.company_name}
              className="border border-white/10 bg-black/20 p-4"
            >
              <div className="flex min-w-0 items-start gap-3">
                <img
                  src={project.icon}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-md object-contain p-1"
                  style={{ backgroundColor: project.iconBg || "transparent" }}
                />
                <div className="min-w-0 flex-1">
                  <a
                    href={project.company_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() =>
                      trackClick(null, {
                        action: CLICK_ACTIONS.EXTERNAL,
                        label: project.company_name,
                        target: project.company_url,
                      })
                    }
                    className="break-words text-base font-bold text-ubuntu-orange hover:text-ubuntu-orange-light"
                  >
                    {project.company_name}
                  </a>
                  <p className="mt-1 break-words text-sm text-white">
                    {project.title}
                  </p>
                  <p className="mt-1 break-words text-xs text-ubuntu-warm-grey">
                    {project.date} | {project.job_type} | {project.location}
                  </p>
                </div>
              </div>
              {project.summary && (
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {project.summary}
                </p>
              )}
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-300">
                {project.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SideProjects;

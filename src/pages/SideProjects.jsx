import { sideProjects } from "../constants";
import { CLICK_ACTIONS, trackClick } from "../lib/analytics";

const TAG_COLORS = {
  Premium: "text-amber-300",
  Free: "text-emerald-300",
  npm: "text-sky-300",
};

const trackOut = (label, target) =>
  trackClick(null, { action: CLICK_ACTIONS.EXTERNAL, label, target });

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
                      trackOut(project.company_name, project.company_url)
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
              {project.products && (
                <>
                  <p className="mt-4 text-xs text-ubuntu-warm-grey">
                    <span className="text-ubuntu-orange">$</span> ls ./releases
                  </p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {project.products.map((product) => (
                      <a
                        key={product.name}
                        href={product.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackOut(product.name, product.url)}
                        className="group block border border-white/10 bg-black/20 p-3 transition-colors hover:border-ubuntu-orange/60"
                      >
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-ubuntu-orange">
                            {product.name}
                          </span>
                          <span
                            className={`shrink-0 text-[10px] uppercase tracking-wider ${
                              TAG_COLORS[product.tag] || "text-ubuntu-warm-grey"
                            }`}
                          >
                            {product.tag}
                          </span>
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-400">
                          {product.blurb}
                        </span>
                      </a>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-ubuntu-warm-grey">
                    <span className="text-ubuntu-orange">$</span> cat
                    ./how-it-runs.md
                  </p>
                </>
              )}
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-300">
                {project.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              {project.stack && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="border border-white/10 px-2 py-0.5 text-[11px] text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
              {project.links && (
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {project.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => trackOut(link.label, link.url)}
                      className="inline-flex items-center gap-1.5 bg-ubuntu-orange px-3 py-1.5 font-semibold text-white hover:bg-ubuntu-orange-light"
                    >
                      {link.label}
                      <i
                        className="fa-solid fa-arrow-up-right-from-square text-[10px]"
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SideProjects;

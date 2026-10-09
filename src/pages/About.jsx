import { experiences, educationalAttainment } from "../constants";
import { myselfPhoto } from "../assets/icons";
import { CLICK_ACTIONS, trackClick } from "../lib/analytics";

const About = () => {
  return (
    <section className="min-h-full bg-ubuntu-aubergine-dark p-4 pb-10 font-mono text-white sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 border-b border-white/10 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ubuntu-warm-grey">
            <span className="flex items-center gap-2">
              <i
                className="fa-solid fa-user text-ubuntu-orange"
                aria-hidden="true"
              />
              ~/jayharron/about
            </span>
            <span className="text-emerald-400">● online</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            About Me
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ubuntu-warm-grey">
            Software Developer in Cebu, Philippines, building web and cloud
            products for teams in the United States. Below is the short version
            of how I got here and what I am good at.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="border border-white/10 bg-black/20 p-4">
            <div className="flex items-start gap-3">
              <img
                className="h-20 w-20 shrink-0 rounded-md object-cover"
                src={myselfPhoto}
                alt="Jayharron Mar Abejar"
              />
              <div className="min-w-0">
                <h2 className="text-lg font-bold leading-tight text-white">
                  Jayharron Mar Abejar
                </h2>
                <p className="mt-1 text-sm text-ubuntu-orange">
                  Software Developer
                </p>
                <p className="text-xs text-ubuntu-warm-grey">
                  Full Stack | DevOps
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-slate-300">
              <p>
                I was born and raised in the Philippines and now work remotely
                with clients in the United States. My day job is .NET and React
                applications shipped to Microsoft Azure and Vercel, usually the
                kind that carry a decade of business rules and cannot afford a
                bad release. A good share of my work is modernization: taking
                something old and load bearing and rewriting it into a system
                the next engineer can actually read.
              </p>
              <p className="mt-3">
                Lately I have been spending more time on what happens after the
                merge. I run Azure DevOps pipelines and Key Vault for my current
                client, and I sit down with the infrastructure and DBA teams to
                plan how a secured application actually reaches production.
                That work is pulling me toward an Azure DevOps and cloud role,
                and I am leaning into it.
              </p>
              <p className="mt-3">
                What I care about beyond the stack is the part clients feel
                later. Releases that are boring on purpose, security handled at
                the pipeline instead of in a panic, and a codebase that has not
                turned hostile by its second year.
              </p>
              <p className="mt-3">
                Game development is where I learned to ship to real users. Since
                2020 I have built and sold Minecraft server plugins, and my most
                popular one, Custom Enchantments, passed 300,000 downloads. It
                taught me release cadence, support, and documentation long
                before any job title did.
              </p>
              <p className="mt-3">
                Away from software I build things with my hands. Arduino and
                Raspberry Pi projects, solar home setups, and anything that
                starts from raw parts. When I need a reset, I take it up a
                mountain rather than to a beach.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="border border-white/10 p-2">
                <p className="text-ubuntu-orange">focus</p>
                <p className="mt-1 text-slate-300">.NET, React, Azure DevOps</p>
              </div>
              <div className="border border-white/10 p-2">
                <p className="text-ubuntu-orange">location</p>
                <p className="mt-1 text-slate-300">Cebu, PH</p>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-xs text-ubuntu-warm-grey">
              <span className="text-ubuntu-orange">$</span>
              <span>cat experience.log</span>
            </div>
            <div className="space-y-3">
              {experiences.map((experience) => (
                <article
                  key={`${experience.company_name}-${experience.title}`}
                  className="border border-white/10 bg-black/20 p-3"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <img
                      src={experience.icon}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-md object-contain"
                      style={{
                        backgroundColor: experience.iconBg || "transparent",
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <a
                        href={experience.company_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() =>
                          trackClick(null, {
                            action: CLICK_ACTIONS.EXTERNAL,
                            label: experience.company_name,
                            target: experience.company_url,
                          })
                        }
                        className="break-words text-sm font-bold text-ubuntu-orange hover:text-ubuntu-orange-light"
                      >
                        {experience.company_name}
                      </a>
                      <p className="mt-1 break-words text-sm text-white">
                        {experience.title}
                      </p>
                      {experience.title_note && (
                        <p className="mt-1 text-xs text-emerald-300">
                          <i
                            className="fa-solid fa-arrow-trend-up pr-1.5"
                            aria-hidden="true"
                          />
                          {experience.title_note}
                        </p>
                      )}
                      <p className="mt-1 break-words text-xs text-ubuntu-warm-grey">
                        {experience.date} | {experience.job_type}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-300">
                    {experience.points.slice(0, 3).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2 text-xs text-ubuntu-warm-grey">
            <span className="text-ubuntu-orange">$</span>
            <span>cat education.log</span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {educationalAttainment.map((school) => (
              <article
                key={`${school.school}-${school.year}`}
                className="border border-white/10 bg-black/20 p-3"
              >
                <p className="text-sm font-bold text-white">{school.school}</p>
                <p className="mt-2 text-xs leading-5 text-slate-300">
                  {school.curriculum}
                </p>
                <p className="mt-2 text-xs text-ubuntu-warm-grey">
                  {school.year}
                  {school.graduationDate &&
                    ` | Graduated ${school.graduationDate}`}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

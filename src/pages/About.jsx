import { experiences, educationalAttainment } from "../constants";
import { myselfPhoto } from "../assets/icons";

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
          <p className="mt-2 text-sm leading-6 text-ubuntu-warm-grey">
            Software engineer based in Cebu, Philippines, building practical web
            and cloud experiences.
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
                  Software Engineer
                </p>
                <p className="text-xs text-ubuntu-warm-grey">
                  DevOps | Azure | Cloud
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-slate-300">
              <p>
                I was born and raised in the Philippines, and today I work
                remotely as a Software Engineer with clients in the United
                States. My technical background includes building applications
                with .NET and React, and managing deployments through platforms
                like Microsoft Azure and Vercel. Beyond the tools and
                frameworks, what drives me is the joy of creating,
                problem-solving, and continuous learning.
              </p>
              <p className="mt-3">
                My interests extend well beyond software. I am a hands-on DIY
                enthusiast, whether I am experimenting with IoT devices using
                Arduino and Raspberry Pi, setting up solar home systems, or
                tackling projects that let me build from the ground up.
              </p>
              <p className="mt-3">
                Outside of work, I recharge by heading outdoors. I have always
                preferred mountains over beaches. The climb, the quiet, and the
                view offer a reset that no screen can match.
              </p>
              <p className="mt-3">
                On the creative side, I have built a niche in game development.
                Since 2020, I have developed and sold several Minecraft plugins.
                My most popular project, Custom Enchantments, has reached over
                300,000 downloads and 100+ sales. What began as a fun experiment
                became a rewarding venture that connected me with a global
                community of players and creators.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="border border-white/10 p-2">
                <p className="text-ubuntu-orange">focus</p>
                <p className="mt-1 text-slate-300">Web & cloud</p>
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
                        className="break-words text-sm font-bold text-ubuntu-orange hover:text-ubuntu-orange-light"
                      >
                        {experience.company_name}
                      </a>
                      <p className="mt-1 break-words text-sm text-white">
                        {experience.title}
                      </p>
                      <p className="mt-1 break-words text-xs text-ubuntu-warm-grey">
                        {experience.date} | {experience.job_type}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-300">
                    {experience.points.slice(0, 2).map((point) => (
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

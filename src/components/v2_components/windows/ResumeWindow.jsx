import React from "react";
import {
  skills,
  experiences,
  educationalAttainment,
  certifications,
} from "../../../constants";

function ResumeWindow() {
  return (
    <div className="w-full bg-ubuntu-aubergine-dark text-white p-4 pb-14 font-ubuntu">
      <h2 className="text-white text-xl font-semibold mb-4 border-l-4 border-ubuntu-orange pl-3">
        My Skills
      </h2>
      <p className="text-slate-400 text-sm mb-4">
        Technologies I use and the years I have worked with them.
      </p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {skills.map((skill, index) => (
          <div
            key={`${skill.name}-${index}`}
            className="bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-xl p-3 flex items-center gap-3 hover:border-ubuntu-orange/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0F172A] flex items-center justify-center">
              <img
                src={skill.imageUrl}
                alt={skill.name}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {skill.name}
              </p>
              <p className="text-slate-400 text-xs">
                {skill.type} · {skill.years} yr{skill.years === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-white text-xl font-semibold mb-2 border-l-4 border-ubuntu-orange pl-3">
          Certifications
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          Selected training and certifications.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {certifications
            .filter((c) => !c.link)
            .map((cert, idx) => (
              <div
                key={`cert-${idx}`}
                className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-xl p-3 flex flex-col items-center text-center"
              >
                <img
                  src={cert.imageUrl}
                  alt={cert.name}
                  className="w-16 h-16 object-contain mb-2"
                />
                <p className="text-white font-semibold text-sm">{cert.name}</p>
                <p className="text-slate-400 text-xs">{cert.dateIssued}</p>
              </div>
            ))}
        </div>

        {certifications.find((c) => c.link) && (
          <div className="mt-4">
            <h3 className="text-white font-semibold mb-2">
              Verified Certifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {certifications
                .filter((c) => c.link)
                .map((cert, idx) => (
                  <a
                    key={`cert-link-${idx}`}
                    href={cert.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-4 bg-[rgba(255,255,255,0.02)] p-3 rounded-xl border border-white/10 hover:border-ubuntu-orange/50 transition-colors"
                  >
                    <img
                      src={cert.imageUrl}
                      alt={cert.name}
                      className="w-20 h-20 object-contain"
                    />
                    <div>
                      <p className="text-white font-semibold">{cert.name}</p>
                      <p className="text-slate-400 text-sm">
                        {cert.dateIssued}
                      </p>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-white text-xl font-semibold mb-4 border-l-4 border-ubuntu-orange pl-3">
            Professional Experience
          </h2>

          <div className="space-y-3">
            {experiences.map((experience, index) => (
              <div
                key={`${experience.company_name}-${index}`}
                className="bg-[rgba(0,0,0,0.2)] border-2 border-white/10 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center"
                    style={{
                      backgroundColor:
                        experience.iconBg || "rgba(255,255,255,0.1)",
                    }}
                  >
                    <img
                      src={experience.icon}
                      alt={experience.company_name}
                      className="w-[60%] h-[60%] object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      onClick={() =>
                        window.open(experience?.company_url, "_blank")
                      }
                      className="text-ubuntu-orange font-bold text-lg hover:cursor-pointer hover:text-ubuntu-orange-light"
                    >
                      {experience.company_name}
                    </h3>
                    <p className="text-white font-medium">{experience.title}</p>
                    <p className="text-slate-400 text-sm">{experience.date}</p>
                    <p className="text-red-300 text-xs mt-1">
                      {experience.job_type}
                    </p>
                  </div>
                </div>

                <ul className="list-disc ml-5 mt-3 space-y-1 text-slate-200 text-sm">
                  {experience.points.map((point, pointIndex) => (
                    <li key={pointIndex}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h2 className="text-white text-xl font-semibold mb-3 border-l-4 border-ubuntu-orange pl-3">
              Education
            </h2>
            <div className="space-y-3">
              {educationalAttainment.map((school, index) => (
                <div
                  key={`${school.school}-${index}`}
                  className="bg-[rgba(255,255,255,0.03)] p-4 rounded-md border-b-4 border-b-ubuntu-orange shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={school.logo}
                      alt={school.school}
                    />
                    <h3 className="font-bold text-lg">{school.school}</h3>
                  </div>
                  <div className="px-2 pt-3">
                    <p className="text-slate-200 text-sm leading-5">
                      {school.curriculum}
                    </p>
                    <p className="text-slate-400 text-sm mt-2">
                      Year:{" "}
                      <span className="text-yellow-400">{school.year}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeWindow;

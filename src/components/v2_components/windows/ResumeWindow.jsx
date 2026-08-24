import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { jsPDF } from "jspdf";
import {
  skills,
  experiences,
  educationalAttainment,
  certifications,
  resumeProfile,
} from "../../../constants";

const PDF_CONFIG = {
  fileName: "jayharron-mar-abejar-resume.pdf",
  title: resumeProfile.name,
  subtitle: resumeProfile.title,
  sections: ["summary", "skills", "experience", "education", "certifications"],
  summary: resumeProfile.summary,
};

function downloadResumePdf() {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 16;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let y = margin;

  const ensureSpace = (height) => {
    if (y + height > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  };
  const addText = (text, size = 10, options = {}) => {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", options.bold ? "bold" : "normal");
    const lines = pdf.splitTextToSize(text, pageWidth - margin * 2);
    ensureSpace(lines.length * (size * 0.45) + 2);
    pdf.text(lines, margin, y);
    y += lines.length * (size * 0.45) + (options.gap ?? 3);
  };
  const addSection = (heading) => {
    ensureSpace(12);
    y += 3;
    pdf.setDrawColor(233, 84, 32);
    pdf.line(margin, y, margin + 5, y);
    addText(heading.toUpperCase(), 11, { bold: true, gap: 4 });
  };

  pdf.setTextColor(35, 35, 35);
  addText(resumeProfile.name, 21, { bold: true, gap: 2 });
  addText(resumeProfile.title, 11, { gap: 5 });

  PDF_CONFIG.sections.forEach((section) => {
    if (section === "summary") {
      addSection("Profile");
      addText(resumeProfile.summary);
    }
    if (section === "skills") {
      addSection("Skills");
      addText(
        skills.map((skill) => `${skill.name} (${skill.type})`).join("  |  "),
      );
    }
    if (section === "experience") {
      addSection("Professional Experience");
      experiences.forEach((experience) => {
        addText(`${experience.title} - ${experience.company_name}`, 10, {
          bold: true,
          gap: 1,
        });
        addText(`${experience.date} | ${experience.job_type}`, 9, { gap: 1 });
        experience.points.forEach((point) =>
          addText(`- ${point}`, 9, { gap: 1 }),
        );
        y += 2;
      });
    }
    if (section === "education") {
      addSection("Education");
      educationalAttainment.forEach((school) => {
        addText(`${school.curriculum} - ${school.school}`, 10, {
          bold: true,
          gap: 1,
        });
        addText(
          `${school.year}${school.graduationDate ? ` | Graduated ${school.graduationDate}` : ""}`,
          9,
        );
      });
    }
    if (section === "certifications") {
      addSection("Certifications");
      certifications.forEach((cert) =>
        addText(`${cert.name} - ${cert.dateIssued}`, 9, { gap: 1 }),
      );
    }
  });

  pdf.save(PDF_CONFIG.fileName);
}

function ResumeWindow() {
  const [selectedDiploma, setSelectedDiploma] = useState(null);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedDiploma(null);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="relative w-full bg-ubuntu-aubergine-dark text-white p-4 pb-14 font-ubuntu">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-white text-2xl font-bold">
            {resumeProfile.name}
          </h1>
          <p className="text-slate-400 text-sm">{resumeProfile.title}</p>
        </div>
        <button
          type="button"
          onClick={downloadResumePdf}
          className="inline-flex items-center gap-2 rounded-md bg-ubuntu-orange px-3 py-2 text-sm font-semibold text-white hover:bg-ubuntu-orange-light transition-colors"
          title="Download a simple PDF version of this resume"
        >
          <i className="fa-solid fa-file-arrow-down" aria-hidden="true" />
          Download PDF
        </button>
      </div>
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
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
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
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {certifications
                .filter((c) => c.link)
                .map((cert, idx) => (
                  <a
                    key={`cert-link-${idx}`}
                    href={cert.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full min-w-0 flex-row items-center gap-3 bg-[rgba(255,255,255,0.02)] p-3 rounded-xl border border-white/10 hover:border-ubuntu-orange/50 transition-colors"
                  >
                    <img
                      src={cert.imageUrl}
                      alt={cert.name}
                      className="h-20 w-20 shrink-0 object-contain"
                    />
                    <div className="min-w-0 w-full">
                      <p className="break-words text-white font-semibold [overflow-wrap:anywhere]">
                        {cert.name}
                      </p>
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
                    {school.graduationDate && (
                      <p className="text-slate-400 text-sm mt-1">
                        Graduated:{" "}
                        <span className="text-yellow-400">
                          {school.graduationDate}
                        </span>
                      </p>
                    )}
                  </div>
                  {school.diploma && (
                    <button
                      type="button"
                      onClick={() => setSelectedDiploma(school)}
                      className="mt-3 inline-flex items-center gap-2 rounded-md border border-ubuntu-orange/60 px-3 py-2 text-sm font-semibold text-ubuntu-orange hover:bg-ubuntu-orange hover:text-white transition-colors"
                      title={`Show ${school.school} diploma`}
                    >
                      <i className="fa-solid fa-eye" aria-hidden="true" />
                      Show deploma
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {selectedDiploma &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/80 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedDiploma.school} diploma`}
            onClick={() => setSelectedDiploma(null)}
          >
            <div
              className="relative max-h-full max-w-5xl overflow-auto rounded-lg bg-slate-900 p-3 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedDiploma(null)}
                className="absolute right-5 top-5 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-ubuntu-orange"
                title="Close diploma"
                aria-label="Close diploma"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
              <img
                src={selectedDiploma.diploma}
                alt={`${selectedDiploma.school} diploma`}
                className="max-h-[calc(100vh-3rem)] max-w-full object-contain"
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default ResumeWindow;

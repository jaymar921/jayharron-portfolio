import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { jsPDF } from "jspdf";
import {
  skills,
  experiences,
  educationalAttainment,
  certifications,
  resumeProfile,
  resumeContact,
  resumeSkillGroups,
  resumeProjects,
  resumeCertifications,
} from "../../../constants";
import { CLICK_ACTIONS, trackClick } from "../../../lib/analytics";

const PDF_FILE_NAME = "jayharron-mar-abejar-resume.pdf";

const PDF_COLORS = {
  text: [31, 41, 55],
  muted: [100, 110, 125],
  accent: [233, 84, 32],
  rule: [215, 218, 224],
};

function downloadResumePdf() {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 18;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  const bottomLimit = pageHeight - margin - 6; // leaves room for the footer
  let y = margin;

  // Line height in mm for a font size in pt, with a little leading.
  const lineHeight = (size) => size * 0.43;

  const setFont = (size, style = "normal", color = PDF_COLORS.text) => {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", style);
    pdf.setTextColor(...color);
  };
  const ensureSpace = (height) => {
    if (y + height > bottomLimit) {
      pdf.addPage();
      y = margin;
    }
  };
  const paragraph = (text, { size = 9.5, x = margin, width = contentWidth, color } = {}) => {
    setFont(size, "normal", color);
    const lines = pdf.splitTextToSize(text, width);
    lines.forEach((line) => {
      ensureSpace(lineHeight(size));
      pdf.text(line, x, y);
      y += lineHeight(size);
    });
  };
  const bullet = (text) => {
    const indent = 4.5;
    // Keep a bullet on one page instead of stranding its last line.
    setFont(9.5);
    const lineCount = pdf.splitTextToSize(text, contentWidth - indent).length;
    ensureSpace(lineHeight(9.5) * lineCount);
    pdf.setFillColor(...PDF_COLORS.accent);
    pdf.circle(margin + 1.4, y - 1.15, 0.55, "F");
    paragraph(text, { x: margin + indent, width: contentWidth - indent });
    y += 0.6;
  };
  // Renders "a | b | c" style runs that wrap onto a new line when a piece
  // would overflow. Pieces with a `url` become clickable links.
  const inlineRow = (pieces, size = 9) => {
    const separator = "   |   ";
    setFont(size);
    const sepWidth = pdf.getTextWidth(separator);
    let x = margin;
    pieces.forEach((piece, index) => {
      const width = pdf.getTextWidth(piece.text);
      if (index > 0 && x + sepWidth + width > margin + contentWidth) {
        x = margin;
        y += lineHeight(size) + 0.6;
      } else if (index > 0) {
        setFont(size, "normal", PDF_COLORS.rule);
        pdf.text(separator, x, y);
        x += sepWidth;
      }
      setFont(size, "normal", piece.url ? PDF_COLORS.text : PDF_COLORS.muted);
      if (piece.url) pdf.textWithLink(piece.text, x, y, { url: piece.url });
      else pdf.text(piece.text, x, y);
      x += width;
    });
    y += lineHeight(size);
  };
  const section = (heading) => {
    ensureSpace(16);
    y += 4.5;
    setFont(10.5, "bold", PDF_COLORS.accent);
    pdf.text(heading.toUpperCase(), margin, y, { charSpace: 0.4 });
    y += 1.8;
    pdf.setDrawColor(...PDF_COLORS.rule);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 4.8;
  };
  // Bold title on the left with a muted date pinned to the right margin.
  const headingRow = (left, right, url) => {
    setFont(10.5, "bold");
    if (url) pdf.textWithLink(left, margin, y, { url });
    else pdf.text(left, margin, y);
    if (right) {
      setFont(9, "normal", PDF_COLORS.muted);
      pdf.text(right, pageWidth - margin, y, { align: "right" });
    }
    y += lineHeight(10.5);
  };

  // Header
  setFont(24, "bold");
  pdf.text(resumeProfile.name, margin, y + 4);
  y += 11.5;
  setFont(12, "bold", PDF_COLORS.accent);
  pdf.text(resumeProfile.title, margin, y);
  const titleWidth = pdf.getTextWidth(resumeProfile.title);
  setFont(12, "normal", PDF_COLORS.muted);
  pdf.text(resumeProfile.tagline, margin + titleWidth + 4, y);
  y += 7;

  // Contact details live in the exported PDF only, never in the site UI.
  inlineRow([
    { text: resumeContact.email, url: `mailto:${resumeContact.email}` },
    { text: resumeContact.location },
    { text: resumeContact.portfolio, url: resumeContact.portfolio },
  ]);
  y += 0.6;
  inlineRow([
    { text: resumeContact.github, url: resumeContact.github },
    { text: resumeContact.linkedin, url: resumeContact.linkedin },
  ]);
  y += 2.5;
  pdf.setDrawColor(...PDF_COLORS.accent);
  pdf.setLineWidth(0.8);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 1;

  section("Summary");
  paragraph(resumeProfile.summary);

  section("Skills");
  const labelWidth = 38;
  resumeSkillGroups.forEach((group) => {
    ensureSpace(lineHeight(9.5));
    setFont(9.5, "bold");
    pdf.text(group.label, margin, y);
    paragraph(group.items.join(", "), {
      x: margin + labelWidth,
      width: contentWidth - labelWidth,
    });
    y += 0.8;
  });

  section("Experience");
  experiences.forEach((experience, index) => {
    // Keep the role header with at least its first bullet.
    ensureSpace(lineHeight(10.5) + lineHeight(9) + lineHeight(9.5) * 2 + 2);
    headingRow(experience.title, experience.date);
    setFont(9.5, "normal", PDF_COLORS.accent);
    pdf.textWithLink(experience.company_name, margin, y, {
      url: experience.company_url,
    });
    const companyWidth = pdf.getTextWidth(experience.company_name);
    setFont(9, "normal", PDF_COLORS.muted);
    const jobType = `  |  ${experience.job_type}`;
    pdf.text(jobType, margin + companyWidth, y);
    if (experience.projects_url) {
      const linkX = margin + companyWidth + pdf.getTextWidth(jobType);
      pdf.text("  |  Projects: ", linkX, y);
      setFont(9, "normal", PDF_COLORS.accent);
      pdf.textWithLink(
        experience.projects_label,
        linkX + pdf.getTextWidth("  |  Projects: "),
        y,
        { url: experience.projects_url },
      );
    }
    y += lineHeight(9) + 1.4;
    experience.points.forEach(bullet);
    if (index < experiences.length - 1) y += 2.6;
  });

  section("Selected Projects");
  resumeProjects.forEach((project, index) => {
    ensureSpace(lineHeight(10.5) + lineHeight(9.5) * 2);
    headingRow(project.name, null, project.link);
    paragraph(project.description);
    setFont(8.5, "normal", PDF_COLORS.muted);
    pdf.textWithLink(project.link, margin, y, { url: project.link });
    y += lineHeight(8.5);
    if (index < resumeProjects.length - 1) y += 2.2;
  });

  section("Education");
  educationalAttainment
    .filter((school) => school.onResume)
    .forEach((school) => {
      ensureSpace(lineHeight(10.5) + lineHeight(9.5));
      headingRow(
        school.curriculum.replace(/^(Course|Strand):\s*/, ""),
        school.graduationDate ? `Graduated ${school.graduationDate}` : school.year,
      );
      paragraph(school.school, { color: PDF_COLORS.muted });
    });

  section("Certifications");
  resumeCertifications.forEach(bullet);

  // Footer on every page, drawn last so the page count is known.
  const pageCount = pdf.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    pdf.setPage(page);
    setFont(8, "normal", PDF_COLORS.muted);
    pdf.text(resumeProfile.name, margin, pageHeight - margin + 4);
    pdf.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - margin + 4, {
      align: "right",
    });
  }

  pdf.save(PDF_FILE_NAME);
}

const SECTION_HEADING =
  "text-white text-xl font-semibold border-l-4 border-ubuntu-orange pl-3";

function ResumeWindow() {
  const [preview, setPreview] = useState(null);
  const [showCertifications, setShowCertifications] = useState(false);

  // Certificates I hold a copy of open in the preview modal; the ones backed by
  // an external verification page link straight out to it.
  const { gallery, verified } = useMemo(() => {
    return {
      gallery: certifications.filter((cert) => !cert.link),
      verified: certifications.filter((cert) => cert.link),
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setPreview(null);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="relative w-full bg-ubuntu-aubergine-dark text-white p-4 pb-14 font-ubuntu">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-white text-2xl font-bold">
            {resumeProfile.name}
          </h1>
          <p className="text-sm">
            <span className="font-semibold text-ubuntu-orange">
              {resumeProfile.title}
            </span>
            <span className="text-slate-400"> · {resumeProfile.tagline}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            trackClick(null, { action: CLICK_ACTIONS.DOWNLOAD, label: "Resume PDF" });
            downloadResumePdf();
          }}
          className="inline-flex items-center gap-2 rounded-md bg-ubuntu-orange px-3 py-2 text-sm font-semibold text-white hover:bg-ubuntu-orange-light transition-colors"
          title="Download this resume as a PDF, including contact details"
        >
          <i className="fa-solid fa-file-arrow-down" aria-hidden="true" />
          Download PDF
        </button>
      </div>

      <p className="mb-8 max-w-3xl border-l-2 border-white/10 pl-3 text-sm leading-6 text-slate-300">
        {resumeProfile.summary}
      </p>

      <h2 className={SECTION_HEADING}>Skills</h2>
      <p className="text-slate-400 text-sm mb-4 mt-2">
        The stack I reach for, and how long I have been shipping with it.
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
        <button
          type="button"
          onClick={() => setShowCertifications((open) => !open)}
          aria-expanded={showCertifications}
          aria-controls="certifications-panel"
          className="group flex w-full items-center gap-3 rounded-lg border border-white/10 bg-[rgba(255,255,255,0.03)] p-3 text-left transition-colors hover:border-ubuntu-orange/50"
        >
          <i
            className={`fa-solid fa-chevron-right text-ubuntu-orange transition-transform duration-200 ${
              showCertifications ? "rotate-90" : ""
            }`}
            aria-hidden="true"
          />
          <span className="flex-1 min-w-0">
            <span className="block text-white text-lg font-semibold">
              Certifications
            </span>
            <span className="block text-slate-400 text-xs">
              Security, secure development, and professional training
            </span>
          </span>
          <span className="rounded-full bg-ubuntu-orange/20 px-2.5 py-1 text-xs font-semibold text-ubuntu-orange">
            {certifications.length}
          </span>
          <span className="hidden text-xs text-slate-400 group-hover:text-white sm:inline">
            {showCertifications ? "Hide" : "Show"}
          </span>
        </button>

        {showCertifications && (
          <div id="certifications-panel" className="mt-4 space-y-5">
            {gallery.length > 0 && (
              <div>
                <h3 className="text-white font-semibold text-sm mb-2">
                  Certificates ({gallery.length})
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {gallery.map((cert) => (
                    <button
                      key={cert.name}
                      type="button"
                      onClick={() => {
                        trackClick(null, { action: CLICK_ACTIONS.PREVIEW, label: cert.name });
                        setPreview({ src: cert.imageUrl, title: cert.name });
                      }}
                      className="group flex flex-col rounded-xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-3 text-left transition-colors hover:border-ubuntu-orange/50"
                      title={`View ${cert.name}`}
                    >
                      <span className="mb-3 flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-white/5">
                        <img
                          src={cert.imageUrl}
                          alt={cert.name}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                        />
                      </span>
                      <span className="text-sm font-semibold text-white [overflow-wrap:anywhere]">
                        {cert.name}
                      </span>
                      <span className="mt-1 text-xs text-slate-400">
                        {cert.issuer ? `${cert.issuer} · ` : ""}
                        {cert.dateIssued}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {verified.length > 0 && (
              <div>
                <h3 className="text-white font-semibold text-sm mb-2">
                  Verified credentials ({verified.length})
                </h3>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {verified.map((cert) => (
                    <a
                      key={cert.name}
                      href={cert.link}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() =>
                        trackClick(null, {
                          action: CLICK_ACTIONS.EXTERNAL,
                          label: cert.name,
                          target: cert.link,
                        })
                      }
                      className="flex w-full min-w-0 flex-row items-center gap-3 rounded-xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-3 transition-colors hover:border-ubuntu-orange/50"
                    >
                      <img
                        src={cert.imageUrl}
                        alt=""
                        className="h-16 w-16 shrink-0 object-contain"
                      />
                      <div className="min-w-0 w-full">
                        <p className="font-semibold text-white [overflow-wrap:anywhere]">
                          {cert.name}
                        </p>
                        <p className="text-sm text-slate-400">
                          {cert.issuer ? `${cert.issuer} · ` : ""}
                          {cert.dateIssued}
                        </p>
                      </div>
                      <i
                        className="fa-solid fa-arrow-up-right-from-square shrink-0 text-ubuntu-orange"
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8">
          <h2 className={SECTION_HEADING}>Professional Experience</h2>

          <div className="space-y-3 mt-4">
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
                      onClick={() => {
                        trackClick(null, {
                          action: CLICK_ACTIONS.EXTERNAL,
                          label: experience.company_name,
                          target: experience?.company_url,
                        });
                        window.open(experience?.company_url, "_blank");
                      }}
                      className="text-ubuntu-orange font-bold text-lg hover:cursor-pointer hover:text-ubuntu-orange-light"
                    >
                      {experience.company_name}
                    </h3>
                    <p className="text-white font-medium">{experience.title}</p>
                    <p className="text-slate-400 text-sm">{experience.date}</p>
                    <p className="text-red-300 text-xs mt-1">
                      {experience.job_type}
                    </p>
                    {experience.projects_url && (
                      <a
                        href={experience.projects_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() =>
                          trackClick(null, {
                            action: CLICK_ACTIONS.EXTERNAL,
                            label: experience.projects_label,
                            target: experience.projects_url,
                          })
                        }
                        className="mt-1 inline-flex items-center gap-1 text-xs text-ubuntu-orange hover:text-ubuntu-orange-light"
                      >
                        Projects on {experience.projects_label}
                        <i
                          className="fa-solid fa-arrow-up-right-from-square"
                          aria-hidden="true"
                        />
                      </a>
                    )}
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
            <h2 className={SECTION_HEADING}>Education</h2>
            <div className="space-y-3 mt-3">
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
                      onClick={() => {
                        trackClick(null, {
                          action: CLICK_ACTIONS.PREVIEW,
                          label: `${school.school} diploma`,
                        });
                        setPreview({
                          src: school.diploma,
                          title: `${school.school} diploma`,
                        });
                      }}
                      className="mt-3 inline-flex items-center gap-2 rounded-md border border-ubuntu-orange/60 px-3 py-2 text-sm font-semibold text-ubuntu-orange hover:bg-ubuntu-orange hover:text-white transition-colors"
                      title={`Show ${school.school} diploma`}
                    >
                      <i className="fa-solid fa-eye" aria-hidden="true" />
                      Show diploma
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {preview &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black/80 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={preview.title}
            onClick={() => setPreview(null)}
          >
            <div
              className="relative max-h-full max-w-5xl overflow-auto rounded-lg bg-slate-900 p-3 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="absolute right-5 top-5 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white hover:bg-ubuntu-orange"
                title="Close preview"
                aria-label="Close preview"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
              <img
                src={preview.src}
                alt={preview.title}
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

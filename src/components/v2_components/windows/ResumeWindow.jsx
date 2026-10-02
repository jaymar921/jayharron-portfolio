import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { jsPDF } from "jspdf";
import {
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

const PDF_FILE_NAME = "jayharron-mar-abejar-cv.pdf";

const PDF_COLORS = {
  text: [31, 41, 55],
  muted: [100, 110, 125],
  accent: [233, 84, 32],
  rule: [215, 218, 224],
};

// Portrait size on the PDF, in mm. Matches the 4:5 crop of the source photo.
const PDF_PHOTO = { width: 30, height: 37.5 };

// jsPDF misreads an <img> element handed to it directly, so the photo is
// redrawn on a canvas and passed in as a JPEG data URL instead.
function loadImageAsJpeg(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext("2d").drawImage(image, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    image.onerror = reject;
    image.src = src;
  });
}

async function downloadCvPdf() {
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

  // Header: name, title and labeled contact lines on the left, portrait on
  // the right. Labels make each line scannable without reading the value.
  const photoX = pageWidth - margin - PDF_PHOTO.width;
  const headerTop = y;
  try {
    const photo = await loadImageAsJpeg(resumeProfile.photo);
    pdf.addImage(photo, "JPEG", photoX, headerTop, PDF_PHOTO.width, PDF_PHOTO.height);
    pdf.setDrawColor(...PDF_COLORS.rule);
    pdf.setLineWidth(0.3);
    pdf.rect(photoX, headerTop, PDF_PHOTO.width, PDF_PHOTO.height);
  } catch {
    // A missing photo should never block the download.
  }

  setFont(22, "bold");
  pdf.text(resumeProfile.name, margin, y + 5);
  y += 12;
  setFont(12, "bold", PDF_COLORS.accent);
  pdf.text(resumeProfile.title, margin, y);
  const titleWidth = pdf.getTextWidth(resumeProfile.title);
  setFont(12, "normal", PDF_COLORS.muted);
  pdf.text(resumeProfile.tagline, margin + titleWidth + 4, y);
  y += 6.5;

  // Contact details live in the exported PDF only, never in the site UI.
  const contactLines = [
    { label: "Email", text: resumeContact.email, url: `mailto:${resumeContact.email}` },
    { label: "Location", text: resumeContact.location },
    { label: "Portfolio", text: resumeContact.portfolio, url: resumeContact.portfolio },
    { label: "GitHub", text: resumeContact.github, url: resumeContact.github },
    { label: "LinkedIn", text: resumeContact.linkedin, url: resumeContact.linkedin },
  ];
  contactLines.forEach((line) => {
    setFont(8.5, "bold", PDF_COLORS.muted);
    pdf.text(line.label, margin, y);
    setFont(9, "normal", PDF_COLORS.text);
    if (line.url) pdf.textWithLink(line.text, margin + 18, y, { url: line.url });
    else pdf.text(line.text, margin + 18, y);
    y += lineHeight(9) + 0.3;
  });

  y = Math.max(y, headerTop + PDF_PHOTO.height) + 3;
  pdf.setDrawColor(...PDF_COLORS.accent);
  pdf.setLineWidth(0.8);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 1;

  section("Professional Summary");
  paragraph(resumeProfile.summary);

  section("Work Experience");
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

  section("Technical Skills");
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

  section("Education");
  educationalAttainment
    .filter((school) => school.onResume)
    .forEach((school) => {
      ensureSpace(lineHeight(10.5) + lineHeight(9.5));
      headingRow(
        school.curriculum.replace(/^(Course|Strand):\s*/, ""),
        school.graduationDate ? `Graduated ${school.graduationDate}` : school.year,
      );
      paragraph(`${school.school}  |  ${school.year}`, { color: PDF_COLORS.muted });
    });

  section("Certifications");
  resumeCertifications.forEach(bullet);

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

  // Footer on every page, drawn last so the page count is known.
  const pageCount = pdf.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    pdf.setPage(page);
    setFont(8, "normal", PDF_COLORS.muted);
    pdf.text(`${resumeProfile.name}  |  Curriculum Vitae`, margin, pageHeight - margin + 4);
    pdf.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - margin + 4, {
      align: "right",
    });
  }

  pdf.save(PDF_FILE_NAME);
}

// Ordered the way a recruiter reads a CV: who, what they did, what they know.
const CV_SECTIONS = [
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "projects", label: "Projects" },
];

const PUBLIC_LINKS = [
  { label: "Portfolio", icon: "fa-solid fa-globe", url: resumeContact.portfolio },
  { label: "GitHub", icon: "fa-brands fa-github", url: resumeContact.github },
  { label: "LinkedIn", icon: "fa-brands fa-linkedin", url: resumeContact.linkedin },
];

const SECTION_HEADING =
  "mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-ubuntu-orange after:h-px after:flex-1 after:bg-slate-200";

function ResumeWindow() {
  const [preview, setPreview] = useState(null);
  const [showCertificates, setShowCertificates] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const sectionRefs = useRef({});

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

  const jumpTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderSection = (id, title, children) => (
    <section
      id={`cv-${id}`}
      ref={(node) => {
        sectionRefs.current[id] = node;
      }}
      className="scroll-mt-16 pt-8 first:pt-0"
    >
      <h2 className={SECTION_HEADING}>{title}</h2>
      {children}
    </section>
  );

  const handleDownload = async () => {
    trackClick(null, { action: CLICK_ACTIONS.DOWNLOAD, label: "CV PDF" });
    setDownloading(true);
    try {
      await downloadCvPdf();
    } finally {
      setDownloading(false);
    }
  };

  const trackExternal = (label, target) =>
    trackClick(null, { action: CLICK_ACTIONS.EXTERNAL, label, target });

  return (
    <div className="relative min-h-full w-full bg-[#2b2b2b] font-ubuntu">
      {/* Toolbar: jump links for skimming, and the PDF download. */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-black/40 bg-ubuntu-panel/95 px-3 py-2 backdrop-blur">
        <nav
          aria-label="CV sections"
          className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none]"
        >
          {CV_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => jumpTo(section.id)}
              className="shrink-0 rounded px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {section.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-ubuntu-orange px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-ubuntu-orange-light disabled:opacity-60"
          title="Download this CV as a PDF, including contact details"
        >
          <i
            className={`fa-solid ${downloading ? "fa-spinner fa-spin" : "fa-file-arrow-down"}`}
            aria-hidden="true"
          />
          <span className="hidden sm:inline">Download</span> PDF
        </button>
      </div>

      {/* The CV sheet */}
      <article className="mx-auto my-4 max-w-4xl bg-white px-5 py-6 text-slate-700 shadow-2xl sm:my-6 sm:px-10 sm:py-10">
        <header className="flex flex-col-reverse gap-5 border-b-[3px] border-ubuntu-orange pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {resumeProfile.name}
            </h1>
            <p className="mt-1 text-base">
              <span className="font-semibold text-ubuntu-orange">
                {resumeProfile.title}
              </span>
              <span className="text-slate-500"> | {resumeProfile.tagline}</span>
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <i className="fa-solid fa-location-dot w-4 text-slate-400" aria-hidden="true" />
              {resumeContact.location}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
              {PUBLIC_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackExternal(link.label, link.url)}
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-ubuntu-orange"
                >
                  <i className={`${link.icon} w-4 text-slate-400`} aria-hidden="true" />
                  {link.label}
                </a>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Email is included in the PDF download.
            </p>
          </div>
          <img
            src={resumeProfile.photo}
            alt={`${resumeProfile.name}, graduation portrait`}
            className="h-36 w-28 shrink-0 rounded-md object-cover ring-1 ring-slate-200 sm:h-40 sm:w-32"
          />
        </header>

        <div className="pt-8">
          {renderSection("summary", "Professional Summary", (
            <p className="text-sm leading-7 text-slate-700">{resumeProfile.summary}</p>
          ))}

          {renderSection("experience", "Work Experience", (
            <div className="space-y-6">
              {experiences.map((experience, index) => (
                <div key={`${experience.company_name}-${index}`} className="flex gap-4">
                  <div
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md ring-1 ring-slate-200"
                    style={{ backgroundColor: experience.iconBg || "#F1F5F9" }}
                  >
                    <img
                      src={experience.icon}
                      alt=""
                      className="h-[65%] w-[65%] object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <h3 className="font-semibold text-slate-900">{experience.title}</h3>
                      <span className="shrink-0 text-xs font-medium text-slate-500">
                        {experience.date}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm">
                      <a
                        href={experience.company_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() =>
                          trackExternal(experience.company_name, experience.company_url)
                        }
                        className="font-medium text-ubuntu-orange hover:underline"
                      >
                        {experience.company_name}
                      </a>
                      <span className="text-slate-500"> | {experience.job_type}</span>
                      {experience.projects_url && (
                        <>
                          <span className="text-slate-500"> | </span>
                          <a
                            href={experience.projects_url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() =>
                              trackExternal(experience.projects_label, experience.projects_url)
                            }
                            className="text-slate-600 hover:text-ubuntu-orange"
                          >
                            Projects on {experience.projects_label}
                          </a>
                        </>
                      )}
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-6 text-slate-700 marker:text-ubuntu-orange">
                      {experience.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {renderSection("skills", "Technical Skills", (
            <dl className="divide-y divide-slate-100">
              {resumeSkillGroups.map((group) => (
                <div
                  key={group.label}
                  className="grid gap-1.5 py-2.5 first:pt-0 sm:grid-cols-[11rem_1fr] sm:gap-4"
                >
                  <dt className="text-sm font-semibold text-slate-900">{group.label}</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          ))}

          {renderSection("education", "Education", (
            <div className="space-y-4">
              {educationalAttainment.map((school, index) => (
                <div key={`${school.school}-${index}`} className="flex gap-4">
                  <img
                    className="mt-0.5 h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                    src={school.logo}
                    alt=""
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                      <h3 className="font-semibold text-slate-900">
                        {school.curriculum.replace(/^(Course|Strand):\s*/, "")}
                      </h3>
                      <span className="shrink-0 text-xs font-medium text-slate-500">
                        {school.year}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-600">{school.school}</p>
                    {school.graduationDate && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        Graduated {school.graduationDate}
                      </p>
                    )}
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
                        className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-ubuntu-orange hover:underline"
                        title={`Show ${school.school} diploma`}
                      >
                        <i className="fa-solid fa-eye" aria-hidden="true" />
                        View diploma
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {renderSection("certifications", "Certifications", (
            <>
              <ul className="list-disc space-y-1 pl-4 text-sm leading-6 text-slate-700 marker:text-ubuntu-orange">
                {resumeCertifications.map((cert) => (
                  <li key={cert}>{cert}</li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setShowCertificates((open) => !open)}
                aria-expanded={showCertificates}
                aria-controls="certificates-panel"
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-ubuntu-orange hover:underline"
              >
                <i
                  className={`fa-solid fa-chevron-right transition-transform duration-200 ${
                    showCertificates ? "rotate-90" : ""
                  }`}
                  aria-hidden="true"
                />
                {showCertificates ? "Hide" : "View"} all {certifications.length} certificates
              </button>

              {showCertificates && (
                <div id="certificates-panel" className="mt-4 space-y-4">
                  {gallery.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {gallery.map((cert) => (
                        <button
                          key={cert.name}
                          type="button"
                          onClick={() => {
                            trackClick(null, { action: CLICK_ACTIONS.PREVIEW, label: cert.name });
                            setPreview({ src: cert.imageUrl, title: cert.name });
                          }}
                          className="group flex flex-col rounded-md border border-slate-200 p-3 text-left transition-colors hover:border-ubuntu-orange/60"
                          title={`View ${cert.name}`}
                        >
                          <span className="mb-3 flex h-24 w-full items-center justify-center overflow-hidden rounded bg-slate-50">
                            <img
                              src={cert.imageUrl}
                              alt={cert.name}
                              loading="lazy"
                              className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                            />
                          </span>
                          <span className="text-sm font-semibold text-slate-900 [overflow-wrap:anywhere]">
                            {cert.name}
                          </span>
                          <span className="mt-1 text-xs text-slate-500">
                            {cert.issuer ? `${cert.issuer} | ` : ""}
                            {cert.dateIssued}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {verified.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      {verified.map((cert) => (
                        <a
                          key={cert.name}
                          href={cert.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => trackExternal(cert.name, cert.link)}
                          className="flex min-w-0 items-center gap-3 rounded-md border border-slate-200 p-3 transition-colors hover:border-ubuntu-orange/60"
                        >
                          <img
                            src={cert.imageUrl}
                            alt=""
                            className="h-12 w-12 shrink-0 object-contain"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900 [overflow-wrap:anywhere]">
                              {cert.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {cert.issuer ? `${cert.issuer} | ` : ""}
                              {cert.dateIssued}
                            </p>
                          </div>
                          <i
                            className="fa-solid fa-arrow-up-right-from-square shrink-0 text-xs text-ubuntu-orange"
                            aria-hidden="true"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ))}

          {renderSection("projects", "Selected Projects", (
            <div className="space-y-4">
              {resumeProjects.map((project) => (
                <div key={project.name}>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackExternal(project.name, project.link)}
                    className="inline-flex items-center gap-1.5 font-semibold text-slate-900 hover:text-ubuntu-orange"
                  >
                    {project.name}
                    <i
                      className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400"
                      aria-hidden="true"
                    />
                  </a>
                  <p className="mt-0.5 text-sm leading-6 text-slate-700">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </article>

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

/**
 * The one vocabulary of trackable things, shared by the browser and the server.
 *
 * The browser sends a page slug with every view and click; the server refuses
 * any slug that is not in here. Keeping both sides on this file means a typo in
 * a component fails loudly in development instead of quietly filling the
 * database with a page nobody can read back.
 *
 * A slug matches a route in App.jsx. The desktop at "/" is one page however
 * many windows are opened on it; opening a window is a click, not a view.
 */

export const PAGES = Object.freeze({
  HOME: "home",
  ABOUT: "about",
  PROJECTS: "projects",
  CONTACT: "contact",
  GRAPHIC2D: "graphic2d",
  PATH_FINDING: "path-finding-algorithms",
  HOME_V2: "v2",
});

export const PAGE_SLUGS = Object.freeze(Object.values(PAGES));

export const PAGE_LABELS = Object.freeze({
  [PAGES.HOME]: "Desktop",
  [PAGES.ABOUT]: "About",
  [PAGES.PROJECTS]: "Projects",
  [PAGES.CONTACT]: "Contact",
  [PAGES.GRAPHIC2D]: "Graphic 2D",
  [PAGES.PATH_FINDING]: "Path Finding",
  [PAGES.HOME_V2]: "Home v2",
});

/** Route path to slug, for the hook that records a view on navigation. */
export const PAGE_BY_PATH = Object.freeze({
  "/": PAGES.HOME,
  "/about": PAGES.ABOUT,
  "/projects": PAGES.PROJECTS,
  "/contact": PAGES.CONTACT,
  "/graphic2d": PAGES.GRAPHIC2D,
  "/projects/path-finding-algorithms": PAGES.PATH_FINDING,
  "/v2": PAGES.HOME_V2,
});

/**
 * What a click was for.
 *
 *   open      a desktop icon or dock button that opened a window
 *   external  a link that left the site (GitHub, LinkedIn, a project's site)
 *   download  the resume PDF
 *   preview   a certificate or diploma opened in the modal
 *   submit    the contact form
 */
export const CLICK_ACTIONS = Object.freeze({
  OPEN: "open",
  EXTERNAL: "external",
  DOWNLOAD: "download",
  PREVIEW: "preview",
  SUBMIT: "submit",
});

export const CLICK_ACTION_VALUES = Object.freeze(Object.values(CLICK_ACTIONS));

export function isPageSlug(value) {
  return typeof value === "string" && PAGE_SLUGS.includes(value);
}

export function isClickAction(value) {
  return typeof value === "string" && CLICK_ACTION_VALUES.includes(value);
}

export function labelFor(slug) {
  return PAGE_LABELS[slug] ?? slug;
}

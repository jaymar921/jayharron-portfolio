import { apiUrl } from "../api/client.js";
import { getSessionId, getVisitorId } from "./visitor.js";
import { isOwnerDevice } from "./owner.js";
import { CLICK_ACTIONS, PAGE_BY_PATH, isPageSlug } from "../../../shared/tracking.js";

/**
 * Sending a view or a click.
 *
 * Two rules shape everything here. Tracking must never delay a click, and it
 * must never break a page. So a click that opens a link fires the event with
 * sendBeacon, which the browser finishes on its own even as the tab navigates
 * away, and every failure is swallowed. A dropped event is a missing row in a
 * stats table. A thrown one is a button that stopped working.
 */

const ENABLED =
  typeof window !== "undefined" && import.meta.env.VITE_ANALYTICS_ENABLED !== "false";

/** The browser's own "do not track me" setting, respected rather than read past. */
function optedOut() {
  try {
    return (
      window.navigator.doNotTrack === "1" ||
      window.doNotTrack === "1" ||
      window.navigator.globalPrivacyControl === true
    );
  } catch {
    return false;
  }
}

/**
 * The owner's own browsers are stamped when they sign in to /admin, and
 * nothing they do on the site afterwards is counted. See owner.js.
 */
function shouldSend() {
  return ENABLED && !optedOut() && !isOwnerDevice();
}

/**
 * Where the visitor came from, as the browser knows it. The beacon's own
 * Referer header only ever names this page, so the real answer has to travel
 * in the body. It is sent even when empty, so the server can tell "arrived
 * direct" from "an old client that never said".
 */
function readReferrer() {
  try {
    return typeof document.referrer === "string" ? document.referrer.slice(0, 500) : "";
  } catch {
    return "";
  }
}

function baseFields() {
  return {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    path: window.location.pathname,
    referrer: readReferrer(),
  };
}

/**
 * sendBeacon first. It survives the page being navigated away from, which is
 * exactly what happens on a link that opens in the same tab, and the browser
 * queues it without holding anything up.
 *
 * The Blob is typed application/json so the server sees the right content
 * type; the API parses text/plain as JSON too, because some browsers relabel
 * a beacon body regardless.
 */
function send(path, payload) {
  const url = apiUrl(path);
  const body = JSON.stringify(payload);

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(url, blob)) return;
    }
  } catch {
    // Beacon refused the payload or is not available. Fall through to fetch.
  }

  try {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      // The response is not read, and the request must outlive the page on a
      // click that navigates. keepalive is what buys that for fetch.
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Offline, blocked by an extension, or no network at all. Not a problem
    // worth telling the visitor about.
  }
}

function warnUnknown(page) {
  if (import.meta.env.DEV) {
    console.warn(`[analytics] unknown page slug: ${page}`);
  }
}

/** Records that a page was opened. */
export function trackView(page) {
  if (!shouldSend()) return;

  if (!isPageSlug(page)) {
    warnUnknown(page);
    return;
  }

  send("/api/track/view", { page, ...baseFields() });
}

/**
 * The page the visitor is on right now, from the route. The About and
 * Projects components are drawn both inside a desktop window and as pages of
 * their own, so a click inside them cannot know its page at build time.
 */
export function currentPage() {
  try {
    return PAGE_BY_PATH[window.location.pathname] ?? null;
  } catch {
    return null;
  }
}

/**
 * Records a click on something worth counting.
 *
 * `label` is the button's own wording, so the stats can tell the GitHub link
 * from the LinkedIn one, and `target` is where it went. `page` may be null,
 * in which case it is read off the current route.
 */
export function trackClick(page, { action, label, target } = {}) {
  if (!shouldSend()) return;

  const resolved = page ?? currentPage();

  if (!isPageSlug(resolved)) {
    warnUnknown(resolved);
    return;
  }
  page = resolved;

  send("/api/track/click", {
    page,
    action: action ?? CLICK_ACTIONS.EXTERNAL,
    label: label ?? null,
    target: target ?? null,
    ...baseFields(),
  });
}

/**
 * Wraps a click handler so the event goes out and the original behaviour still
 * runs, even if the tracking call throws.
 *
 *   onClick={withTracking(PAGES.HOME, { action: "open", label: "About" }, openAbout)}
 */
export function withTracking(page, details, handler) {
  return (...args) => {
    try {
      trackClick(page, details);
    } catch {
      // Never let a stats call stop the thing the visitor actually asked for.
    }

    return handler?.(...args);
  };
}

export { CLICK_ACTIONS };

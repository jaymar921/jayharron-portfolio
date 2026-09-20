import { Router } from "express";
import env from "../config/env.js";
import { EVENT_TYPES } from "../db/collections.js";
import { isConfigured } from "../db/mongo.js";
import { describeClient, readReferrerHost } from "../lib/clientInfo.js";
import { rateLimit } from "../lib/rateLimit.js";
import { hasAdminSession } from "../lib/requireAdmin.js";
import { optionalId, optionalString, optionalUrl, oneOf } from "../lib/validate.js";
import { recordEvent } from "../services/analytics.js";
import { CLICK_ACTIONS, CLICK_ACTION_VALUES, PAGE_SLUGS } from "../../../shared/tracking.js";

/**
 * The two endpoints the site posts to.
 *
 *   POST /api/track/view    a page was opened
 *   POST /api/track/click   a window, link, download or other button was hit
 *
 * Both answer 202 rather than 200. The browser sends these with sendBeacon,
 * which cannot read a response, and nothing on the page waits for one, so the
 * honest status is "accepted, will be recorded" rather than "done".
 *
 * The owner is never counted. The browser side already refuses to send from a
 * device that has signed in to /admin, and this side drops anything that
 * arrives with a live admin cookie, so a beacon from a browser that skipped
 * the client check still goes nowhere.
 */

const router = Router();

const limiter = rateLimit({
  name: "track",
  limit: env.rateLimit.trackPerMinute,
  windowMs: 60_000,
  keyFor: (req) => req.client?.ipHash ?? null,
});

/** Works out who is asking once, so both routes and the limiter can use it. */
router.use((req, _res, next) => {
  req.client = describeClient(req);
  next();
});

/**
 * Across every address at once, so a flood spread over many addresses still
 * has a ceiling on how many database writes it can cause.
 */
const globalLimiter = rateLimit({
  name: "track-global",
  limit: env.rateLimit.trackGlobalPerMinute,
  windowMs: 60_000,
  keyFor: () => "all",
});

router.use(limiter, globalLimiter);

/**
 * Three reasons an event is accepted and dropped: there is nowhere to write
 * it, a crawler sent it, or it came from the admin's own browser. None is the
 * visitor's problem, so none is an error. Bots are answered before the
 * session lookup because a crawler is never signed in and the lookup is the
 * one thing here that costs a database read.
 */
router.use(async (req, res, next) => {
  if (!isConfigured()) {
    return res.status(202).json({ ok: true, counted: false, reason: "not_configured" });
  }
  if (req.client?.isBot) {
    return res.status(202).json({ ok: true, counted: false, reason: "bot" });
  }
  if (await hasAdminSession(req)) {
    return res.status(202).json({ ok: true, counted: false, reason: "owner" });
  }
  return next();
});

/**
 * The path is taken from the body rather than the referrer so that a page
 * opened with a query string is recorded as the route it is, but it is capped
 * and stripped of anything but a path.
 */
function readPath(value) {
  const cleaned = optionalString(value, { max: 200, field: "path" });
  if (cleaned === null) return null;
  return cleaned.startsWith("/") ? cleaned.split("?")[0] : null;
}

/**
 * The referrer the page saw, which is the one that matters. The request's own
 * Referer header is the page sending the beacon, so it is only used when the
 * body has nothing to say.
 *
 * A referrer on the site's own host is a visitor walking from one page to
 * another and is recorded as "internal", so the outside sources are not
 * buried under the home page.
 */
function resolveReferrer(req, body) {
  if (typeof body.referrer !== "string") return req.client.referrerHost;

  const host = readReferrerHost(body.referrer);
  if (host === null) return null;

  const own = req.headers["x-forwarded-host"] ?? req.headers.host ?? "";
  return host === own || host === req.client.referrerHost ? "internal" : host;
}

/** The client as recorded, with the page's referrer in place of the beacon's. */
function clientFor(req, body) {
  return { ...req.client, referrerHost: resolveReferrer(req, body) };
}

router.post("/view", async (req, res, next) => {
  try {
    const body = req.body ?? {};

    const page = oneOf(body.page, PAGE_SLUGS, { field: "page" });

    const result = await recordEvent({
      type: EVENT_TYPES.VIEW,
      page,
      path: readPath(body.path),
      visitorId: optionalId(body.visitorId),
      sessionId: optionalId(body.sessionId),
      client: clientFor(req, body),
    });

    res.status(202).json({ ok: true, counted: result.counted });
  } catch (error) {
    next(error);
  }
});

router.post("/click", async (req, res, next) => {
  try {
    const body = req.body ?? {};

    const page = oneOf(body.page, PAGE_SLUGS, { field: "page" });
    const action = oneOf(body.action, CLICK_ACTION_VALUES, {
      field: "action",
      fallback: CLICK_ACTIONS.EXTERNAL,
    });

    const result = await recordEvent({
      type: EVENT_TYPES.CLICK,
      page,
      action,
      label: optionalString(body.label, { max: 80, field: "label" }),
      target: optionalUrl(body.target, { field: "target" }),
      path: readPath(body.path),
      visitorId: optionalId(body.visitorId),
      sessionId: optionalId(body.sessionId),
      client: clientFor(req, body),
    });

    res.status(202).json({ ok: true, counted: result.counted });
  } catch (error) {
    next(error);
  }
});

export default router;

import { Router } from "express";
import env from "../config/env.js";
import { rateLimit } from "../lib/rateLimit.js";
import { noStore, requireAdmin } from "../lib/requireAdmin.js";
import { ValidationError, oneOf } from "../lib/validate.js";
import { readDashboard, readRecentEvents } from "../services/analytics.js";
import { PAGE_SLUGS } from "../../../shared/tracking.js";

/**
 * Reading the numbers back.
 *
 *   GET /api/stats           the site totals, every page, every button, the
 *                            last 30 days by day and the newest events
 *   GET /api/stats/events    the raw rows, newest first; ?page= narrows it
 *
 * These are read only, and they are the site's own traffic figures, so they
 * are not public. The admin session cookie the dashboard holds is the only
 * way in.
 */

const router = Router();

/**
 * The reads here are the most expensive thing the API does, so they get the
 * tightest per address ceiling, and it runs before the session lookup so an
 * unauthenticated flood never reaches the database at all.
 */
const limiter = rateLimit({
  name: "stats",
  limit: env.rateLimit.statsPerMinute,
  windowMs: 60_000,
  keyFor: (req) => req.ipHash ?? null,
});

router.use(limiter, (req, res, next) => {
  noStore(res);
  return requireAdmin()(req, res, next);
});

router.get("/", async (_req, res, next) => {
  try {
    const dashboard = await readDashboard();
    res.json({ ok: true, ...dashboard });
  } catch (error) {
    next(error);
  }
});

router.get("/events", async (req, res, next) => {
  try {
    const page =
      typeof req.query.page === "string" && req.query.page !== ""
        ? oneOf(req.query.page, PAGE_SLUGS, { field: "page" })
        : null;
    const limit = Number.parseInt(req.query.limit ?? "50", 10);

    if (Number.isNaN(limit)) {
      throw new ValidationError("limit must be a number", "limit");
    }

    const events = await readRecentEvents({ page, limit });
    res.json({ ok: true, page, count: events.length, events });
  } catch (error) {
    next(error);
  }
});

export default router;

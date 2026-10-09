import { Router } from "express";
import { readCountry } from "../lib/clientInfo.js";

/**
 * GET /api/geo
 *
 * The visitor's country, as a two letter code, so the boot screen can say
 * hello in their language. It is the same edge header the tracker already
 * reads (see readCountry), handed back to the browser that sent the request
 * and nothing else: no lookup, no logging, no database.
 *
 * Locally there is no edge in front, so the answer is null and the browser
 * falls back to its own timezone and language guess.
 */

const router = Router();

router.get("/", (req, res) => {
  // The answer is about this one visitor, so no shared cache may keep it.
  res.set("Cache-Control", "private, no-store");
  res.json({ ok: true, country: readCountry(req) });
});

export default router;

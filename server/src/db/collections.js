import env from "../config/env.js";
import { getDb } from "./mongo.js";

/**
 * Collection names and their indexes.
 *
 *   events         every raw view and click, one document each. Optionally
 *                  expires, so the collection does not grow without bound.
 *   site_stats     a single document of site wide counters bumped with $inc:
 *                  views, unique visitors, clicks, and the device, country,
 *                  language and referrer breakdowns. The dashboard's headline
 *                  numbers are one document read.
 *   page_stats     one document per page slug, for the per page table.
 *   button_stats   one document per button (action + label + page), so "what
 *                  did they click" is a counter and not a scan.
 *   admin_users    the accounts allowed into /admin. One document each,
 *                  holding a scrypt hash and never a password.
 *   admin_sessions one document per signed in session, keyed by a hash of the
 *                  cookie value. Expires itself.
 */

export const COLLECTIONS = Object.freeze({
  EVENTS: "events",
  SITE_STATS: "site_stats",
  PAGE_STATS: "page_stats",
  BUTTON_STATS: "button_stats",
  ADMIN_USERS: "admin_users",
  ADMIN_SESSIONS: "admin_sessions",
});

export const EVENT_TYPES = Object.freeze({
  VIEW: "view",
  CLICK: "click",
});

/** The one site_stats row. */
export const SITE_ID = "site";

/**
 * Index creation is idempotent, but it still costs a round trip, so it runs
 * once per process rather than on every request. The promise is cached so
 * concurrent requests share the one attempt.
 */
let ensurePromise = null;

async function createIndexes() {
  const db = await getDb();

  const events = db.collection(COLLECTIONS.EVENTS);
  const pages = db.collection(COLLECTIONS.PAGE_STATS);
  const buttons = db.collection(COLLECTIONS.BUTTON_STATS);
  const adminUsers = db.collection(COLLECTIONS.ADMIN_USERS);
  const adminSessions = db.collection(COLLECTIONS.ADMIN_SESSIONS);

  const indexes = [
    events.createIndex({ page: 1, createdAt: -1 }),
    events.createIndex({ type: 1, createdAt: -1 }),
    // The last 30 days, by day, for the dashboard's timeline.
    events.createIndex({ counted: 1, createdAt: -1 }),
    // "Has this visitor been here before" and "on this page before", which is
    // what makes a view unique. Sparse because a visitor id is not guaranteed.
    events.createIndex({ visitorId: 1, type: 1 }, { sparse: true }),
    events.createIndex({ visitorId: 1, page: 1, type: 1 }, { sparse: true }),
    pages.createIndex({ page: 1 }, { unique: true }),
    buttons.createIndex({ action: 1, label: 1, page: 1 }, { unique: true }),
    buttons.createIndex({ clicks: -1 }),
    adminUsers.createIndex({ username: 1 }, { unique: true }),
    adminSessions.createIndex({ tokenHash: 1 }, { unique: true }),
    adminSessions.createIndex({ username: 1 }),
    // Mongo drops an expired session on its own. The guard in requireAdmin
    // still checks the date, because the TTL monitor only runs once a minute.
    adminSessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ];

  // A TTL of 0 days means keep raw events forever. The counters are never
  // expired either way.
  if (env.mongo.eventTtlDays > 0) {
    indexes.push(
      events.createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: env.mongo.eventTtlDays * 24 * 60 * 60 },
      ),
    );
  }

  await Promise.all(indexes);
}

export function ensureIndexes() {
  if (!ensurePromise) {
    ensurePromise = createIndexes().catch((error) => {
      // Let the next request try again. An index that failed to build should
      // not permanently degrade the collection.
      ensurePromise = null;
      throw error;
    });
  }

  return ensurePromise;
}

export async function collection(name) {
  const db = await getDb();
  return db.collection(name);
}

export const eventsCollection = () => collection(COLLECTIONS.EVENTS);
export const siteStatsCollection = () => collection(COLLECTIONS.SITE_STATS);
export const pageStatsCollection = () => collection(COLLECTIONS.PAGE_STATS);
export const buttonStatsCollection = () => collection(COLLECTIONS.BUTTON_STATS);
export const adminUsersCollection = () => collection(COLLECTIONS.ADMIN_USERS);
export const adminSessionsCollection = () => collection(COLLECTIONS.ADMIN_SESSIONS);

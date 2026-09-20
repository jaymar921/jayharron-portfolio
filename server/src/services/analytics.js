import {
  EVENT_TYPES,
  SITE_ID,
  buttonStatsCollection,
  ensureIndexes,
  eventsCollection,
  pageStatsCollection,
  siteStatsCollection,
} from "../db/collections.js";
import { DEVICE_TYPES } from "../lib/userAgent.js";
import { CLICK_ACTION_VALUES, PAGE_SLUGS, labelFor } from "../../../shared/tracking.js";

/**
 * Writing and reading the counts.
 *
 * Every event is written in full to `events`, and then as $inc bumps on up to
 * three counter rows: the one `site_stats` document, the page's row in
 * `page_stats`, and, for a click, the button's row in `button_stats`. The raw
 * rows answer questions nobody thought of yet; the counters answer the
 * dashboard in a handful of document reads however many events are behind
 * them.
 *
 * A page field name is only ever one of the slugs in shared/tracking.js and a
 * device or browser name only ever comes out of the parser, so the dotted
 * paths built below can never carry user supplied text into a key. The one
 * key that does come from outside, the referrer host, goes through encodeHost
 * before it is used as a path. A button label is never a key: it is a field
 * on its own row.
 */

/** Keys that get their own counter under `devices`. */
const DEVICE_KEYS = Object.values(DEVICE_TYPES);

/** What a view with no resolvable country is counted under. */
const UNKNOWN_COUNTRY = "unknown";

/** Views that arrived with no Referer header, which is most of them. */
const DIRECT_REFERRER = "direct";

function safeKey(value) {
  // Mongo rejects dots and leading dollars in field names. Nothing that
  // reaches here should contain either, but a new browser string is not worth
  // a failed write.
  if (typeof value !== "string" || value.trim() === "") return "Unknown";
  return value.replace(/[.$]/g, "_").slice(0, 40);
}

/**
 * A referrer host is full of dots, and a dot in a counter path means "go one
 * level down" to Mongo. A tilde is not a legal character in a hostname, so
 * swapping the two is reversible without ambiguity: "www.linkedin.com" is
 * stored under "www~linkedin~com" and put back when it is read.
 */
function encodeHost(host) {
  if (typeof host !== "string" || host.trim() === "") return DIRECT_REFERRER;
  return host.toLowerCase().replace(/\$/g, "_").replaceAll(".", "~").slice(0, 80);
}

function decodeHost(key) {
  return key.replaceAll("~", ".");
}

function decodeHostKeys(record) {
  return Object.fromEntries(
    Object.entries(record ?? {}).map(([key, count]) => [decodeHost(key), count]),
  );
}

/** "en-GB" and "en-US" both count towards "en"; the region is not the question. */
function languageKey(language) {
  if (typeof language !== "string" || language.trim() === "") return "unknown";
  return safeKey(language.split("-")[0].toLowerCase()).slice(0, 8);
}

/**
 * Has this visitor been seen before, on the site at all and on this page?
 * A refresh, or a second visit next week, should not read as a new person.
 *
 * Without a visitor id there is nothing to compare, so the view is counted as
 * unique only when the id is present. That undercounts rather than overcounts,
 * which is the right way round for a number you are going to quote.
 */
async function firstViews(page, visitorId) {
  if (!visitorId) return { site: false, page: false };

  const events = await eventsCollection();
  const [onSite, onPage] = await Promise.all([
    events.findOne({ visitorId, type: EVENT_TYPES.VIEW }, { projection: { _id: 1 } }),
    events.findOne({ visitorId, page, type: EVENT_TYPES.VIEW }, { projection: { _id: 1 } }),
  ]);

  return { site: onSite === null, page: onPage === null };
}

/**
 * The $inc for the site row. Views bump the view counters and the device,
 * country, language and referrer breakdowns; clicks bump the click counters
 * and are broken down by action and by country.
 */
function buildSiteIncrement({ type, action, device, country, language, referrerHost, isUnique }) {
  const deviceKey = DEVICE_KEYS.includes(device.type) ? device.type : DEVICE_TYPES.UNKNOWN;
  const countryKey = country ?? UNKNOWN_COUNTRY;

  if (type === EVENT_TYPES.VIEW) {
    return {
      views: 1,
      ...(isUnique ? { uniqueVisitors: 1 } : {}),
      [`devices.${deviceKey}`]: 1,
      [`os.${safeKey(device.os)}`]: 1,
      [`browsers.${safeKey(device.browser)}`]: 1,
      [`countries.${countryKey}`]: 1,
      [`languages.${languageKey(language)}`]: 1,
      [`referrers.${encodeHost(referrerHost)}`]: 1,
    };
  }

  const actionKey = CLICK_ACTION_VALUES.includes(action) ? action : "external";

  return {
    "clicks.total": 1,
    [`clicks.${actionKey}`]: 1,
    [`clickDevices.${deviceKey}`]: 1,
    [`clickCountries.${countryKey}`]: 1,
  };
}

function buildPageIncrement({ type, action, isUnique }) {
  if (type === EVENT_TYPES.VIEW) {
    return { views: 1, ...(isUnique ? { uniqueViews: 1 } : {}) };
  }

  const actionKey = CLICK_ACTION_VALUES.includes(action) ? action : "external";
  return { "clicks.total": 1, [`clicks.${actionKey}`]: 1 };
}

/**
 * Records one event and returns what was written.
 *
 * Bots are recorded in `events` with their type set to bot but are left out of
 * the counters, so a link preview fetch does not read as a visit while still
 * being visible if anyone goes looking.
 */
export async function recordEvent({
  type,
  page,
  action = null,
  label = null,
  target = null,
  path = null,
  visitorId = null,
  sessionId = null,
  client,
}) {
  await ensureIndexes();

  const now = new Date();
  const counted = !client.isBot;

  const unique =
    counted && type === EVENT_TYPES.VIEW
      ? await firstViews(page, visitorId)
      : { site: false, page: false };

  const device = {
    type: client.deviceType,
    os: client.os,
    browser: client.browser,
    browserVersion: client.browserVersion,
    platformHint: client.platformHint,
  };

  const document = {
    type,
    page,
    action,
    label,
    target,
    path,
    visitorId,
    sessionId,
    device,
    referrerHost: client.referrerHost,
    language: client.language,
    country: client.country ?? null,
    ipHash: client.ipHash,
    isBot: client.isBot,
    counted,
    isUniqueVisitor: unique.site,
    isUniquePageView: unique.page,
    createdAt: now,
  };

  const events = await eventsCollection();
  const writes = [events.insertOne(document)];

  if (counted) {
    const [site, pages] = await Promise.all([siteStatsCollection(), pageStatsCollection()]);

    writes.push(
      site.updateOne(
        { _id: SITE_ID },
        {
          $inc: buildSiteIncrement({
            type,
            action,
            device,
            country: client.country,
            language: client.language,
            referrerHost: client.referrerHost,
            isUnique: unique.site,
          }),
          $set: { lastEventAt: now },
          $setOnInsert: { firstEventAt: now },
        },
        { upsert: true },
      ),
      pages.updateOne(
        { page },
        {
          $inc: buildPageIncrement({ type, action, isUnique: unique.page }),
          $set: { lastEventAt: now, label: labelFor(page) },
          $setOnInsert: { page, firstEventAt: now },
        },
        { upsert: true },
      ),
    );

    if (type === EVENT_TYPES.CLICK) {
      const buttons = await buttonStatsCollection();
      writes.push(
        buttons.updateOne(
          { action: action ?? "external", label: label ?? "", page },
          {
            $inc: { clicks: 1 },
            $set: { lastClickAt: now, target: target ?? null },
            $setOnInsert: { action: action ?? "external", label: label ?? "", page, firstClickAt: now },
          },
          { upsert: true },
        ),
      );
    }
  }

  await Promise.all(writes);

  return { counted, isUnique: unique.site, device };
}

/** Zeroes so the site with no traffic yet still reads as a full row. */
function emptySite() {
  return {
    views: 0,
    uniqueVisitors: 0,
    clicks: { total: 0 },
    devices: {},
    os: {},
    browsers: {},
    countries: {},
    languages: {},
    referrers: {},
    clickDevices: {},
    clickCountries: {},
    firstEventAt: null,
    lastEventAt: null,
  };
}

function emptyPage(page) {
  return {
    page,
    label: labelFor(page),
    views: 0,
    uniqueViews: 0,
    clicks: { total: 0 },
    firstEventAt: null,
    lastEventAt: null,
  };
}

/** The site counters, with the encoded hosts put back. */
export async function readSummary() {
  await ensureIndexes();

  const site = await siteStatsCollection();
  const row = await site.findOne({ _id: SITE_ID }, { projection: { _id: 0 } });
  const merged = { ...emptySite(), ...(row ?? {}) };

  return { ...merged, referrers: decodeHostKeys(merged.referrers) };
}

/**
 * Every page's counters, including the ones with no traffic, so the shape of
 * the response does not change as the site gets its first visitors.
 */
export async function readPages() {
  await ensureIndexes();

  const pages = await pageStatsCollection();
  const rows = await pages.find({}, { projection: { _id: 0 } }).toArray();
  const byPage = new Map(rows.map((row) => [row.page, row]));

  return PAGE_SLUGS.map((slug) => ({ ...emptyPage(slug), ...(byPage.get(slug) ?? {}) }));
}

/**
 * Which buttons were clicked, biggest first.
 *
 * The counters say a button was hit 40 times. "People" says whether that was
 * 40 people or one person on a bad connection, by counting distinct visitor
 * ids per button in the raw rows. The raw rows expire, so people is a floor
 * over the retention window while clicks carries the all time total. Both
 * are shown so the gap is visible.
 */
export async function readButtons() {
  await ensureIndexes();

  const [buttons, events] = await Promise.all([buttonStatsCollection(), eventsCollection()]);

  const [rows, people] = await Promise.all([
    buttons.find({}, { projection: { _id: 0 } }).sort({ clicks: -1 }).limit(200).toArray(),
    events
      .aggregate([
        { $match: { type: EVENT_TYPES.CLICK, counted: true } },
        {
          $group: {
            _id: { action: "$action", label: "$label", page: "$page", visitorId: "$visitorId" },
          },
        },
        {
          $group: {
            _id: { action: "$_id.action", label: "$_id.label", page: "$_id.page" },
            people: { $sum: { $cond: [{ $eq: ["$_id.visitorId", null] }, 0, 1] } },
          },
        },
      ])
      .toArray(),
  ]);

  const peopleFor = new Map(
    people.map((row) => [
      `${row._id.action ?? "external"}\u0000${row._id.label ?? ""}\u0000${row._id.page}`,
      row.people,
    ]),
  );

  return rows.map((row) => ({
    action: row.action,
    label: row.label,
    page: row.page,
    pageLabel: labelFor(row.page),
    target: row.target ?? null,
    clicks: row.clicks ?? 0,
    people: peopleFor.get(`${row.action}\u0000${row.label}\u0000${row.page}`) ?? 0,
    lastClickAt: row.lastClickAt ?? null,
  }));
}

/** Midnight, UTC, `days` days ago, so a daily series lines up on whole days. */
function startOfWindow(days) {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return start;
}

function emptyDay(day) {
  return { day, views: 0, visitors: 0, clicks: 0 };
}

/**
 * Views, distinct visitors and clicks per day over the last `days` days,
 * oldest first, with every day present even when nothing happened on it. The
 * counters only hold totals, so this is the one dashboard read that walks the
 * raw rows, bounded by the date index and the window.
 */
export async function readDaily({ days = 30 } = {}) {
  await ensureIndexes();

  const window = Math.min(Math.max(days, 1), 180);
  const start = startOfWindow(window);
  const events = await eventsCollection();

  const [counts, visitors] = await Promise.all([
    events
      .aggregate([
        { $match: { counted: true, createdAt: { $gte: start } } },
        {
          $group: {
            _id: {
              day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              type: "$type",
            },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray(),
    events
      .aggregate([
        {
          $match: {
            counted: true,
            type: EVENT_TYPES.VIEW,
            visitorId: { $ne: null },
            createdAt: { $gte: start },
          },
        },
        {
          $group: {
            _id: {
              day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              visitorId: "$visitorId",
            },
          },
        },
        { $group: { _id: "$_id.day", visitors: { $sum: 1 } } },
      ])
      .toArray(),
  ]);

  const byDay = new Map();

  for (let offset = 0; offset < window; offset += 1) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + offset);
    const day = date.toISOString().slice(0, 10);
    byDay.set(day, emptyDay(day));
  }

  for (const row of counts) {
    const bucket = byDay.get(row._id.day);
    if (!bucket) continue;
    if (row._id.type === EVENT_TYPES.VIEW) bucket.views += row.count;
    else bucket.clicks += row.count;
  }

  for (const row of visitors) {
    const bucket = byDay.get(row._id);
    if (bucket) bucket.visitors = row.visitors;
  }

  return { days: window, since: start.toISOString(), rows: [...byDay.values()] };
}

/**
 * The most recent raw events, newest first. Useful when a number looks wrong
 * and you want to see what actually came in.
 *
 * `countedOnly` leaves the bot rows out, for a list that is meant to answer
 * "who was here just now" rather than "what hit the endpoint".
 */
export async function readRecentEvents({ page = null, limit = 50, countedOnly = false } = {}) {
  await ensureIndexes();

  const events = await eventsCollection();
  const filter = {
    ...(page ? { page } : {}),
    ...(countedOnly ? { counted: true } : {}),
  };

  return events
    .find(filter, { projection: { _id: 0, ipHash: 0 } })
    .sort({ createdAt: -1 })
    .limit(Math.min(Math.max(limit, 1), 200))
    .toArray();
}

/** How many of the newest events ride along with the dashboard. */
const RECENT_ACTIVITY_LIMIT = 12;

/**
 * Everything the dashboard draws, in one call. The summary and page rows are
 * counter reads; the rest are bounded aggregations, run together.
 */
export async function readDashboard() {
  const [summary, pages, buttons, daily, recent] = await Promise.all([
    readSummary(),
    readPages(),
    readButtons(),
    readDaily({ days: 30 }),
    readRecentEvents({ limit: RECENT_ACTIVITY_LIMIT, countedOnly: true }),
  ]);

  return { summary, pages, buttons, daily, recent, generatedAt: new Date() };
}

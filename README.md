# Jayharron's Portfolio

A React + Vite site styled as an Ubuntu desktop, with a small Express API
behind it that records visits and serves a private analytics dashboard.

## Running it

```sh
cp _env .env          # then fill in MONGODB_URI and ANALYTICS_HASH_SALT
npm install
npm run dev:all       # site on :5173, API on :4000, /api proxied between them
```

`npm run dev` alone runs only the site; tracking then goes nowhere and the
admin page reports the database as unavailable, which is fine for UI work.

## Analytics

Every page view and every tracked button (window opens, links out, the resume
download, certificate previews, the contact form) is posted to `/api/track/*`
with `navigator.sendBeacon`, so nothing ever waits on it. The server hashes
the address, reads the country from the hosting edge, parses the user agent
and writes the event plus a set of rolled up counters to MongoDB. See
[`shared/tracking.js`](shared/tracking.js) for the page slugs and click actions
both sides agree on.

What is deliberately **not** collected: raw IPs (only a salted hash, used for
rate limiting), anything closer than a country, full referrer URLs (host
only), and anything from a browser with Do Not Track or Global Privacy
Control switched on. Crawlers are turned away before anything is written.

### The dashboard at `/admin`

Not linked from anywhere, `noindex` everywhere, disallowed in `robots.txt`,
and served nothing at all without a session. There is no sign up form and no
password reset by email. An account is created from a terminal that already
holds the database credentials:

```sh
npm run admin -- create            # prints a temporary password once
npm run admin -- reset  <username> # issue a fresh one
npm run admin -- list
npm run admin -- revoke <username> # sign every browser out
npm run admin -- delete <username>
```

The temporary password expires after 24 hours and only gets you as far as
the change-password screen; the dashboard opens once a real one is set. The
session is an HttpOnly, SameSite=Strict cookie; it goes stale after 30 idle
minutes and ends after 12 hours regardless. Five wrong passwords lock the
account for 15 minutes.

**Your own visits are never counted.** Any browser that signs in to `/admin`
is stamped in localStorage and stops sending events from then on, and the
server additionally drops any event that arrives with a live admin cookie.

### Rate limits

Everything under `/api` is capped per address, the admin and stats routes
tighter still, and the tracking and admin routes also carry a global ceiling
so a flood spread over many addresses cannot run up database work. The
numbers are in `_env`. These stop abuse and accidents, not a real
distributed attack; for that, turn on Vercel's Firewall and Attack Challenge
Mode.

## Deploying

Vercel serves the static build and runs `api/index.js` as a serverless
function for `/api/*` (see `vercel.json`). Set the same variables from `_env`
in the project's environment settings, and set `CORS_ALLOWED_ORIGINS` to the
site's real origin so nothing else can post events as you.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarList,
  Button,
  ChartPanel,
  Note,
  Panel,
  StatTile,
  formatNumber,
  formatPercent,
  formatRelative,
  toRows,
} from "./ui";
import AdminButtons from "./AdminButtons";
import AdminEvents, { EventsTable } from "./AdminEvents";
import AdminTimeline from "./AdminTimeline";
import AdminWorldMap from "./AdminWorldMap";
import { fetchStats, isSignedOut, logout } from "../../lib/api/admin";

/**
 * The dashboard.
 *
 * Four tabs, and everything on the first three comes from one call to
 * GET /api/stats. The totals and the breakdowns are read from the rolled up
 * counters, so they cost a handful of document reads however many events are
 * behind them. The timeline and the "people" column are the two things a
 * counter cannot answer, and the server runs them as bounded aggregations in
 * the same call, along with the newest events for the activity panel. The
 * events tab fetches its own rows, so a slow scan there never holds up the
 * numbers.
 */

const TABS = [
  { key: "overview", label: "Overview", icon: "fa-solid fa-gauge-high" },
  { key: "audience", label: "Audience", icon: "fa-solid fa-earth-asia" },
  { key: "clicks", label: "Clicks", icon: "fa-solid fa-hand-pointer" },
  { key: "events", label: "Events", icon: "fa-solid fa-list" },
];

const TAB_STORAGE_KEY = "jha-admin-tab";

/** The tab that was open last time, so a refresh lands back where it was. */
function readStoredTab() {
  try {
    const stored = sessionStorage.getItem(TAB_STORAGE_KEY);
    return TABS.some((tab) => tab.key === stored) ? stored : TABS[0].key;
  } catch {
    return TABS[0].key;
  }
}

/** "direct" and "internal" are not sources, so they get plain words. */
function referrerLabel(host) {
  if (host === "direct") return "Direct / typed";
  if (host === "internal") return "Another page here";
  return host;
}

function AdminDashboard({ session, onSignedOut, onChangePassword }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [tab, setTab] = useState(readStoredTab);

  function pickTab(key) {
    setTab(key);
    try {
      sessionStorage.setItem(TAB_STORAGE_KEY, key);
    } catch {
      // Private mode, or storage switched off. The tab still changes.
    }
  }

  const load = useCallback(
    async ({ quiet = false } = {}) => {
      if (!quiet) setLoading(true);
      setError(null);

      try {
        const payload = await fetchStats();
        setData(payload);
        setUpdatedAt(new Date());
      } catch (failure) {
        // An expired session is not an error to show on the dashboard, it is a
        // reason to be back at the login form.
        if (isSignedOut(failure)) {
          onSignedOut?.();
          return;
        }
        setError(failure.message ?? "Could not load the numbers.");
      } finally {
        setLoading(false);
      }
    },
    [onSignedOut],
  );

  useEffect(() => {
    load();
  }, [load]);

  /**
   * A quiet refresh every minute, but only while the tab is actually being
   * looked at. A dashboard left open in a background tab has no reason to keep
   * touching the database, and each request slides the session window forward,
   * which would defeat the idle timeout.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load({ quiet: true });
    }, 60_000);

    return () => clearInterval(timer);
  }, [load]);

  async function handleSignOut() {
    try {
      await logout();
    } catch {
      // The cookie is going either way. A failed call here means the session
      // row outlives the click, and it expires on its own.
    }
    onSignedOut?.();
  }

  const summary = data?.summary;
  const totalViews = summary?.views ?? 0;
  const totalClicks = summary?.clicks?.total ?? 0;

  const referrerRows = useMemo(
    () => toRows(summary?.referrers).map((row) => ({ ...row, label: referrerLabel(row.label) })),
    [summary],
  );

  const pageRows = useMemo(
    () =>
      (data?.pages ?? [])
        .map((page) => ({
          page: page.page,
          label: page.label,
          views: page.views ?? 0,
          uniqueViews: page.uniqueViews ?? 0,
          clicks: page.clicks?.total ?? 0,
          lastEventAt: page.lastEventAt ?? null,
        }))
        .sort((a, b) => b.views - a.views),
    [data],
  );

  return (
    <div className="min-h-screen w-full px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-white md:text-xl">
              <i className="fa-solid fa-chart-line pr-2 text-ubuntu-orange" aria-hidden="true" />
              Portfolio analytics
            </h1>
            <p className="pt-1 text-xs text-ubuntu-warm-grey">
              Signed in as {session?.username ?? "admin"}
              {updatedAt && tab !== "events" && ` · updated ${formatRelative(updatedAt)}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tab !== "events" && (
              <Button
                accent="orange"
                variant="outline"
                icon={loading ? "fa-solid fa-circle-notch fa-spin" : "fa-solid fa-rotate"}
                onClick={() => load()}
                disabled={loading}
              >
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            )}
            <Button accent="amber" variant="outline" icon="fa-solid fa-key" onClick={onChangePassword}>
              <span className="hidden sm:inline">Password</span>
            </Button>
            <Button
              accent="rose"
              variant="outline"
              icon="fa-solid fa-right-from-bracket"
              onClick={handleSignOut}
            >
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>

        <nav
          className="-mx-4 flex gap-1 overflow-x-auto border-b border-white/10 px-4 md:mx-0 md:px-0"
          role="tablist"
          aria-label="Dashboard sections"
        >
          {TABS.map((entry) => (
            <button
              key={entry.key}
              type="button"
              role="tab"
              aria-selected={tab === entry.key}
              onClick={() => pickTab(entry.key)}
              className={`-mb-px whitespace-nowrap border-b-2 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                tab === entry.key
                  ? "border-ubuntu-orange text-white"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <i className={`${entry.icon} pr-2`} aria-hidden="true" />
              {entry.label}
            </button>
          ))}
        </nav>

        {tab === "events" && <AdminEvents onSignedOut={onSignedOut} />}

        {tab !== "events" && error && (
          <Note accent="rose" icon="fa-solid fa-circle-exclamation">
            {error}
          </Note>
        )}

        {tab !== "events" &&
          (loading && !data ? (
            <Panel accent="slate" className="p-10 text-center">
              <i className="fa-solid fa-circle-notch fa-spin text-slate-500" aria-hidden="true" />
              <p className="pt-3 text-xs text-slate-500">Reading the counters…</p>
            </Panel>
          ) : (
            data && (
              <>
                {tab === "overview" && (
                  <>
                    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <StatTile
                        icon="fa-solid fa-eye"
                        label="Visits"
                        value={summary?.views}
                        hint="Every page view, all time"
                        accent="orange"
                      />
                      <StatTile
                        icon="fa-solid fa-user"
                        label="Unique visitors"
                        value={summary?.uniqueVisitors}
                        hint="Browsers seen for the first time"
                        accent="sky"
                      />
                      <StatTile
                        icon="fa-solid fa-hand-pointer"
                        label="Clicks"
                        value={totalClicks}
                        hint={
                          totalViews > 0
                            ? `${formatPercent((totalClicks / totalViews) * 100)} of visits`
                            : "Buttons, links and windows"
                        }
                        accent="amber"
                      />
                      <StatTile
                        icon="fa-solid fa-clock"
                        label="Last visit"
                        display={summary?.lastEventAt ? formatRelative(summary.lastEventAt) : "never"}
                        hint={summary?.firstEventAt ? `tracking since ${formatRelative(summary.firstEventAt)}` : "nothing yet"}
                        accent="emerald"
                      />
                    </section>

                    <AdminTimeline daily={data.daily} />

                    <div className="grid gap-4 lg:grid-cols-2">
                      <ChartPanel
                        title="Where they came from"
                        subtitle="Referrer of each view. Direct is a typed URL, a bookmark or a link that hid its referrer"
                        accent="sky"
                      >
                        <BarList rows={referrerRows} accent="sky" total={totalViews} limit={10} />
                      </ChartPanel>

                      <ChartPanel title="Pages" subtitle="Views and clicks per route" accent="orange">
                        {pageRows.every((row) => row.views === 0 && row.clicks === 0) ? (
                          <p className="py-6 text-center text-xs text-slate-500">Nothing recorded yet.</p>
                        ) : (
                          <table className="w-full border-collapse text-left">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-ubuntu-warm-grey">Page</th>
                                <th className="px-2 py-1.5 text-right text-[10px] uppercase tracking-widest text-ubuntu-warm-grey">Views</th>
                                <th className="px-2 py-1.5 text-right text-[10px] uppercase tracking-widest text-ubuntu-warm-grey">Unique</th>
                                <th className="px-2 py-1.5 text-right text-[10px] uppercase tracking-widest text-ubuntu-warm-grey">Clicks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pageRows.map((row) => (
                                <tr key={row.page} className="border-b border-white/5">
                                  <td className="px-2 py-1.5 text-xs text-white">{row.label}</td>
                                  <td className="px-2 py-1.5 text-right text-xs text-white tabular-nums">{formatNumber(row.views)}</td>
                                  <td className="px-2 py-1.5 text-right text-xs text-slate-400 tabular-nums">{formatNumber(row.uniqueViews)}</td>
                                  <td className="px-2 py-1.5 text-right text-xs text-slate-400 tabular-nums">{formatNumber(row.clicks)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </ChartPanel>
                    </div>

                    <ChartPanel
                      title="Latest activity"
                      subtitle={`The last ${data.recent?.length || 12} events, newest first`}
                      accent="emerald"
                    >
                      {!data.recent?.length ? (
                        <p className="py-6 text-center text-xs text-slate-500">Nothing recorded yet.</p>
                      ) : (
                        <EventsTable events={data.recent} />
                      )}
                    </ChartPanel>
                  </>
                )}

                {tab === "audience" && (
                  <>
                    <AdminWorldMap summary={summary} />

                    <div className="grid gap-4 md:grid-cols-2">
                      <ChartPanel title="Devices" subtitle="Phone, tablet or desktop, from the browser's own headers" accent="violet">
                        <BarList rows={toRows(summary?.devices)} accent="violet" />
                      </ChartPanel>
                      <ChartPanel title="Browsers" accent="amber">
                        <BarList rows={toRows(summary?.browsers)} accent="amber" />
                      </ChartPanel>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <ChartPanel title="Operating systems" accent="emerald">
                        <BarList rows={toRows(summary?.os)} accent="emerald" />
                      </ChartPanel>
                      <ChartPanel
                        title="Languages"
                        subtitle="The browser's first preferred language, region dropped"
                        accent="sky"
                      >
                        <BarList rows={toRows(summary?.languages)} accent="sky" />
                      </ChartPanel>
                    </div>
                  </>
                )}

                {tab === "clicks" && <AdminButtons buttons={data.buttons} totalClicks={totalClicks} />}

                <p className="pb-4 text-center text-[11px] leading-5 text-slate-500">
                  Crawlers are turned away before anything is written. Your own browsers are left out from the
                  moment they sign in here. Unique visitors only count a browser whose id stuck,
                  so the real number is this or higher. Countries come from the hosting edge and
                  are never looked up from an address.
                </p>
              </>
            )
          ))}
      </div>
    </div>
  );
}

export default AdminDashboard;

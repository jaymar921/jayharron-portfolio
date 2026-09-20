import { useEffect, useState } from "react";
import { Button, ChartPanel, Note, Toggle, formatDate, formatRelative } from "./ui";
import { countryName } from "./AdminWorldMap";
import { fetchEvents, isSignedOut } from "../../lib/api/admin";
import { PAGE_SLUGS, labelFor } from "../../../shared/tracking.js";

/**
 * The raw rows.
 *
 * The counters answer "how many". This answers "what actually came in", which
 * is the question you have when a number looks wrong. The server does not
 * send the hashed address in this response, so there is nothing here that
 * points at a person.
 *
 * The table itself is shared with the latest activity panel on the overview
 * tab, which shows the same kind of row, so it is exported on its own.
 */

/** Bot rows are kept but greyed, so a link preview fetch is visible as one. */
function rowTone(event) {
  if (event.isBot) return "text-slate-600";
  if (event.type === "click") return "text-white";
  return "text-slate-300";
}

const HEADINGS = ["When", "Page", "Type", "What", "Device", "Browser", "Where", "From"];

export function EventsTable({ events }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-white/10">
            {HEADINGS.map((heading) => (
              <th
                key={heading}
                scope="col"
                className="px-2 py-2 text-[10px] uppercase tracking-widest text-ubuntu-warm-grey"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr key={`${event.createdAt}-${index}`} className="border-b border-white/5">
              <td
                className="whitespace-nowrap px-2 py-2 text-[11px] text-slate-500"
                title={formatDate(event.createdAt)}
              >
                {formatRelative(event.createdAt)}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-xs text-slate-300">
                {labelFor(event.page)}
              </td>
              <td className={`px-2 py-2 text-[11px] ${rowTone(event)}`}>
                {event.isBot ? "bot" : event.type}
              </td>
              <td className={`px-2 py-2 text-xs ${rowTone(event)}`}>
                {event.type === "click"
                  ? [event.action, event.label].filter(Boolean).join(" · ")
                  : "page view"}
              </td>
              <td className="px-2 py-2 text-[11px] text-slate-500">{event.device?.type ?? "unknown"}</td>
              <td className="px-2 py-2 text-[11px] text-slate-500">{event.device?.browser ?? "unknown"}</td>
              <td
                className="px-2 py-2 text-[11px] text-slate-500"
                title={event.country ? countryName(event.country) : undefined}
              >
                {event.country ?? "unknown"}
              </td>
              <td className="px-2 py-2 text-[11px] text-slate-500">{event.referrerHost ?? "direct"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const LIMIT = 50;

const PAGE_FILTERS = [
  { value: "", label: "All" },
  ...PAGE_SLUGS.map((slug) => ({ value: slug, label: labelFor(slug) })),
];

function AdminEvents({ onSignedOut }) {
  const [page, setPage] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setLoading(true);
    setError(null);

    fetchEvents({ page: page || null, limit: LIMIT, signal: controller.signal })
      .then((payload) => {
        if (!active) return;
        setEvents(payload.events ?? []);
      })
      .catch((failure) => {
        if (!active || failure.code === "timeout") return;
        if (isSignedOut(failure)) {
          onSignedOut?.();
          return;
        }
        setError(failure.message ?? "Could not load the events.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [page, tick, onSignedOut]);

  return (
    <ChartPanel
      title="Raw events"
      subtitle={`The last ${LIMIT}, newest first`}
      accent="slate"
      actions={
        <Button
          accent="slate"
          variant="outline"
          icon={loading ? "fa-solid fa-circle-notch fa-spin" : "fa-solid fa-rotate"}
          onClick={() => setTick((value) => value + 1)}
          disabled={loading}
        >
          Refresh
        </Button>
      }
    >
      <div className="mb-3 overflow-x-auto pb-1">
        <Toggle options={PAGE_FILTERS} value={page} onChange={setPage} accent="slate" />
      </div>

      {error && (
        <Note accent="rose" icon="fa-solid fa-circle-exclamation">
          {error}
        </Note>
      )}

      {loading && events.length === 0 ? (
        <p className="py-6 text-center text-xs text-slate-500">
          <i className="fa-solid fa-circle-notch fa-spin pr-2" aria-hidden="true" />
          Reading the events…
        </p>
      ) : events.length === 0 ? (
        <p className="py-6 text-center text-xs text-slate-500">Nothing recorded yet.</p>
      ) : (
        <EventsTable events={events} />
      )}
    </ChartPanel>
  );
}

export default AdminEvents;

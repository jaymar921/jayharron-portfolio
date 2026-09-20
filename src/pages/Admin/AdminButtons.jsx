import { useMemo, useState } from "react";
import { BarList, ChartPanel, Toggle, accent, formatNumber, formatRelative } from "./ui";

/**
 * Which buttons were clicked.
 *
 * One row per button the site tracks: the desktop icons and dock, the links
 * out to GitHub, LinkedIn and the project sites, the resume download, the
 * certificate previews and the contact form. "Clicks" is the all time
 * counter, bumped on every hit. "People" is how many distinct visitors those
 * clicks came from, counted from the raw rows, which expire, so it is a floor
 * over the retention window. A row where the two are far apart is one person
 * hitting a button repeatedly, which is worth knowing before quoting the
 * bigger number.
 */

const ACTION_META = {
  open: { label: "Opened a window", icon: "fa-solid fa-window-restore", accent: "orange" },
  external: { label: "Left the site", icon: "fa-solid fa-arrow-up-right-from-square", accent: "sky" },
  download: { label: "Downloaded", icon: "fa-solid fa-file-arrow-down", accent: "emerald" },
  preview: { label: "Previewed", icon: "fa-solid fa-eye", accent: "violet" },
  submit: { label: "Submitted", icon: "fa-solid fa-paper-plane", accent: "amber" },
};

function metaFor(action) {
  return ACTION_META[action] ?? { label: action, icon: "fa-solid fa-hand-pointer", accent: "slate" };
}

const FILTERS = [{ value: "all", label: "All" }, ...Object.entries(ACTION_META).map(([value, meta]) => ({ value, label: meta.label }))];

function AdminButtons({ buttons, totalClicks }) {
  const [filter, setFilter] = useState("all");

  const rows = useMemo(
    () => (buttons ?? []).filter((row) => filter === "all" || row.action === filter),
    [buttons, filter],
  );

  const byAction = useMemo(() => {
    const map = new Map();
    for (const row of buttons ?? []) {
      map.set(row.action, (map.get(row.action) ?? 0) + row.clicks);
    }
    return [...map.entries()].map(([action, value]) => ({ label: metaFor(action).label, value }));
  }, [buttons]);

  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <ChartPanel
        title="Which buttons"
        subtitle="Every tracked button, most clicked first. Clicks is all time; people is distinct visitors over the retention window"
        accent="amber"
      >
        <div className="mb-3 overflow-x-auto pb-1">
          <Toggle options={FILTERS} value={filter} onChange={setFilter} accent="amber" />
        </div>

        {rows.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-500">No clicks recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10">
                  {["Button", "Action", "Page", "Clicks", "People", "Last"].map((heading, index) => (
                    <th
                      key={heading}
                      scope="col"
                      className={`px-2 py-2 text-[10px] uppercase tracking-widest text-ubuntu-warm-grey ${
                        index >= 3 ? "text-right" : ""
                      }`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const meta = metaFor(row.action);
                  return (
                    <tr
                      key={`${row.action}-${row.label}-${row.page}`}
                      className="border-b border-white/5 transition-colors hover:bg-white/[0.03]"
                    >
                      <td className="px-2 py-2 text-xs text-white">
                        <span className="block max-w-[220px] truncate" title={row.target ?? row.label}>
                          {row.label || <span className="text-slate-500">(no label)</span>}
                        </span>
                      </td>
                      <td className={`whitespace-nowrap px-2 py-2 text-xs ${accent(meta.accent).text}`}>
                        <i className={`${meta.icon} pr-1.5`} aria-hidden="true" />
                        {meta.label}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-xs text-slate-400">{row.pageLabel}</td>
                      <td className="px-2 py-2 text-right text-xs text-white tabular-nums">
                        {formatNumber(row.clicks)}
                      </td>
                      <td className="px-2 py-2 text-right text-xs text-slate-400 tabular-nums">
                        {formatNumber(row.people)}
                      </td>
                      <td
                        className="whitespace-nowrap px-2 py-2 text-right text-[11px] text-slate-500"
                        title={row.lastClickAt ?? ""}
                      >
                        {row.lastClickAt ? formatRelative(row.lastClickAt) : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </ChartPanel>

      <ChartPanel title="By action" subtitle="What the clicks were for, all time" accent="amber">
        <BarList rows={byAction} accent="amber" total={totalClicks} empty="No clicks recorded yet." />
      </ChartPanel>
    </div>
  );
}

export default AdminButtons;

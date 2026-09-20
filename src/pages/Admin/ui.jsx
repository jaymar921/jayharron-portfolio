/**
 * The pieces the admin page is built from, in the desktop's Ubuntu palette.
 *
 * Three rules shape the data pieces. A single number is a number, not a one
 * bar chart, so the headline figures are stat tiles. Every bar in a list is
 * the same colour, because shading a bar darker for being longer would encode
 * the length twice. The value is written next to its bar: the bars are for
 * the shape of the comparison, the digits are for the answer, and nothing
 * here relies on colour alone to be readable.
 */

const ACCENTS = {
  orange: {
    text: "text-ubuntu-orange",
    fill: "bg-ubuntu-orange/80",
    border: "border-ubuntu-orange/40",
    soft: "bg-ubuntu-orange/10",
    ring: "focus:border-ubuntu-orange focus:ring-ubuntu-orange/30",
    solid: "bg-ubuntu-orange hover:bg-ubuntu-orange-light text-white",
    outline: "border border-ubuntu-orange/40 text-ubuntu-orange hover:bg-ubuntu-orange/10",
  },
  sky: {
    text: "text-sky-300",
    fill: "bg-sky-400/80",
    border: "border-sky-400/40",
    soft: "bg-sky-400/10",
    ring: "focus:border-sky-400 focus:ring-sky-400/30",
    solid: "bg-sky-500 hover:bg-sky-400 text-white",
    outline: "border border-sky-400/40 text-sky-300 hover:bg-sky-400/10",
  },
  emerald: {
    text: "text-emerald-300",
    fill: "bg-emerald-400/80",
    border: "border-emerald-400/40",
    soft: "bg-emerald-400/10",
    ring: "focus:border-emerald-400 focus:ring-emerald-400/30",
    solid: "bg-emerald-500 hover:bg-emerald-400 text-white",
    outline: "border border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10",
  },
  amber: {
    text: "text-amber-300",
    fill: "bg-amber-400/80",
    border: "border-amber-400/40",
    soft: "bg-amber-400/10",
    ring: "focus:border-amber-400 focus:ring-amber-400/30",
    solid: "bg-amber-500 hover:bg-amber-400 text-black",
    outline: "border border-amber-400/40 text-amber-300 hover:bg-amber-400/10",
  },
  violet: {
    text: "text-violet-300",
    fill: "bg-violet-400/80",
    border: "border-violet-400/40",
    soft: "bg-violet-400/10",
    ring: "focus:border-violet-400 focus:ring-violet-400/30",
    solid: "bg-violet-500 hover:bg-violet-400 text-white",
    outline: "border border-violet-400/40 text-violet-300 hover:bg-violet-400/10",
  },
  rose: {
    text: "text-rose-300",
    fill: "bg-rose-400/80",
    border: "border-rose-400/40",
    soft: "bg-rose-400/10",
    ring: "focus:border-rose-400 focus:ring-rose-400/30",
    solid: "bg-rose-500 hover:bg-rose-400 text-white",
    outline: "border border-rose-400/40 text-rose-300 hover:bg-rose-400/10",
  },
  slate: {
    text: "text-slate-300",
    fill: "bg-slate-400/80",
    border: "border-white/15",
    soft: "bg-white/5",
    ring: "focus:border-slate-400 focus:ring-slate-400/30",
    solid: "bg-white/10 hover:bg-white/20 text-white",
    outline: "border border-white/15 text-slate-300 hover:bg-white/5",
  },
};

export function accent(name) {
  return ACCENTS[name] ?? ACCENTS.orange;
}

/* ------------------------------------------------------------------ *
 * Formatting                                                          *
 * ------------------------------------------------------------------ */

/**
 * The dashboard's clock. The developer reads it from the Philippines, so
 * every time on it is Philippine time, whatever the browser is set to. The
 * zone has no daylight saving, so it never shifts.
 */
export const ADMIN_TIME_ZONE = "Asia/Manila";

/** Thousands separators, because 14023 and 1402 look the same at a glance. */
export function formatNumber(value) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number)) return "0";
  return number.toLocaleString("en-US");
}

export function formatDate(value) {
  if (!value) return "never";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: ADMIN_TIME_ZONE,
  });
}

/** "3 minutes ago", for the times where the distance is the point. */
export function formatRelative(value) {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";

  const steps = [
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.35, "week"],
    [12, "month"],
  ];

  let amount = seconds / 60;
  let unit = "minute";

  for (let index = 0; index < steps.length; index += 1) {
    if (Math.abs(amount) < steps[index][0] || index === steps.length - 1) {
      unit = steps[index][1];
      break;
    }
    amount /= steps[index][0];
  }

  const rounded = Math.round(amount);
  return `${rounded} ${unit}${rounded === 1 ? "" : "s"} ago`;
}

/** "3.4%", or a dash where there is nothing to divide by. */
export function formatPercent(value) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "-";
  return `${value < 10 ? value.toFixed(1) : Math.round(value)}%`;
}

/** Turns { chrome: 4, firefox: 1 } into the rows BarList wants. */
export function toRows(record) {
  return Object.entries(record ?? {}).map(([label, value]) => ({
    label,
    value: Number(value) || 0,
  }));
}

/* ------------------------------------------------------------------ *
 * Surfaces                                                            *
 * ------------------------------------------------------------------ */

/** A window-like box: the desktop's dark glass with a thin accent line on top. */
export function Panel({ children, accent: name = "orange", className = "" }) {
  const tone = accent(name);
  return (
    <div
      className={`relative rounded-xl border border-white/10 bg-[rgba(20,6,15,0.72)] shadow-xl backdrop-blur-md ${className}`}
    >
      <span
        className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-xl ${tone.fill}`}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

/** A titled box for one chart, so every panel on the page has the same frame. */
export function ChartPanel({ title, subtitle, accent: name = "orange", actions, children }) {
  const tone = accent(name);
  return (
    <Panel accent={name} className="flex h-full flex-col p-4">
      <div className="flex flex-wrap items-start justify-between gap-3 pb-3">
        <div className="min-w-0 flex-1">
          <h3 className={`text-xs font-bold uppercase tracking-widest ${tone.text}`}>{title}</h3>
          {subtitle && <p className="mt-1 text-xs leading-5 text-ubuntu-warm-grey">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div className="grow">{children}</div>
    </Panel>
  );
}

/**
 * One headline number. The figure wears the normal text colour rather than an
 * accent, so a row of these does not read as though the colours mean something.
 */
export function StatTile({ icon, label, value, display, hint, accent: name = "orange" }) {
  const tone = accent(name);
  return (
    <Panel accent={name} className="flex flex-col gap-1 p-4">
      <div className="flex items-center gap-2">
        {icon && <i className={`${icon} text-xs ${tone.text}`} aria-hidden="true" />}
        <span className="text-[11px] uppercase tracking-widest text-ubuntu-warm-grey">{label}</span>
      </div>
      <span className="pt-1 text-2xl font-bold leading-none text-white tabular-nums md:text-3xl">
        {display ?? formatNumber(value)}
      </span>
      {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
    </Panel>
  );
}

/**
 * A ranked list of bars. `rows` is [{ label, value }]; this sorts by value
 * because every use of it here is a "which is biggest" question. `total` is
 * optional and only used for the share, so a list that is a subset of
 * something bigger can still say what share it is of.
 */
export function BarList({ rows, accent: name = "orange", empty = "Nothing recorded yet", total, limit }) {
  const tone = accent(name);
  const entries = [...(rows ?? [])]
    .filter((row) => Number(row.value) > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit ?? Number.POSITIVE_INFINITY);

  if (entries.length === 0) {
    return <p className="py-6 text-center text-xs text-slate-500">{empty}</p>;
  }

  const max = entries[0].value;
  const sum = total ?? entries.reduce((running, row) => running + row.value, 0);

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((row) => {
        const share = sum > 0 ? Math.round((row.value / sum) * 100) : 0;

        return (
          <li
            key={row.label}
            className="grid grid-cols-[minmax(72px,110px)_1fr_auto] items-center gap-3"
            title={`${row.label}: ${formatNumber(row.value)} (${share}%)`}
          >
            <span className="w-full truncate text-xs text-slate-300">{row.label}</span>
            <span className="h-2 w-full rounded-sm bg-white/5">
              <span
                className={`block h-2 rounded-sm ${tone.fill}`}
                style={{ width: `${Math.max(2, (row.value / max) * 100)}%` }}
              />
            </span>
            <span className="text-xs text-slate-200 tabular-nums">
              {formatNumber(row.value)}
              <span className="pl-1 text-slate-500">{share}%</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ *
 * Controls                                                            *
 * ------------------------------------------------------------------ */

export function Button({
  children,
  icon,
  accent: name = "orange",
  variant = "solid",
  className = "",
  type = "button",
  ...rest
}) {
  const tone = accent(name);
  const look =
    variant === "solid"
      ? tone.solid
      : `${tone.outline} bg-transparent`;

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${look} ${className}`}
      {...rest}
    >
      {icon && <i className={icon} aria-hidden="true" />}
      {children}
    </button>
  );
}

/** A small pill toggle, for switching a chart between two metrics. */
export function Toggle({ options, value, onChange, accent: name = "orange" }) {
  const tone = accent(name);
  return (
    <div className="flex gap-1" role="group">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={`rounded-md border px-2.5 py-1 text-[11px] uppercase tracking-widest transition-colors ${
            value === option.value
              ? `${tone.border} ${tone.text} ${tone.soft}`
              : "border-white/10 text-slate-500 hover:text-slate-300"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, htmlFor, hint, error, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold text-slate-300">
        {label}
        {required && <span className="pl-1 text-ubuntu-orange">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-rose-300">{error}</p>
      ) : (
        hint && <p className="text-xs leading-5 text-slate-500">{hint}</p>
      )}
    </div>
  );
}

export function TextInput({ accent: name = "orange", invalid = false, className = "", ...props }) {
  const tone = accent(name);
  return (
    <input
      className={`w-full rounded-md border bg-black/30 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:ring-2 ${
        invalid ? "border-rose-400/70" : "border-white/15"
      } ${tone.ring} ${className}`}
      {...props}
    />
  );
}

export function Note({ children, icon = "fa-solid fa-circle-info", accent: name = "amber" }) {
  const tone = accent(name);
  return (
    <div className={`flex gap-3 rounded-md border ${tone.border} ${tone.soft} p-3 text-xs leading-5 text-slate-200`}>
      <i className={`${icon} pt-0.5 ${tone.text}`} aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function FormStatus({ tone = "error", title, children }) {
  const name = tone === "error" ? "rose" : "emerald";
  const icon = tone === "error" ? "fa-solid fa-circle-exclamation" : "fa-solid fa-circle-check";
  return (
    <Note accent={name} icon={icon}>
      {title && <p className={`font-bold uppercase tracking-widest ${accent(name).text}`}>{title}</p>}
      <p>{children}</p>
    </Note>
  );
}

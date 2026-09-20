import { useMemo, useState } from "react";
import { topojson } from "chartjs-chart-geo";
import isoCountries from "i18n-iso-countries";
import world from "world-atlas/countries-110m.json";
import { BarList, ChartPanel, Toggle, formatNumber } from "./ui";
import { CHART_INK, TOOLTIP_STYLE, useChart } from "./chartSetup";

/**
 * Where the visitors are.
 *
 * A choropleth of the world, one shade per country, drawn by chartjs-chart-geo
 * from the counters the server keeps per ISO country code. The map is the
 * 110m resolution one from world-atlas, which is 100KB and enough for a
 * country level picture; the 50m file is seven times the size for detail
 * nobody reads at this width.
 *
 * The fill is one hue, dim to bright, because the number is a magnitude and
 * the surface is dark, so "more" reads as "lighter". A country with nothing
 * recorded is not the bottom of the ramp, it is a flat neutral, so an empty
 * map does not look like a map of low traffic.
 *
 * The counters are keyed by ISO 3166-1 alpha-2 ("PH"), the atlas by the
 * numeric code ("608"). i18n-iso-countries bridges the two, and the browser's
 * own Intl.DisplayNames turns the code into a name for the list and tooltip.
 */

const DISPLAY_NAMES = (() => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    return null;
  }
})();

/** "PH" to "Philippines", or the code itself when the browser has no name for it. */
export function countryName(code) {
  if (!code || code === "unknown") return "Unknown";
  try {
    return DISPLAY_NAMES?.of(code) ?? code;
  } catch {
    return code;
  }
}

/** The atlas features, decoded from TopoJSON once for the life of the module. */
const FEATURES = topojson.feature(world, world.objects.countries).features;

/** Numeric atlas id ("608") to the alpha-2 code the counters use ("PH"). */
const ALPHA2_BY_NUMERIC = new Map(
  FEATURES.map((feature) => [feature.id, isoCountries.numericToAlpha2(feature.id) ?? null]),
);

/** A dim ember at the bottom, Ubuntu orange-light at the top, on the dark panel. */
function orangeRamp(normalized) {
  const t = Math.max(0, Math.min(1, normalized));
  const from = [110, 36, 12];
  const to = [255, 150, 100];
  const channel = (index) => Math.round(from[index] + (to[index] - from[index]) * t);
  return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`;
}

const MISSING_FILL = "rgba(255, 255, 255, 0.06)";
const BORDER = "rgba(255, 255, 255, 0.22)";

/** The two things the map can show, the same shape either way. */
const METRICS = {
  views: { key: "countries", label: "Views", noun: "view" },
  clicks: { key: "clickCountries", label: "Clicks", noun: "click" },
};

function AdminWorldMap({ summary }) {
  const [metric, setMetric] = useState("views");

  const counts = useMemo(() => summary?.[METRICS[metric].key] ?? {}, [summary, metric]);

  const rows = useMemo(
    () =>
      Object.entries(counts)
        .filter(([code]) => code !== "unknown")
        .map(([code, value]) => ({ code, label: countryName(code), value: Number(value) || 0 })),
    [counts],
  );

  const unknown = Number(counts.unknown) || 0;
  const known = rows.reduce((sum, row) => sum + row.value, 0);
  const max = rows.reduce((top, row) => Math.max(top, row.value), 0);

  const canvasRef = useChart(
    () => ({
      type: "choropleth",
      data: {
        labels: FEATURES.map((feature) => feature.properties.name),
        datasets: [
          {
            label: METRICS[metric].label,
            data: FEATURES.map((feature) => {
              const code = ALPHA2_BY_NUMERIC.get(feature.id);
              const value = code ? Number(counts[code]) || 0 : 0;
              // A null is what the colour scale paints with the missing fill.
              // A zero would be the bottom of the ramp, which is a shade of
              // "some", and an empty map would read as a map of low traffic.
              return { feature, code, value: value > 0 ? value : null };
            }),
            borderColor: BORDER,
            borderWidth: 0.5,
            hoverBorderColor: "rgb(255, 255, 255)",
            hoverBorderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        showOutline: false,
        showGraticule: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...TOOLTIP_STYLE,
            displayColors: false,
            callbacks: {
              title: (items) => {
                const raw = items[0]?.raw;
                return raw?.code ? countryName(raw.code) : items[0]?.label;
              },
              label: (item) => {
                const value = item.raw?.value ?? 0;
                const share = known > 0 ? Math.round((value / known) * 100) : 0;
                return value > 0
                  ? `${formatNumber(value)} ${METRICS[metric].noun}${value === 1 ? "" : "s"} (${share}%)`
                  : "Nothing recorded";
              },
            },
          },
        },
        scales: {
          projection: {
            axis: "x",
            projection: "equalEarth",
          },
          color: {
            axis: "x",
            // Zero is the floor, not one, so a single view still has a range
            // to sit at the top of. A country with nothing is null, not zero,
            // so nothing is ever painted at the bottom of the ramp.
            min: 0,
            max: Math.max(max, 1),
            interpolate: orangeRamp,
            missing: MISSING_FILL,
            quantize: 6,
            display: max > 0,
            legend: {
              position: "bottom-left",
              align: "bottom",
              length: 120,
              width: 8,
              indicatorWidth: 8,
              margin: 6,
            },
            ticks: {
              color: CHART_INK.muted,
              font: { size: 9 },
              maxTicksLimit: 4,
              callback: (value) => formatNumber(value),
            },
          },
        },
      },
    }),
    [metric, counts, known, max],
  );

  return (
    <ChartPanel
      title="Where visitors are"
      subtitle="By country, resolved at the hosting edge. Nothing closer than that is kept"
      accent="orange"
      actions={
        <Toggle
          value={metric}
          onChange={setMetric}
          accent="orange"
          options={Object.entries(METRICS).map(([value, entry]) => ({ value, label: entry.label }))}
        />
      }
    >
      <div className="grid gap-4 lg:grid-cols-[3fr_1fr]">
        <div className="relative h-[240px] w-full sm:h-[300px] md:h-[360px]">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`World map of ${METRICS[metric].label.toLowerCase()} by country`}
          />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[11px] uppercase tracking-widest text-ubuntu-warm-grey">Top countries</p>
          <BarList
            rows={rows}
            accent="orange"
            total={known}
            limit={8}
            empty="No country recorded yet. Vercel adds the country header on deploy; locally every view is unknown."
          />
          {unknown > 0 && (
            <p className="text-[11px] leading-5 text-slate-500">
              {formatNumber(unknown)} {METRICS[metric].noun}
              {unknown === 1 ? "" : "s"} with no country, from local development or a host
              that sends no country header.
            </p>
          )}
        </div>
      </div>
    </ChartPanel>
  );
}

export default AdminWorldMap;

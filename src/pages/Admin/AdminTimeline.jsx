import { useMemo } from "react";
import { ChartPanel, StatTile, formatNumber } from "./ui";
import { CHART_INK, SERIES, TOOLTIP_STYLE, useChart } from "./chartSetup";

/**
 * The last thirty days, one point per day.
 *
 * The counters say how many, ever. This says whether that was a steady trickle
 * or one busy week after a LinkedIn post, which is the question a total cannot
 * answer. Three lines on one axis: views, distinct visitors and clicks.
 * Visitors and clicks are fractions of views, so they sit low, and that is
 * the honest picture. A second axis would make them look the same size.
 *
 * Every day is present in the data even when nothing happened, so a quiet
 * week is a flat line at zero and not a gap.
 */

/** "2026-09-11" to "11 Sep", read as UTC so the label matches the bucket. */
function shortDay(iso) {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

function sumOf(rows, key) {
  return rows.reduce((sum, row) => sum + (Number(row[key]) || 0), 0);
}

function line(label, data, color, fill) {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: fill ?? "transparent",
    fill: Boolean(fill),
    borderWidth: 2,
    pointRadius: 0,
    pointHoverRadius: 4,
    pointHoverBackgroundColor: color,
    pointHoverBorderColor: CHART_INK.surface,
    pointHoverBorderWidth: 2,
    cubicInterpolationMode: "monotone",
  };
}

function AdminTimeline({ daily }) {
  const rows = useMemo(() => daily?.rows ?? [], [daily]);

  const last7 = rows.slice(-7);
  const previous7 = rows.slice(-14, -7);
  const today = rows[rows.length - 1];

  const canvasRef = useChart(
    () => ({
      type: "line",
      data: {
        labels: rows.map((row) => row.day),
        datasets: [
          line("Views", rows.map((row) => row.views), SERIES.views, "rgba(233, 84, 32, 0.14)"),
          line("Visitors", rows.map((row) => row.visitors), SERIES.visitors),
          line("Clicks", rows.map((row) => row.clicks), SERIES.clicks),
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "end",
            labels: {
              color: CHART_INK.text,
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
              pointStyle: "rect",
              font: { size: 10, family: "Ubuntu, sans-serif" },
              padding: 12,
            },
          },
          tooltip: {
            ...TOOLTIP_STYLE,
            callbacks: {
              title: (items) => {
                const day = items[0]?.label;
                return day ? shortDay(day) : "";
              },
              label: (item) => ` ${item.dataset.label}: ${formatNumber(item.parsed.y)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { color: CHART_INK.grid },
            ticks: {
              color: CHART_INK.muted,
              font: { size: 9 },
              maxTicksLimit: 8,
              maxRotation: 0,
              callback(value) {
                return shortDay(this.getLabelForValue(value));
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: { color: CHART_INK.grid },
            border: { display: false },
            ticks: {
              color: CHART_INK.muted,
              font: { size: 9 },
              maxTicksLimit: 5,
              precision: 0,
              callback: (value) => formatNumber(value),
            },
          },
        },
      },
    }),
    [rows],
  );

  return (
    <ChartPanel
      title={`Last ${daily?.days ?? 30} days`}
      subtitle="Views, distinct visitors and clicks per day, UTC. Raw events only, so this covers the retention window and not all time"
      accent="orange"
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile icon="fa-solid fa-calendar-day" label="Views today" value={today?.views} accent="orange" />
          <StatTile icon="fa-solid fa-user" label="Visitors today" value={today?.visitors} accent="sky" />
          <StatTile
            icon="fa-solid fa-calendar-week"
            label="Views, 7 days"
            value={sumOf(last7, "views")}
            hint={`${formatNumber(sumOf(previous7, "views"))} the week before`}
            accent="orange"
          />
          <StatTile
            icon="fa-solid fa-hand-pointer"
            label="Clicks, 7 days"
            value={sumOf(last7, "clicks")}
            hint={`${formatNumber(sumOf(previous7, "clicks"))} the week before`}
            accent="amber"
          />
        </div>

        <div className="relative h-[200px] w-full sm:h-[240px] md:h-[280px]">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Views, visitors and clicks per day for the last 30 days"
          />
        </div>
      </div>
    </ChartPanel>
  );
}

export default AdminTimeline;

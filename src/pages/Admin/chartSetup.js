import { useEffect, useRef } from "react";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import {
  ChoroplethController,
  ColorScale,
  GeoFeature,
  ProjectionScale,
} from "chartjs-chart-geo";

/**
 * Chart.js, registered once, with only the pieces the dashboard draws.
 *
 * Chart.js is tree shakeable, so the line chart and the choropleth each cost
 * only the controllers, elements and scales they use. Nothing imports
 * "chart.js/auto", which would pull in every chart type for the two in use.
 * This module is only ever reached through the lazy loaded admin page, so a
 * normal visitor never downloads any of it.
 */

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Filler,
  Legend,
  Tooltip,
  ChoroplethController,
  ColorScale,
  GeoFeature,
  ProjectionScale,
);

/** The text and line colours the charts share with the rest of the page. */
export const CHART_INK = {
  text: "rgb(174, 167, 159)", // ubuntu warm grey
  muted: "rgb(120, 113, 108)",
  grid: "rgba(255, 255, 255, 0.08)",
  surface: "rgb(28, 0, 18)", // ubuntu aubergine dark
  tooltipBg: "rgba(20, 6, 15, 0.96)",
  tooltipBorder: "rgba(255, 255, 255, 0.18)",
};

/** The series colours, the same steps whichever chart is drawing them. */
export const SERIES = {
  views: "#E95420", // ubuntu orange
  visitors: "#38bdf8", // sky-400
  clicks: "#fbbf24", // amber-400
};

/** The tooltip box, styled like the rest of the page rather than Chart.js's default. */
export const TOOLTIP_STYLE = {
  backgroundColor: CHART_INK.tooltipBg,
  borderColor: CHART_INK.tooltipBorder,
  borderWidth: 1,
  cornerRadius: 6,
  padding: 8,
  titleColor: "rgb(255, 255, 255)",
  titleFont: { size: 12, family: "Ubuntu, sans-serif" },
  bodyColor: CHART_INK.text,
  bodyFont: { size: 11, family: "Ubuntu, sans-serif" },
  displayColors: true,
  boxWidth: 8,
  boxHeight: 8,
  boxPadding: 4,
};

/**
 * Owns one Chart.js instance on a canvas. The chart is created when the
 * canvas mounts and destroyed when it unmounts; between those, a change to
 * the config is applied with update() rather than by tearing the chart down,
 * so a quiet refresh does not make the map flash.
 *
 * `build` returns the config for `new Chart(...)`. It is called once per
 * config change, and the result's data and options are copied onto the live
 * chart when one already exists.
 */
export function useChart(build, deps) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const config = build();

    if (chartRef.current) {
      chartRef.current.data = config.data;
      chartRef.current.options = config.options;
      chartRef.current.update();
      return undefined;
    }

    chartRef.current = new Chart(canvas, config);

    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(
    () => () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    },
    [],
  );

  return canvasRef;
}

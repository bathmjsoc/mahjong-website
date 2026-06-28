"use client";

import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

export type SeriesData = {
  name: string;
  color?: string;
  curve?: "smooth" | "straight";
  points: { x: string; y: number }[];
};

type LineGraphProps = {
  data: SeriesData[];
  enableTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  xAxisTitle?: string;
  yAxisTitle?: string;
};

export function LineGraph({
  data,
  enableTooltip = true,
  showXAxis = true,
  showYAxis = true,
  xAxisTitle,
  yAxisTitle,
}: LineGraphProps) {
  const series = data.map((d) => ({
    name: d.name,
    data: d.points,
  }));

  const colors = data.map((d) => d.color ?? "var(--color-accent)");

  const curves = data.map((d) => d.curve ?? "smooth");

  const options: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "inherit",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: colors,
    stroke: { curve: curves, width: 3 },
    tooltip: { enabled: enableTooltip },
    xaxis: {
      title: { text: xAxisTitle ?? "" },
      labels: {
        show: showXAxis,
        style: { colors: "var(--color-primary)" },
        rotate: -90,
      },
      axisBorder: { show: showXAxis, color: "var(--color-primary)" },
      axisTicks: { show: showXAxis, color: "var(--color-primary)" },
    },
    yaxis: {
      title: { text: yAxisTitle ?? "" },
      labels: { show: showYAxis, style: { colors: "var(--color-primary)" } },
    },
  };

  return (
    <Chart
      series={series}
      options={options}
      className="bg-secondary border-primary border-2 rounded-xl w-full h-full px-3"
    />
  );
}

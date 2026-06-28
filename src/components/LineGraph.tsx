"use client";

import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

type LineGraphProps = {
  data: { key: string; value: number }[];
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
  const options: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "inherit",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: ["var(--color-accent)"],
    stroke: { curve: "smooth", width: 3 },
    tooltip: { enabled: enableTooltip },
    xaxis: {
      title: { text: xAxisTitle ?? "" },
      labels: {
        show: showXAxis,
        style: { colors: "var(--color-primary)" },
        rotate: -90,
      },
      categories: data.map((d) => d.key),
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
        series={[{ name: yAxisTitle, data: data.map((d) => d.value) }]}
        options={options}
        className="bg-secondary border-primary border-2 rounded-xl w-full h-full px-3"
      />

  );
}

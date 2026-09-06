import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import type { ChartData } from "@/lib/types";

type SunburstChartProps = {
  data: ChartData[];
  title?: string;
};

export function SunburstChart({ data, title }: SunburstChartProps) {
  const series = [
    {
      data: data.map((item) => ({
        x: item.title,
        y: Object.values(item.data).reduce((total, value) => total + value, 0),
        color: item.color,
        children: Object.entries(item.data).map(([title, value]) => ({
          x: title,
          y: value,
          color: `color-mix(in srgb, ${item.color}, transparent 66%)`,
        })),
      })),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "sunburst",
      fontFamily: "inherit",
      foreColor: "var(--color-secondary)",
    },
    legend: {
      show: false,
    },
    plotOptions: {
      sunburst: {
        innerSize: "33%",
      },
    },
    stroke: {
      colors: ["var(--color-secondary)"],
    },
    title: {
      text: title,
      align: "center",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
  };

  return (
    <ReactApexChart
      // @ts-expect-error: "sunburst" is a valid type (but is missing from the list)
      type="sunburst"
      series={series}
      options={options}
      height="100%"
      width="100%"
      className="text-secondary"
    />
  );
}

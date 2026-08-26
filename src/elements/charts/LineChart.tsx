import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { twMerge } from "tailwind-merge";
import type { ChartData } from "@/lib/types";

type LineGraphProps = {
  data: ChartData[];
  className?: string;
};

export function LineChart({ data, className }: LineGraphProps) {
  const series = data.map((item) => ({
    name: item.title,
    data: Object.entries(item.data).map(([name, data]) => ({
      x: name,
      y: data,
    })),
  }));

  const colors = data.map((item) => {
    return item.color ?? "var(--color-accent)";
  });

  const options: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "inherit",
      zoom: { enabled: false },
      toolbar: {
        show: false
      }
    },
    colors: colors,
    grid: {
      padding: {
        right: 30,
      },
    },
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      labels: {
        style: { colors: "var(--color-primary)" },
        rotate: -90,
      },
      axisBorder: { color: "var(--color-primary)" },
      axisTicks: { color: "var(--color-primary)" },
    },
    yaxis: {
      labels: { style: { colors: "var(--color-primary)" } },
    },
  };

  return (
    <Chart
      type="line"
      series={series}
      options={options}
      height="100%"
      width="100%"
      className={twMerge(
        "rounded-xl border-2 border-primary bg-secondary",
        className,
      )}
    />
  );
}

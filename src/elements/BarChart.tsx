import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { twMerge } from "tailwind-merge";
import type { ChartData } from "@/lib/types";

type BarChartProps = {
  data: ChartData[];
  className?: string;
};

export function BarChart({ data, className }: BarChartProps) {
  const series = data.map((item) => ({
    name: item.title,
    data: Object.entries(item.data).map(([name, data]) => ({
      x: name,
      y: data,
    })),
  }));

  const options: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      zoom: { enabled: false },
    },
    dataLabels: {
      enabled: true,
      offsetX: 25,
      style: { colors: ["#000"] },
    },
    grid: {
      padding: {
        left: 50,
        right: 50,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    tooltip: { enabled: false },
  };

  return (
    <Chart
      type="bar"
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

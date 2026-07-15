import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import {twMerge} from "tailwind-merge";

type BarChartData = {
  label: string;
  value: number;
  color?: string;
};

type BarChartProps = {
  data: BarChartData[];
  className?: string;
};

export function BarChart({ data, className }: BarChartProps) {
  const series = [
    {
      name: "Score",
      data: data.map((d) => ({
        x: d.label,
        y: d.value,
        fillColor: d.color,
      })),
    },
  ];

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
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    grid: {
      padding: {
        left: 50,
        right: 50,
      },
    },
  };

  return (
    <Chart
      type="bar"
      series={series}
      options={options}
      className={twMerge("bg-secondary", className)}
    />
  );
}

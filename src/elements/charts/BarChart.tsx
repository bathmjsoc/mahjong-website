import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import type { ChartData } from "@/lib/types";

type BarChartProps = {
  data: ChartData[];
};

export function BarChart({ data }: BarChartProps) {
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
      fontFamily: "Helvetica",
    },
    colors: ["#285d33"],
    dataLabels: {
      enabled: true,
      offsetX: 25,
      style: {
        colors: ["#35363a"],
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 5,
        borderRadiusApplication: "end",
        dataLabels: {
          position: "top",
        },
      },
    },
    tooltip: {
      enabled: false,
    },
  };

  return (
    <ReactApexChart
      type="bar"
      series={series}
      options={options}
      height="100%"
      width="100%"
      className="rounded-lg bg-secondary"
    />
  );
}

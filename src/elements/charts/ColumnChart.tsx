import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import type { ChartData } from "@/lib/types";

type ColumnChartProps = {
  data: ChartData[];
  title?: string;
};

export function ColumnChart({ data, title }: ColumnChartProps) {
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
      type: "bar",
      fontFamily: "inherit",
      zoom: { enabled: false },
      toolbar: {
        show: false,
      },
    },
    colors: colors,
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    title: {
      text: title,
      align: "center",
      offsetY: 5,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
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

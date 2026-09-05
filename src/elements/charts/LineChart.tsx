import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import type { ChartData } from "@/lib/types";

type LineGraphProps = {
  data: ChartData[];
  title?: string;
};

export function LineChart({ data, title }: LineGraphProps) {
  const series = data.map((item) => ({
    name: item.title,
    data: Object.entries(item.data).map(([name, data]) => ({
      x: name,
      y: data,
    })),
  }));

  const options: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "inherit",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["var(--color-accent)"],
    stroke: {
      curve: "smooth",
      width: 3,
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
    xaxis: {
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
  };

  return (
    <ReactApexChart
      type="line"
      series={series}
      options={options}
      height="100%"
      width="100%"
      className="rounded-lg bg-secondary"
    />
  );
}

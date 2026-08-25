import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { twMerge } from "tailwind-merge";
import type { ChartData } from "@/lib/types";

type SunburstChartProps = {
  data: ChartData[];
  className?: string;
};

export function SunburstChart({ data, className }: SunburstChartProps) {
  const series = [
    {
      data: data.map((item) => {
        let total = 0;

        const children = Object.entries(item.data).map(([title, data]) => {
          total += data;
          return { x: title, y: data };
        });

        return {
          x: item.title,
          y: total,
          children,
        };
      }),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "sunburst",
      fontFamily: "inherit",
      zoom: { enabled: false },
    },
    dataLabels: {
      enabled: true,
      style: { colors: ["#000"] },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      sunburst: {
        innerSize: "25%",
      },
    },
  };

  return (
    <div>
      <Chart
        // @ts-expect-error: "sunburst" a valid type (but is missing from the list)
        type="sunburst"
        series={series}
        options={options}
        height="100%"
        width="100%"
        className={twMerge(
          "rounded-xl border-2 border-primary bg-secondary",
          className,
        )}
      />
    </div>
  );
}

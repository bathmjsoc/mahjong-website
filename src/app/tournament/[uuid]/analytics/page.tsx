import { LineGraph } from "@/components/LineGraph";

const data = [
  {
    name: "Player A",
    points: [
      { x: "Session A", y: -42 },
      { x: "Session B", y: 87 },
      { x: "Session C", y: -12 },
      { x: "Session D", y: 55 },
      { x: "Session E", y: -93 },
      { x: "Session F", y: 21 },
      { x: "Session G", y: -68 },
      { x: "Session H", y: 4 },
      { x: "Session I", y: -77 },
      { x: "Session J", y: 33 },
    ],
  },
];

export default function AnalyticsPage() {
  return (
    <div className="flex w-3xl flex-col items-center gap-10 p-10">
      <LineGraph data={data} />
    </div>
  );
}

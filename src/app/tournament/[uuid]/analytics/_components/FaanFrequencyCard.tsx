import { ColumnChart } from "@/elements/charts/ColumnChart";
import { countFaanFrequency } from "@/lib/scoring";
import type { Log, Player } from "@/lib/types";

type FaanFrequencyCardProps = {
  logs: Log[];
  player: Player;
};

export function FaanFrequencyCard({ logs, player }: FaanFrequencyCardProps) {
  const faanFrequency = countFaanFrequency(logs, player);
  const faanFrequencyData = [
    {
      title: "Frequency",
      data: faanFrequency,
    },
  ];

  return (
    <div className="h-90 w-150">
      <ColumnChart data={faanFrequencyData} title="FAAN FREQUENCY" />
    </div>
  );
}

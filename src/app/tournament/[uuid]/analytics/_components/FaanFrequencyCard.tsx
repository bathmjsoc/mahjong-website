import { ColumnChart } from "@/elements/charts/ColumnChart";
import { useLogs } from "@/hooks/logs/useLogs";
import { countFaanFrequency } from "@/lib/scoring";
import type { Player } from "@/lib/types";

type FaanFrequencyCardProps = {
  player: Player;
};

export function FaanFrequencyCard({ player }: FaanFrequencyCardProps) {
  const { enabledLogs } = useLogs();

  const faanFrequency = countFaanFrequency(enabledLogs, player);
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

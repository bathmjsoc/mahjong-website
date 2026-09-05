import {
  Activity,
  ChevronsDown,
  ChevronsUp,
  type LucideIcon,
  Swords,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { Player } from "@/lib/types";

type StatisticsCardProps = {
  player: Player;
};

export function StatisticsCard({ player }: StatisticsCardProps) {
  return (
    <div className="flex gap-5">
    </div>
  );
}

type StatisticProps = {
  icon: LucideIcon;
  value: number | string;
  label: string;
  subtext: string;
};

function Statistic({ icon, value, label, subtext }: StatisticProps) {
  const LucideIcon = icon;

  return (
    <div className="flex w-50 flex-col items-center rounded-lg bg-secondary/15 p-2 text-secondary">
      <LucideIcon className="mb-2 size-10" />
      <span className="font-bold text-xl">{value}</span>
      <span className="text-xs uppercase opacity-66">{label}</span>
      <span className="text-[10px] uppercase opacity-66">{subtext}</span>
    </div>
  );
}

import {
  Activity,
  ChevronsDown,
  ChevronsUp,
  type LucideIcon,
  Swords,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useLogs } from "@/hooks/logs/useLogs";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useStatistics } from "@/hooks/useStatistics";
import type { Player } from "@/lib/types";

type StatisticsCardProps = {
  player: Player;
};

export function StatisticsCard({ player }: StatisticsCardProps) {
  const { enabledLogs } = useLogs();
  const { players } = usePlayers();

  const {
    calculateGameStatistics,
    calculatePointStatistics,
    calculateSessionStatistics,
  } = useStatistics();

  const gameStatistics = calculateGameStatistics(enabledLogs, players, player);
  const pointsStatistics = calculatePointStatistics(
    enabledLogs,
    players,
    player,
  );
  const sessionStatistics = calculateSessionStatistics(players, player);

  const playerCount = players.length;

  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-5">
        <Statistic
          icon={Swords}
          value={gameStatistics.games_played.value}
          label="Games Played"
          ranking={`#${gameStatistics.games_played.ranking} of ${playerCount}`}
        />
        <Statistic
          icon={Activity}
          value={pointsStatistics.standard_deviation.value.toFixed(2)}
          label="Standard Deviation"
          ranking={`#${pointsStatistics.standard_deviation.ranking} of ${playerCount}`}
        />
      </div>

      <div className="flex flex-col gap-5">
        <Statistic
          icon={ChevronsUp}
          value={sessionStatistics.highest_session_score.value}
          label="Highest Session Score"
          ranking={`#${sessionStatistics.highest_session_score.ranking} of ${playerCount}`}
        />
        <Statistic
          icon={ChevronsDown}
          value={sessionStatistics.lowest_session_score.value}
          label="Lowest Session Score"
          ranking={`#${sessionStatistics.lowest_session_score.ranking} of ${playerCount}`}
        />
      </div>

      <div className="flex flex-col gap-5">
        <Statistic
          icon={TrendingUp}
          value={pointsStatistics.average_points_won.value.toFixed(2)}
          label="Average Points Won"
          ranking={`#${pointsStatistics.average_points_won.ranking} of ${playerCount}`}
        />
        <Statistic
          icon={TrendingDown}
          value={pointsStatistics.average_points_lost.value.toFixed(2)}
          label="Average Points Lost"
          ranking={`#${pointsStatistics.average_points_lost.ranking} of ${playerCount}`}
        />
      </div>
    </div>
  );
}

type StatisticProps = {
  icon: LucideIcon;
  value: number | string;
  label: string;
  ranking: string;
};

function Statistic({ icon, value, label, ranking }: StatisticProps) {
  const LucideIcon = icon;

  return (
    <div className="flex w-50 flex-col items-center rounded-lg bg-secondary/15 p-2 text-secondary">
      <LucideIcon className="mb-2 size-10" />
      <span className="font-bold text-xl">{value}</span>
      <span className="text-xs uppercase opacity-66">{label}</span>
      <span className="text-[10px] uppercase opacity-66">{ranking}</span>
    </div>
  );
}

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
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { getPointDeltas } from "@/lib/scoring";
import type { Player } from "@/lib/types";

type StatisticsCardProps = {
  player: Player;
};

export function StatisticsCard({ player }: StatisticsCardProps) {
  const { enabledLogs, sessionScores } = useLogs();
  const { players } = usePlayers();
  const { scoringRulesMap } = useTournaments();

  const gameStatistics = calculateGameStatistics();
  const pointsStatistics = calculatePointsStatistics();
  const sessionStatistics = calculateSessionStatistics();

  const playerCount = players.length;

  function calculateGameStatistics() {
    const playerTotals: Record<string, number> = Object.fromEntries(
      players.map((player) => [player.id, 0]),
    );

    for (const log of enabledLogs) {
      for (const player of log.winner_ids) {
        if (player in playerTotals) playerTotals[player]++;
      }
      for (const player of log.loser_ids) {
        if (player in playerTotals) playerTotals[player]++;
      }
      for (const player of log.other_ids) {
        if (player in playerTotals) playerTotals[player]++;
      }
    }

    const currentPlayerGames = playerTotals[player.id] ?? 0;
    const allPlayerGames = players.map(
      (player) => playerTotals[player.id] ?? 0,
    );

    const gamesPlayed = currentPlayerGames;
    const gamesPlayedRank =
      allPlayerGames.filter((games) => {
        return games > currentPlayerGames;
      }).length + 1;

    return {
      games_played: {
        value: gamesPlayed,
        ranking: gamesPlayedRank,
      },
    };
  }

  function calculatePointsStatistics() {
    function avg(values: number[]) {
      if (!values.length) return 0;
      return values.reduce((sum, value) => sum + value, 0) / values.length;
    }

    function stdDev(values: number[]) {
      const mean = avg(values);
      const variance = avg(values.map((value) => (value - mean) ** 2));
      return Math.sqrt(variance);
    }

    function getMetrics(player: Player) {
      const pointsWon: number[] = [];
      const pointsLost: number[] = [];

      for (const log of enabledLogs) {
        const delta = getPointDeltas(log.faan, log.win_type, scoringRulesMap);

        if (log.winner_ids.includes(player.id)) {
          pointsWon.push(delta.winner);
        } else if (log.loser_ids.includes(player.id)) {
          pointsLost.push(delta.loser);
        }
      }

      return {
        avg_won: avg(pointsWon),
        avg_lost: avg(pointsLost),
        std_dev: stdDev([...pointsWon, ...pointsLost]),
      };
    }

    const currentPlayerMetrics = getMetrics(player);
    const allPlayerMetrics = players.map((player) => getMetrics(player));

    const averagePointsWon = currentPlayerMetrics.avg_won;
    const averagePointsWonRank =
      allPlayerMetrics.filter((metrics) => {
        return metrics.avg_won > averagePointsWon;
      }).length + 1;

    const averagePointsLost = currentPlayerMetrics.avg_lost;
    const averagePointsLostRank =
      allPlayerMetrics.filter((metrics) => {
        return metrics.avg_lost < averagePointsLost;
      }).length + 1;

    const standardDeviation = currentPlayerMetrics.std_dev;
    const standardDeviationRank =
      allPlayerMetrics.filter((metrics) => {
        return metrics.std_dev < standardDeviation;
      }).length + 1;

    return {
      average_points_won: {
        value: averagePointsWon,
        ranking: averagePointsWonRank,
      },
      average_points_lost: {
        value: averagePointsLost,
        ranking: averagePointsLostRank,
      },
      standard_deviation: {
        value: standardDeviation,
        ranking: standardDeviationRank,
      },
    };
  }

  function calculateSessionStatistics() {
    function getScores(id: string) {
      return Object.values(sessionScores)
        .map((session) => session[id])
        .filter((score) => score !== undefined);
    }

    const currentPlayerScores = getScores(player.id);
    const allPlayerScores = players.map((player) => getScores(player.id));

    const lowestSessionScore = Math.min(...currentPlayerScores);
    const lowestSessionScoreRank =
      allPlayerScores.filter((scores) => {
        return scores.length > 0 && Math.min(...scores) < lowestSessionScore;
      }).length + 1;

    const highestSessionScore = Math.max(...currentPlayerScores);
    const highestSessionScoreRank =
      allPlayerScores.filter((scores) => {
        return scores.length > 0 && Math.max(...scores) > highestSessionScore;
      }).length + 1;

    return {
      highest_session_score: {
        value: highestSessionScore,
        ranking: highestSessionScoreRank,
      },
      lowest_session_score: {
        value: lowestSessionScore,
        ranking: lowestSessionScoreRank,
      },
    };
  }

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

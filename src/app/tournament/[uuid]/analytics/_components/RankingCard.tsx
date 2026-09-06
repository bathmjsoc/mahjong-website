import { ArrowDown, ArrowUp, Minus, Trophy } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useLogs } from "@/hooks/logs/useLogs";
import { usePlayers } from "@/hooks/players/usePlayers";
import type { Player } from "@/lib/types";
import { getOrdinalSuffix } from "@/lib/utils";
import { useSessionContext } from "@/providers/SessionProvider";

type RankingCardProps = {
  player: Player;
};

export function RankingCard({ player }: RankingCardProps) {
  const sessionId = useSessionContext();

  const { overallScores, sessionScores } = useLogs();
  const { players } = usePlayers();

  // Current Position
  const playerScore = overallScores[player.id] ?? 0;
  const position =
    players.filter((player) => (overallScores[player.id] ?? 0) > playerScore)
      .length + 1;

  const suffix = getOrdinalSuffix(position);

  // Previous Position
  const previousScores = getPreviousSessionScores();
  const previousPlayerScore = previousScores[player.id] ?? 0;
  const previousPosition =
    players.filter(
      (player) => (previousScores[player.id] ?? 0) > previousPlayerScore,
    ).length + 1;

  const trend = getSessionTrend(previousPosition - position);
  const LucideIcon = trend.icon;

  function getPreviousSessionScores() {
    const previousScores: Record<string, number> = {};

    for (const [id, scores] of Object.entries(sessionScores)) {
      if (id === sessionId) continue;

      for (const [playerId, score] of Object.entries(scores)) {
        previousScores[playerId] = (previousScores[playerId] ?? 0) + score;
      }
    }

    return previousScores;
  }

  function getSessionTrend(trend: number) {
    if (trend > 0) {
      return {
        icon: ArrowUp,
        textColor: "text-positive",
        fillColor: "bg-positive/30",
      };
    } else if (trend < 0) {
      return {
        icon: ArrowDown,
        textColor: "text-negative",
        fillColor: "bg-negative/30",
      };
    } else {
      return {
        icon: Minus,
        textColor: "text-neutral",
        fillColor: "bg-neutral/30",
      };
    }
  }

  return (
    <div className="flex h-85 w-45 flex-col items-center justify-center gap-5 text-secondary">
      <div className="flex size-40 items-center justify-center rounded-full bg-accent/30 shadow-[0_0_30px] shadow-accent/50 ring-2 ring-accent/60 brightness-150">
        <Trophy className="size-20" strokeWidth={1.5} />
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-baseline">
          <span className="font-bold text-5xl">{position}</span>
          <span className="font-bold text-2xl">{suffix}</span>
        </div>
        <span className="text-sm uppercase opacity-66">Ranking</span>
      </div>

      <div
        className={twMerge(
          "flex gap-2 rounded-full px-3 py-1",
          trend.fillColor,
          trend.textColor,
        )}
      >
        <LucideIcon className="size-4" />
        <span className="font-bold text-xs">Session Trend</span>
      </div>
    </div>
  );
}

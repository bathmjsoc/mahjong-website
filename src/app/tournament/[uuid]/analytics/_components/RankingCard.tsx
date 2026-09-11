import { Trophy } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useStatistics } from "@/hooks/useStatistics";
import { getSessionTrend } from "@/lib/scoring";
import type { Player } from "@/lib/types";
import { getOrdinalSuffix } from "@/lib/utils";

type RankingCardProps = {
  player: Player;
};

export function RankingCard({ player }: RankingCardProps) {
  const { calculateRankingStatistics } = useStatistics();

  const rankingStatistics = calculateRankingStatistics(player);
  const currentRank = rankingStatistics.current_standing.ranking;
  const previousRank = rankingStatistics.previous_standing.ranking;

  const suffix = getOrdinalSuffix(currentRank);
  const trend = getSessionTrend(currentRank, previousRank);
  const TrendIcon = trend.icon;

  return (
    <div className="flex h-90 w-45 flex-col items-center justify-center gap-5 text-secondary">
      <div className="flex size-40 items-center justify-center rounded-full bg-accent/30 shadow-[0_0_30px] shadow-accent/50 ring-2 ring-accent/60 brightness-150">
        <Trophy className="size-20" strokeWidth={1.5} />
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-baseline">
          <span className="font-bold text-5xl">{currentRank}</span>
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
        <TrendIcon className="size-4" />
        <span className="font-bold text-xs">Session Trend</span>
      </div>
    </div>
  );
}

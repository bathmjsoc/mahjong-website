import { Trophy } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useStatistics } from "@/hooks/useStatistics";
import type { Player } from "@/lib/types";
import { getSessionTrend } from "@/lib/ui";
import { getOrdinalSuffix } from "@/lib/utils";

type RankingCardProps = {
  player: Player;
};

export function RankingCard({ player }: RankingCardProps) {
  const { calculateRankingStatistics } = useStatistics();

  const rankingStatistics = calculateRankingStatistics(player);
  const currentRank = rankingStatistics.current_standing.ranking;
  const previousRank = rankingStatistics.previous_standing.ranking;

  const trend = getSessionTrend(currentRank, previousRank);
  const LucideIcon = trend.icon;

  return (
    <div className="text-secondary flex h-90 w-45 flex-col items-center justify-center gap-5">
      <div className="bg-accent/30 shadow-accent/50 ring-accent/60 flex size-40 items-center justify-center rounded-full shadow-[0_0_30px] ring-2 brightness-150">
        <Trophy className="size-20" strokeWidth={1.5} />
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-baseline">
          <span className="text-5xl font-bold">{currentRank}</span>
          <span className="text-2xl font-bold">
            {getOrdinalSuffix(currentRank)}
          </span>
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
        <span className="text-xs font-bold">Session Trend</span>
      </div>
    </div>
  );
}

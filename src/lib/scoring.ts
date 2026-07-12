import type { Log, PointDelta, ScoringRule, WinType } from "@/lib/types";

export function getPlayerScores(
  logs: Log[],
  scoringRules: ScoringRule[],
): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const log of logs) {
    const rule = scoringRules.find((rule) => log.faan === rule.faan);
    const pointDelta = rule?.deltas[log.win_type];

    if (!pointDelta) continue;

    for (const winner of log.winner_ids) {
      scores[winner] = (scores[winner] ?? 0) + pointDelta.winner;
    }

    for (const loser of log.loser_ids) {
      scores[loser] = (scores[loser] ?? 0) + pointDelta.loser;
    }
  }

  return scores;
}

export function getPointDeltas(
  faan: number | null,
  winType: WinType,
  scoringRules: ScoringRule[],
): PointDelta {

  if (faan === null) {
    return { winner: 384, loser: -384 }
  }

  const scoringRule = scoringRules.find((rule) => rule.faan === faan);
  return scoringRule?.deltas[winType] ?? { winner: 0, loser: 0 };
}

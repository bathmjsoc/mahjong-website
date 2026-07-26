import type {
  Log,
  Player,
  PointDelta,
  ScoringRule,
  WinType,
} from "@/lib/types";

/*
 * Calculates the cumulative score for each player from the provided logs and scoring rules
 */
export function getPlayerScores(
  logs: Log[],
  scoringRules: ScoringRule[],
): Record<string, number> {
  const scores: Record<string, number> = {};
  const ruleMap = new Map(scoringRules.map((rule) => [rule.faan, rule]));

  for (const log of logs) {
    const scoringRule = ruleMap.get(log.faan);
    const pointDelta = scoringRule?.deltas[log.win_type];

    if (!pointDelta) continue;

    for (const winner of log.winner_ids) {
      scores[winner] = (scores[winner] ?? 0) + pointDelta.winner;
    }

    for (const loser of log.loser_ids) {
      scores[loser] = (scores[loser] ?? 0) + pointDelta.loser;
    }

    for (const other of log.other_ids) {
      scores[other] = scores[other] ?? 0;
    }
  }

  return scores;
}

/*
 * Determine the winner/loser point deltas for a given faan and win type
 */
export function getPointDeltas(
  faan: number | null,
  winType: WinType,
  scoringRules: ScoringRule[],
): PointDelta {
  const scoringRule = scoringRules.find((rule) => rule.faan === faan);
  return scoringRule?.deltas[winType] ?? { winner: 0, loser: 0 };
}

/*
 * Calculate the cumulative point history for a player from the provided logs and scoring rules
 */
export function getPointHistory(
  logs: Log[],
  player: Player,
  scoringRules: ScoringRule[],
) {
  const scores = [0];
  const ruleMap = new Map(scoringRules.map((rule) => [rule.faan, rule]));

  for (const log of logs) {
    const scoringRule = ruleMap.get(log.faan);
    const prevPoints = scores.at(-1) ?? 0;

    if (log.winner_ids.includes(player.id)) {
      const delta = scoringRule?.deltas?.[log.win_type]?.winner ?? 0;
      scores.push(prevPoints + delta);
    } else if (log.loser_ids.includes(player.id)) {
      const delta = scoringRule?.deltas?.[log.win_type]?.loser ?? 0;
      scores.push(prevPoints + delta);
    } else if (log.other_ids.includes(player.id)) {
      scores.push(prevPoints);
    }
  }

  return scores;
}

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
  scoringRulesMap: Map<number | null, ScoringRule>,
): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const log of logs) {
    const pointDelta = scoringRulesMap.get(log.faan)?.deltas[log.win_type];
    if (!pointDelta) continue;

    for (const winner of log.winner_ids) {
      scores[winner] = (scores[winner] ?? 0) + pointDelta.winner;
    }

    for (const loser of log.loser_ids) {
      scores[loser] = (scores[loser] ?? 0) + pointDelta.loser;
    }

    for (const other of log.other_ids) {
      scores[other] ??= 0;
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
  scoringRulesMap: Map<number | null, ScoringRule>,
): PointDelta {
  const scoringRule = scoringRulesMap.get(faan);
  return scoringRule?.deltas[winType] ?? { winner: 0, loser: 0 };
}

/*
 * Calculate the cumulative point history for a player from the provided logs and scoring rules
 */
export function getPointHistory(
  logs: Log[],
  player: Player,
  scoringRulesMap: Map<number | null, ScoringRule>,
): number[] {
  const scores = [0];

  for (const log of logs) {
    const scoringRule = scoringRulesMap.get(log.faan);
    const prevPoints = scores[scores.length - 1];

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

/*
 * Combines players with their scores and returns them in descending order
 * */
export function rankPlayers(
  players: Player[],
  scores: Record<string, number>,
): [Player, number][] {
  return players
    .map((player): [Player, number] => [player, scores[player.id] ?? 0])
    .sort((a, b) => b[1] - a[1]);
}

/*
 * Maps a score to its corresponding Tailwind background color class
 * */
export function scoreToColor(score: number): string {
  if (score < 0) return "bg-negative";
  if (score > 0) return "bg-positive";
  return "bg-neutral";
}

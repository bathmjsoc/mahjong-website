import type {
  Log,
  Player,
  PointDelta,
  ScoringRulesMap,
  WinType,
} from "@/lib/types";

/*
 * Calculates the cumulative score for each player from the provided logs and scoring rules
 */
export function getPlayerScores(
  logs: Log[],
  scoringRulesMap: ScoringRulesMap,
): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const log of logs) {
    const delta = getPointDeltas(log.faan, log.win_type, scoringRulesMap);

    for (const winner of log.winner_ids) {
      scores[winner] = (scores[winner] ?? 0) + delta.winner;
    }

    for (const loser of log.loser_ids) {
      scores[loser] = (scores[loser] ?? 0) + delta.loser;
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
  scoringRulesMap: ScoringRulesMap,
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
  scoringRulesMap: ScoringRulesMap,
): number[] {
  const scores = [0];

  for (const log of logs) {
    const delta = getPointDeltas(log.faan, log.win_type, scoringRulesMap);
    const previousPoints = scores.at(-1) ?? 0;

    if (log.winner_ids.includes(player.id)) {
      scores.push(previousPoints + delta.winner);
    } else if (log.loser_ids.includes(player.id)) {
      scores.push(previousPoints + delta.loser);
    } else if (log.other_ids.includes(player.id)) {
      scores.push(previousPoints);
    }
  }

  return scores;
}

/*
 * Combines players with their scores and returns them in descending order
 */
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
 */
export function scoreToColor(score: number): string {
  if (score < 0) return "bg-negative";
  if (score > 0) return "bg-positive";
  return "bg-neutral";
}

/*
 * Calculate the number of wins/losses/others (and their subtypes) for a player from the provided logs
 */
export function getGameResults(logs: Log[], player: Player): GameResults {
  const counts = {
    wins: { 打出: 0, 自摸: 0, 包自摸: 0, 詐糊: 0 },
    losses: { 打出: 0, 自摸: 0, 包自摸: 0, 詐糊: 0 },
    others: { 打出: 0, 自摸: 0, 包自摸: 0, 詐糊: 0 },
  };

  for (const log of logs) {
    if (log.winner_ids.includes(player.id)) {
      counts.wins[log.win_type]++;
    } else if (log.loser_ids.includes(player.id)) {
      counts.losses[log.win_type]++;
    } else if (log.other_ids.includes(player.id)) {
      counts.others[log.win_type]++;
    }
  }

  return counts;
}

type GameResults = {
  wins: { 打出: number; 自摸: number; 包自摸: number; 詐糊: number };
  losses: { 打出: number; 自摸: number; 包自摸: number; 詐糊: number };
  others: { 打出: number; 自摸: number; 包自摸: number; 詐糊: number };
};

/*
 * Calculate the number of wins for each faan value for a player from the provided logs
 */
export function countFaanFrequency(
  logs: Log[],
  player: Player,
): Record<number, number> {
  const counts: Record<number, number> = {};

  for (const log of logs) {
    if (log.winner_ids.includes(player.id) && log.faan != null) {
      counts[log.faan] = (counts[log.faan] ?? 0) + 1;
    }
  }

  return counts;
}

import type {
  Log,
  Player,
  PointDelta,
  ScoringRule,
  Session,
  WinType,
} from "@/lib/types";

/*
 * Formats a timestamp into human-readable relative time (e.g., "5 minutes ago")
 * */
export function formatTimeAgo(timestamp: string): string {
  const timestampTime = new Date(timestamp).getTime();
  const delta = Math.round((timestampTime - Date.now()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const cutoffs: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
  ];

  for (const cutoff of cutoffs) {
    if (Math.abs(delta) >= cutoff.seconds) {
      return rtf.format(Math.round(delta / cutoff.seconds), cutoff.unit);
    }
  }

  return rtf.format(delta, "second");
}

/*
 * Maps a score to its corresponding Tailwind background color class
 * */
export function scoreToColor(score: number): string {
  if (score < 0) return "bg-negative";
  if (score > 0) return "bg-positive";
  return "bg-neutral";
}

/*
 * Appends an ordinal suffix to a number (e.g., 1 -> 1st, 2 -> 2nd)
 * */
export function formatPosition(number: number): string {
  const rules = new Intl.PluralRules("en", { type: "ordinal" });
  const suffixes: Record<string, string> = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th",
  };

  return `${number}${suffixes[rules.select(number)]}`;
}

/*
 * Returns a new array with the same items in a random order
 * */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/*
 * Formats a session number into a display name
 * */
export function getSessionName(session: Session | null): string {
  if (!session) return "Overall Standings"; // Special case

  return `Session ${session.number} (${session.start_date})`;
}

/*
 * Combines players with their scores and returns them in descending order
 * */
export function rankPlayers(
  players: Player[],
  scores: Record<string, number>,
): [Player, number][] {
  return players
    .map((player) => ({ player: player, score: scores[player.id] ?? 0 }))
    .sort((a, b) => b.score - a.score)
    .map(({ player, score }) => [player, score]);
}

/*
 * Normalizes text by removing whitespace and converting to lowercase for string comparison
 * */
export function normalizeText(text: string) {
  return text.replace(/\s+/g, "").toLowerCase();
}

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
    const rule = ruleMap.get(log.faan);
    const pointDelta = rule?.deltas[log.win_type];

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

  for (const log of logs) {
    const scoringRule = scoringRules.find((rule) => rule.faan === log.faan);
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

/*
 * Safely extract and trim a string value from FormData
 */
export function parseFormString(
  formData: FormData,
  key: string,
): string | null {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) return null;

  return value.trim();
}

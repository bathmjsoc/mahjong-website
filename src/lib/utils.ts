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
): { player: Player; score: number }[] {
  return players
    .map((player) => ({
      player,
      score: scores[player.id] ?? 0,
    }))
    .sort((a, b) => b.score - a.score);
}

/*
 * Normalizes text by removing whitespace and converting to lowercase for string comparison
 * */
export function normalizeText(text: string) {
  return text.replace(/\s+/g, "").toLowerCase();
}

/*
 * Maps Cantonese Mahjong win types into English tooltips
 */
export const winTypeMap: Record<WinType, string> = {
  打出: "Throw",
  自摸: "Self-Draw",
  包自摸: "Special Case",
  詐糊: "False Win",
} as const;

/*
 * Maps Cantonese Mahjong winds into English tooltips
 */
export const windMap: Record<string, string> = {
  東: "East",
  南: "South",
  西: "West",
  北: "North",
} as const;

/*
 * Calculates the cumulative score for each player from the provided logs
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

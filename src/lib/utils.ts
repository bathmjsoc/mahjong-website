import { RELATIVE_TIME_CUTOFFS } from "@/lib/constants";
import type { Player, Session } from "@/types/app.types";

/*
 * Formats a timestamp into human-readable relative time (e.g., "5 minutes ago")
 * */
export function formatTimeAgo(timestamp: string): string {
  const timestampTime = new Date(timestamp).getTime();
  const delta = Math.round((timestampTime - Date.now()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const cutoff of RELATIVE_TIME_CUTOFFS) {
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

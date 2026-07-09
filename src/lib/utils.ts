import type { Player, Session } from "@/lib/types";

/*
 * Formats a date object as a relative string (e.g., "5 minutes ago")
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
 * Maps a score to a Tailwind background color class
 * */
export function scoreToColor(score: number): string {
  if (score < 0) return "bg-negative";
  if (score > 0) return "bg-positive";
  return "bg-neutral";
}

/*
 * Formats a number as an ordinal (e.g., 1 -> 1st)
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
 * Returns shuffled copy of an array
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
 * Formats a session name using number and start_date
 * */
export function getSessionName(session: Session): string {
  return session.number === -1
    ? "Overall Standings"
    : `Session ${session.number} (${session.start_date})`;
}

/*
 * Returns a list of players sorted by their corresponding scores
 * */
export function rankPlayers(
  players: Player[],
  scores: Record<string, number>,
): Player[] {
  return players
    .map((player) => ({
      ...player,
      score: scores[player.id] ?? 0,
    }))
    .sort((a, b) => b.score - a.score);
}

/*
 * Formats input text in a standardized manner for comparison purposes
 * */
export function normalizeText(text: string) {
  return text.replaceAll(" ", "").toLowerCase();
}

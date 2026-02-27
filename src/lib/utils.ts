import type { Log, Player, Session } from "@/lib/types";

/*
 * Formats a date object as a relative string (e.g., "5 minutes ago")
 * */
export function formatTimeAgo(date: Date): string {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const cutoffs: { unit: Intl.RelativeTimeFormatUnit; secs: number }[] = [
    { unit: "year", secs: 31536000 },
    { unit: "month", secs: 2592000 },
    { unit: "week", secs: 604800 },
    { unit: "day", secs: 86400 },
    { unit: "hour", secs: 3600 },
    { unit: "minute", secs: 60 },
  ] as const;

  for (const cutoff of cutoffs) {
    if (Math.abs(seconds) >= cutoff.secs) {
      return rtf.format(Math.round(seconds / cutoff.secs), cutoff.unit);
    }
  }

  return rtf.format(seconds, "second");
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
  const suffixes = ["th", "st", "nd", "rd"] as const;
  const v = number % 100;
  return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
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

export function getPlayerScores(logs: Log[]): Record<string, number> {
  const scoreMap: Record<string, number> = {};

  for (const log of logs) {
    for (const winner of log.winners) {
      scoreMap[winner.id] = (scoreMap[winner.id] || 0) + log.faan;
    }

    for (const loser of log.losers) {
      scoreMap[loser.id] = (scoreMap[loser.id] || 0) - log.faan;
    }
  }

  return scoreMap;
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

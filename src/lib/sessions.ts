import type { Session } from "./types";

export function sortSessionsNewest(sessions: Session[]): Session[] {
  return sessions.slice().sort((a, b) => b.date.getTime() - a.date.getTime());
}

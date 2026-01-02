import type { Player, Session, Table, Wind } from "@/lib/types";

export function sortPlayersAlphabetical(players: Player[]): Player[] {
  return players.slice().sort((a, b) => a.name.localeCompare(b.name));
}

export function sortPlayersDescending(
  players: Player[],
  session: Session,
): Player[] {
  return players
    .slice()
    .sort((a, b) => b.scores.get(session)! - a.scores.get(session)!);
}

export function getActivePlayers(players: Player[], session: Session) {
  return players.filter((player) => player.scores.has(session));
}

export function getPlayerScore(player: Player, session: Session) {
  if (session.number !== -1) {
    return player.scores.get(session) ?? null;
  }

  const scores = Array.from(player.scores.values());
  return scores.reduce((sum, score) => sum + score, 0);
}

export function getSeatOccupant(table: Table, wind: Wind): Player | null {
  return table.members.get(wind) ?? null;
}

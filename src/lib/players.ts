import { generateSessions } from "@/lib/sessions";
import type { Player, Session, Table, Wind } from "@/lib/types";

export function sortAlphabetical(players: Player[]): Player[] {
  return players.slice().sort((a, b) => a.name.localeCompare(b.name));
}

export async function sortPlayersDescending(
  tournamentUuid: string,
  session: Session,
): Promise<Player[]> {
  const players = await fetchPlayers(tournamentUuid);
  const presentPlayers = getPlayersFromSession(players, session);

  return presentPlayers
    .slice()
    .sort((a, b) => b.scores.get(session)! - a.scores.get(session)!);
}

function getPlayersFromSession(players: Player[], session: Session) {
  return players.filter((player) => player.scores.has(session));
}

export async function fetchPlayers(tournamentUuid: string): Promise<Player[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`fetchPlayers(tournamentUuid=${tournamentUuid})`);
  return generatePlayers(50);
}

export function getPlayerAt(table: Table, wind: Wind): Player | null {
  return table.members.get(wind) ?? null;
}

export async function setPlayerAt(
  table: Table,
  wind: Wind,
  playerUuid: string,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(
    `setPlayerAt(table=${table.number}, wind=${wind}, playerUuid=${playerUuid})`,
  );
}

export async function registerPlayer(playerUuid: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`registerPlayer(playerUuid=${playerUuid})`);
}

export async function deregisterPlayer(playerUuid: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`deregisterPlayer(playerUuid=${playerUuid})`);
}

// TODO: Replace with database fetch
export function generatePlayers(num: number): Player[] {
  return Array.from(
    { length: num },
    (_, i): Player => ({
      uuid: crypto.randomUUID(),
      name: `Player ${i + 1}`,
      scores: new Map<Session, number>([
        [generateSessions(3)[0], Math.floor(Math.random() * 1000) - 500],
        [generateSessions(3)[1], Math.floor(Math.random() * 1000) - 500],
        [generateSessions(3)[2], Math.floor(Math.random() * 1000) - 500],
      ]),
    }),
  );
}

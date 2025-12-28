import type { Player, Table, Wind } from "@/lib/types";

export function sortAlphabetical(players: Player[]): Player[] {
  return players.slice().sort((a, b) => a.name.localeCompare(b.name));
}

export function sortDescending(players: Player[]): Player[] {
  return players.slice().sort((a, b) => b.score - a.score);
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
    `setPlayerAt(table=${table.id}, wind=${wind}, playerUuid=${playerUuid})`,
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
function generatePlayers(num: number): Player[] {
  return Array.from(
    { length: num },
    (_, i): Player => ({
      uuid: crypto.randomUUID(),
      name: `Player ${i + 1}`,
      score: Math.floor(Math.random() * 1000) - 500,
    }),
  );
}

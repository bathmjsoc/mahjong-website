"use server";

import { generatePlayers } from "@/lib/mock";
import type { Player, Table, Wind } from "@/lib/types";

// TODO: Replace with database fetch
export async function fetchPlayers(tournamentUuid: string): Promise<Player[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`fetchPlayers(tournamentUuid=${tournamentUuid})`);
  return generatePlayers(50);
}

export async function handleSetSeatOccupant(
  tournamentUuid: string,
  table: Table,
  wind: Wind,
  player: Player | null,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(
    `setPlayerAt(tournamentUuid=${tournamentUuid}, tableNumber=${table.number}, wind=${wind}, playerUuid=${player?.uuid ?? null})`,
  );
}

export async function handleRegisterPlayer(
  tournamentUuid: string,
  player: Player,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(
    `registerPlayer(tournamentUuid=${tournamentUuid}, playerUuid=${player.uuid})`,
  );
}

export async function handleDeregisterPlayer(
  tournamentUuid: string,
  player: Player,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(
    `deregisterPlayer(tournamentUuid=${tournamentUuid}, playerUuid=${player.uuid})`,
  );
}

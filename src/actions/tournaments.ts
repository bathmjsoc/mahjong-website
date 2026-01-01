"use server";

import { generateTournaments } from "@/lib/mock";
import type { Tournament } from "@/lib/types";

// TODO: Replace with database fetch
export async function fetchTournaments(): Promise<Tournament[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`fetchTournaments()`);
  return generateTournaments(10);
}

export async function createTournament(tournamentName: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`createTournament(tournamentName=${tournamentName})`);
}

export async function getTournamentName(
  tournamentUuid: string,
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`getTournamentName(tournamentUuid=${tournamentUuid})`);
  return "Test Tournament";
}

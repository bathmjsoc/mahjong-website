import type { Tournament } from "@/lib/types";

export function sortTournamentsNewest(tournaments: Tournament[]): Tournament[] {
  return tournaments
    .slice()
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
}

export async function fetchTournaments(): Promise<Tournament[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`fetchTournaments()`);
  return mockTournaments(10);
}

export async function getTournamentName(
  tournamentUuid: string,
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`getTournamentName(tournamentUuid=${tournamentUuid})`);
  return "Test Tournament";
}

export async function createTournament(tournamentName: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`createTournament(tournamentName=${tournamentName})`);
}

// TODO: Replace with database fetch
function mockTournaments(num: number): Tournament[] {
  return Array.from(
    { length: num },
    (_, i): Tournament => ({
      uuid: crypto.randomUUID(),
      name: `Test Tournament ${i + 1}`,
      members: Math.floor(Math.random() * 100),
      lastUpdated: new Date(
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000),
      ),
    }),
  );
}

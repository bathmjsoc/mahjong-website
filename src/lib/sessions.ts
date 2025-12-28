import type { Session } from "./types";

export function sortSessionsNewest(sessions: Session[]): Session[] {
  return sessions.slice().sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function fetchSessions(
  tournamentUuid: string,
): Promise<Session[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`fetchSessions(tournamentUuid=${tournamentUuid})`);
  return mockSessions(10);
}

// TODO: Replace with database fetch
function mockSessions(num: number): Session[] {
  return Array.from(
    { length: num },
    (_, i): Session => ({
      number: num - i,
      date: new Date(Date.now() - 604800000 * i),
    }),
  );
}

"use server";

import { generateSessions } from "@/lib/mock";
import type { Session } from "@/lib/types";

// TODO: Replace with database fetch
export async function fetchSessions(
  tournamentUuid: string,
): Promise<Session[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`fetchSessions(tournamentUuid=${tournamentUuid})`);

  const sessions = generateSessions(10);
  const overall: Session = { number: -1, date: new Date() };

  return [overall, ...sessions];
}

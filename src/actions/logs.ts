"use server";

import { generateLogs } from "@/lib/mock";
import type { Log } from "@/lib/types";

// TODO: Replace with database fetch
export async function fetchLogs(tournamentUuid: string): Promise<Log[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`fetchLogs(tournamentUuid=${tournamentUuid})`);
  return generateLogs(100);
}

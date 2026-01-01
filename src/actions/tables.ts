"use server";

import { generateTables } from "@/lib/mock";
import type { Table } from "@/lib/types";

// TODO: Replace with database fetch
export async function fetchTables(tournamentUuid: string): Promise<Table[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`fetchTables(tournamentUuid=${tournamentUuid})`);
  return generateTables(10);
}

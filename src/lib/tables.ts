import type { Table, Wind } from "@/lib/types";

export function sortTablesId(tables: Table[]): Table[] {
  return tables.slice().sort((a, b) => a.id - b.id);
}

export async function fetchTables(tournamentUuid: string): Promise<Table[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`fetchTables(tournamentUuid=${tournamentUuid})`);
  return generateTables(10);
}

// TODO: Replace with database fetch
function generateTables(num: number): Table[] {
  return Array.from({ length: num }, (_, i) => ({
    id: i + 1,
    members: new Map<Wind, string>([
      ["east", "test"],
      ["south", "test"],
      ["west", "test"],
      ["north", "test"],
    ]),
  }));
}

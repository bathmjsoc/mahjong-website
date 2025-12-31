import { generatePlayers } from "@/lib/players";
import type { Player, Table, Wind } from "@/lib/types";

export function sortTablesId(tables: Table[]): Table[] {
  return tables.slice().sort((a, b) => a.number - b.number);
}

export async function fetchTables(tournamentUuid: string): Promise<Table[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`fetchTables(tournamentUuid=${tournamentUuid})`);
  return generateTables(10);
}

// TODO: Replace with database fetch
function generateTables(num: number): Table[] {
  return Array.from({ length: num }, (_, i) => ({
    number: i + 1,
    members: new Map<Wind, Player | null>([
      ["east", generatePlayers(1)[0]],
      ["south", generatePlayers(1)[0]],
      ["west", generatePlayers(1)[0]],
      ["north", null],
    ]),
  }));
}

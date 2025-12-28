import type { Player, Table, Wind } from "@/lib/types";

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
    members: new Map<Wind, Player | null>([
      [
        "east",
        {
          uuid: crypto.randomUUID(),
          name: `Player ${i + 1} East`,
          score: Math.floor(Math.random() * 1000) - 500,
        },
      ],
      [
        "south",
        {
          uuid: crypto.randomUUID(),
          name: `Player ${i + 1} South`,
          score: Math.floor(Math.random() * 1000) - 500,
        },
      ],
      [
        "west",
        {
          uuid: crypto.randomUUID(),
          name: `Player ${i + 1} West`,
          score: Math.floor(Math.random() * 1000) - 500,
        },
      ],
      ["north", null],
    ]),
  }));
}

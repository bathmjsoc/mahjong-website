import { generatePlayers } from "@/lib/players";
import { generateSessions } from "@/lib/sessions";
import type { Log } from "@/lib/types";

export async function fetchLogs(tournamentUuid: string): Promise<Log[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`fetchLogs(tournamentUuid=${tournamentUuid})`);
  return generateLogs(100);
}

// TODO: Replace with database fetch
const winTypes = ["打出", "自摸", "包自摸"];
function generateLogs(num: number): Log[] {
  return Array.from(
    { length: num },
    (): Log => ({
      id: crypto.randomUUID(),
      winner: generatePlayers(1)[0],
      losers: generatePlayers(3),
      points: 0,
      faan: Math.floor(Math.random() * (10 - 3 + 1)) + 3,
      type: winTypes[Math.floor(Math.random() * 3)],
      session: generateSessions(1)[0],
      date: new Date(),
      others: [],
      disabled: false,
    }),
  );
}

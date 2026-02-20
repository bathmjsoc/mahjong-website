import type { Log, Player, Session } from "@/lib/types";

export function generatePlayers(num: number): Player[] {
  return Array.from(
    { length: num },
    (_, i): Player => ({
      id: crypto.randomUUID(),
      name: `Player ${i + 1}`,
      is_registered: true,
      is_locked: false,
    }),
  );
}

export function generateSessions(num: number): Session[] {
  return Array.from(
    { length: num },
    (_, i): Session => ({
      number: num - i,
      date: new Date(Date.now() - 604800000 * i),
    }),
  );
}

const winTypes = ["打出", "自摸", "包自摸"];
export function generateLogs(num: number): Log[] {
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

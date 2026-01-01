import type {
  Log,
  Player,
  Session,
  Table,
  Tournament,
  Wind,
} from "@/lib/types";

export function generateTables(num: number): Table[] {
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

export function generateTournaments(num: number): Tournament[] {
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

export function generatePlayers(num: number): Player[] {
  return Array.from(
    { length: num },
    (_, i): Player => ({
      uuid: crypto.randomUUID(),
      name: `Player ${i + 1}`,
      scores: new Map<Session, number>([
        [generateSessions(3)[0], Math.floor(Math.random() * 1000) - 500],
        [generateSessions(3)[1], Math.floor(Math.random() * 1000) - 500],
        [generateSessions(3)[2], Math.floor(Math.random() * 1000) - 500],
      ]),
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

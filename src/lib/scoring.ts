import type { Log, WinType } from "@/lib/types";

const SCORING_RULES: Record<
  number,
  Record<string, { winner: number; loser: number; other: number }>
> = {
  0: { 詐糊: { winner: 128, loser: -384, other: 0 } }, // 詐糊

  3: {
    打出: { winner: 16, loser: -16, other: 0 },
    自摸: { winner: 24, loser: -8, other: 0 },
    包自摸: { winner: 24, loser: -2, other: 0 },
  },
  4: {
    打出: { winner: 32, loser: -32, other: 0 },
    自摸: { winner: 48, loser: -16, other: 0 },
    包自摸: { winner: 48, loser: -48, other: 0 },
  },
  5: {
    打出: { winner: 48, loser: -48, other: 0 },
    自摸: { winner: 72, loser: -24, other: 0 },
    包自摸: { winner: 72, loser: -72, other: 0 },
  },
  6: {
    打出: { winner: 64, loser: -64, other: 0 },
    自摸: { winner: 96, loser: -32, other: 0 },
    包自摸: { winner: 96, loser: -96, other: 0 },
  },
  7: {
    打出: { winner: 96, loser: -96, other: 0 },
    自摸: { winner: 144, loser: -48, other: 0 },
    包自摸: { winner: 144, loser: -144, other: 0 },
  },
  8: {
    打出: { winner: 128, loser: -128, other: 0 },
    自摸: { winner: 192, loser: -64, other: 0 },
    包自摸: { winner: 192, loser: -192, other: 0 },
  },
  9: {
    打出: { winner: 192, loser: -192, other: 0 },
    自摸: { winner: 288, loser: -96, other: 0 },
    包自摸: { winner: 288, loser: -288, other: 0 },
  },
  10: {
    打出: { winner: 256, loser: -256, other: 0 },
    自摸: { winner: 384, loser: -128, other: 0 },
    包自摸: { winner: 384, loser: -384, other: 0 },
  },
};

export function getPlayerScores(logs: Log[]): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const log of logs) {
    const rule = SCORING_RULES[log.faan]?.[log.win_type];
    if (!rule) continue;

    for (const winner of log.winner_ids) {
      scores[winner] = (scores[winner] ?? 0) + rule.winner;
    }

    for (const loser of log.loser_ids) {
      scores[loser] = (scores[loser] ?? 0) + rule.loser;
    }

    for (const other of log.other_ids) {
      scores[other] = (scores[other] ?? 0) + rule.other;
    }
  }

  return scores;
}

export function getPointDeltas(
  faan: number,
  winType: WinType,
): Record<string, number> {
  const rule = SCORING_RULES[faan]?.[winType];

  if (!rule) {
    return { winner: 0, loser: 0, other: 0 };
  }

  return rule;
}

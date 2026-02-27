import type { Log } from "@/lib/types";

const SCORING_RULES: Record<
  number,
  Record<string, { winner: number; loser: number }>
> = {
  0: { 詐糊: { winner: 128, loser: -384 } }, // 詐糊

  3: {
    打出: { winner: 16, loser: -16 },
    自摸: { winner: 24, loser: -8 },
    包自摸: { winner: 24, loser: -24 },
  },
  4: {
    打出: { winner: 32, loser: -32 },
    自摸: { winner: 48, loser: -16 },
    包自摸: { winner: 48, loser: -48 },
  },
  5: {
    打出: { winner: 48, loser: -48 },
    自摸: { winner: 72, loser: -24 },
    包自摸: { winner: 72, loser: -72 },
  },
  6: {
    打出: { winner: 64, loser: -64 },
    自摸: { winner: 96, loser: -32 },
    包自摸: { winner: 96, loser: -96 },
  },
  7: {
    打出: { winner: 96, loser: -96 },
    自摸: { winner: 144, loser: -48 },
    包自摸: { winner: 144, loser: -144 },
  },
  8: {
    打出: { winner: 128, loser: -128 },
    自摸: { winner: 192, loser: -64 },
    包自摸: { winner: 192, loser: -192 },
  },
  9: {
    打出: { winner: 192, loser: -192 },
    自摸: { winner: 288, loser: -96 },
    包自摸: { winner: 288, loser: -288 },
  },
  10: {
    打出: { winner: 256, loser: -256 },
    自摸: { winner: 384, loser: -128 },
    包自摸: { winner: 384, loser: -384 },
  },
};

export function getPlayerScores(logs: Log[]): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const log of logs) {
    const rule = SCORING_RULES[log.faan]?.[log.win_type];
    if (!rule) continue;

    for (const player of log.log_participants) {
      if (player.role === "other") continue;

      const points = player.role === "winner" ? rule.winner : rule.loser;
      scores[player.player_id] = (scores[player.player_id] ?? 0) + points;
    }
  }

  return scores;
}

import type { ScoringRule, WinType } from "@/lib/types";

export const DEFAULT_SCORING_RULE: ScoringRule = {
  faan: 0,
  deltas: {
    打出: { winner: 0, loser: 0 },
    自摸: { winner: 0, loser: 0 },
    包自摸: { winner: 0, loser: 0 },
  },
} as const;

export const DEFAULT_FALSE_WIN_RULE: ScoringRule = {
  faan: null,
  deltas: {
    詐糊: { winner: 0, loser: 0 },
  },
} as const;

export const winTypeMap: Record<WinType, string> = {
  打出: "Throw",
  自摸: "Self-Draw",
  包自摸: "Special Case",
  詐糊: "False Win",
} as const;

export const windMap: Record<string, string> = {
  東: "East",
  南: "South",
  西: "West",
  北: "North",
} as const;

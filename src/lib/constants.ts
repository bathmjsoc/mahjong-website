import type { ScoringRule, WinType } from "@/lib/types";

export const DEFAULT_FALSE_WIN_RULE: ScoringRule = {
  faan: null,
  deltas: {
    詐糊: { winner: 0, loser: 0 },
  },
} as const;

export const DEFAULT_SCORING_RULE: ScoringRule = {
  faan: 0,
  deltas: {
    打出: { winner: 0, loser: 0 },
    自摸: { winner: 0, loser: 0 },
    包自摸: { winner: 0, loser: 0 },
  },
} as const;

type RelativeTimeCutoff = {
  unit: Intl.RelativeTimeFormatUnit;
  seconds: number;
};

export const RELATIVE_TIME_CUTOFFS: RelativeTimeCutoff[] = [
  { unit: "year", seconds: 31536000 },
  { unit: "month", seconds: 2592000 },
  { unit: "week", seconds: 604800 },
  { unit: "day", seconds: 86400 },
  { unit: "hour", seconds: 3600 },
  { unit: "minute", seconds: 60 },
] as const;

export const WIN_TYPE_MAP: Record<WinType, string> = {
  打出: "Throw",
  自摸: "Self-Draw",
  包自摸: "Special Case",
  詐糊: "False Win",
} as const;

export const WIN_TYPES = ["打出", "自摸", "包自摸"] as const;

export const WIND_MAP: Record<string, string> = {
  東: "East",
  南: "South",
  西: "West",
  北: "North",
} as const;

export const WINDS = ["東", "南", "西", "北"] as const;

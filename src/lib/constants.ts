import type { ScoringRule, WinType } from "@/lib/types";

export const DEFAULT_FALSE_WIN_RULE = {
  faan: null,
  deltas: {
    詐糊: { winner: 0, loser: 0 },
  },
} as const satisfies ScoringRule;

export const DEFAULT_SCORING_RULE = {
  faan: 0,
  deltas: {
    打出: { winner: 0, loser: 0 },
    自摸: { winner: 0, loser: 0 },
    包自摸: { winner: 0, loser: 0 },
  },
} as const satisfies ScoringRule;

type RelativeTimeCutoff = {
  unit: Intl.RelativeTimeFormatUnit;
  seconds: number;
};

export const RELATIVE_TIME_CUTOFFS = [
  { unit: "year", seconds: 31536000 },
  { unit: "month", seconds: 2592000 },
  { unit: "week", seconds: 604800 },
  { unit: "day", seconds: 86400 },
  { unit: "hour", seconds: 3600 },
  { unit: "minute", seconds: 60 },
] as const satisfies RelativeTimeCutoff[];

export const WIN_TYPE_MAP = {
  打出: "Throw",
  自摸: "Self-Draw",
  包自摸: "Special Case",
  詐糊: "False Win",
} as const satisfies Record<WinType, string>;

export const WIN_TYPES = ["打出", "自摸", "包自摸"] as const;

export const WIND_MAP = {
  東: "East",
  南: "South",
  西: "West",
  北: "North",
} as const satisfies Record<(typeof WINDS)[number], string>;

export const WINDS = ["東", "南", "西", "北"] as const;

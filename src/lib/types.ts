import type { Tables } from "@/lib/database.types";

// ---------- Database Types ----------
export type Attendance = {
  session_id: string;
  player_id: string;
  registered: boolean;
  locked: boolean;
};

export type Log = {
  id: string;
  tournament_id: string;
  session_id: string;
  faan: number | null;
  win_type: WinType;
  winner_ids: string[];
  loser_ids: string[];
  other_ids: string[];
  timestamp: string;
  disabled: boolean;
};

export type Player = {
  id: string;
  tournament_id: string;
  name: string;
};

export type Session = {
  id: string;
  tournament_id: string;
  number: number;
  start_date: string;
};

export type Table = {
  id: string;
  session_id: string;
  east_id: string | null;
  south_id: string | null;
  west_id: string | null;
  north_id: string | null;
  number: number;
  saved: boolean;
};

export type Tournament = {
  id: string;
  user_id: string;
  name: string;
  last_updated: string;
  player_count: number;
  scoring_rules: ScoringRule[];
};

// ---------- Other Types ----------
export type ActionState = {
  error?: string;
  success?: boolean;
} | null;

export type LogSearchTag = {
  id: string;
  label: string;
  key: "session" | "type" | "faan" | "player";
  value: string;
};

export type PointsAnimationEvent = {
  faan: number | null;
  winType: WinType;
  winners: Player[];
  losers: Player[];
  others: Player[];
};

export type PointDelta = { winner: number; loser: number };

export type ScoringRule = {
  faan: number | null;
  deltas: Partial<Record<WinType, PointDelta>>;
};

export type Wind = "east" | "south" | "west" | "north";

export type WinType = "打出" | "自摸" | "包自摸" | "詐糊";

// ---------- Supabase Overrides ----------
export type SupabaseTournament = Omit<
  Tables<"tournaments">,
  "scoring_rules"
> & {
  scoring_rules: ScoringRule[];
};

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
  win_type: WinType;
  hand_type: string | null;
  faan: number | null;
  winner_ids: string[];
  loser_ids: string[];
  other_ids: string[];
  winner_points: number;
  loser_points: number;
  timestamp: string;
  disabled: boolean;
};

export type Player = {
  id: string;
  tournament_id: string;
  name: string;
  deleted: boolean;
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
  hand_types: string[];
};

// ---------- Other Types ----------
export type ChartData = {
  title: string;
  data: Record<string, number>;
  color?: string;
};

export type FormResult = { success: true } | { success: false; error: string };

export type LogSearchTag = {
  id: string;
  label: string;
  key: "session" | "type" | "faan" | "player";
  value: string;
};

export type PointDelta = { winner: number; loser: number };

export type PointsAnimationEvent = {
  winners: Player[];
  losers: Player[];
  winnerPoints: number;
  loserPoints: number;
};

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

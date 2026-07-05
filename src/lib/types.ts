export type Attendance = {
  session_id: string;
  player_id: string;
  registered: boolean;
  locked: boolean;
};

export type Log = LogEntry & {
  session_number: number; // Derived locally
  winners: Player[]; // Derived locally
  losers: Player[]; // Derived locally
};

export type LogEntry = {
  id: string;
  session_id: string;
  win_type: WinType;
  faan: number;
  disabled: boolean;
  log_participants: LogParticipant[]; // Derived locally
};

export type LogParticipant = {
  player_id: string;
  role: LogRole;
};

export type LogRole = "winner" | "loser" | "other";

export type LogSearchTag = {
  id: string;
  display: string;
  key: "session" | "type" | "faan" | "player";
  value: string;
};

export type Player = {
  id: string;
  name: string;
};

export type Session = {
  id: string;
  tournament_id: string;
  start_date: string;
  number: number; // Derived locally
};

export type Table = {
  id: string;
  east_id: string;
  south_id: string;
  west_id: string;
  north_id: string;
  number: number;
  saved: boolean;
};

export type Tournament = {
  id: string;
  name: string;
  last_updated: Date;
  player_count: number; // Derived locally
};

export type Wind = "east" | "south" | "west" | "north";

export type WinType = "打出" | "自摸" | "包自摸" | "詐糊";

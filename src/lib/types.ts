export type Attendance = {
  session_id: string;
  player_id: string;
  registered: boolean;
  locked: boolean;
};

export type Log = LogEntry & {
  winners: Player[];
  losers: Player[];
};

export type LogEntry = {
  id: string;
  session_id: string;
  type: string;
  faan: number;
  disabled: boolean;
};

export type LogParticipant = {
  log_id: string;
  player_id: string;
  role: "winner" | "loser" | "other";
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
  saved: boolean;
};

export type Tournament = {
  id: string;
  name: string;
  last_updated: Date;
  player_count: number; // Derived locally
};

export type Wind = "east" | "south" | "west" | "north";

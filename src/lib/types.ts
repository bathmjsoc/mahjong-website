export type Log = {
  id: string;
  type: string;
  winner_ids: string[];
  loser_ids: string[];
  other_ids: string[];
  faan: number;
  session_id: string;
  disabled: boolean;
};

export type Player = {
  id: string;
  name: string;
};

export type Session = {
  id: string;
  number: number;
};

export type Table = {
  id: string;
  east_id: string;
  south_id: string;
  west_id: string;
  north_id: string;
  created_at: string;
  is_saved: boolean;
};

export type Tournament = {
  id: string;
  name: string;
  members: number;
  last_updated: Date;
};

export type Wind = "east" | "south" | "west" | "north";
export type WindKey = keyof Table & `${Wind}_id`;

export type Attendance = {
  session_id: string;
  player_id: string;
  registered: boolean;
  locked: boolean;
};

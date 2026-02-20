export type Log = {
  id: string;
  winner: Player;
  losers: Player[];
  points: number;
  faan: number;
  type: string;
  session: Session;
  date: Date;
  others: Player[];
  disabled: boolean;
};

export type Player = {
  id: string;
  name: string;
  is_registered: boolean;
  is_locked: boolean;
};

export type Session = {
  number: number;
  date: Date;
};

export type Table = {
  id: string;
  east_id: string;
  south_id: string;
  west_id: string;
  north_id: string;
  created_at: string;
};

export type Tournament = {
  id: string;
  name: string;
  members: number;
  last_updated: string;
};

export type Wind = "east" | "south" | "west" | "north";

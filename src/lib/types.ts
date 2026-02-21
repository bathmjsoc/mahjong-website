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
  registered: boolean;
  locked: boolean;
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
};

export type Tournament = {
  id: string;
  name: string;
  members: number;
  last_updated: Date;
};

export type Wind = "east" | "south" | "west" | "north";
export type WindKey = `${Wind}_id`;

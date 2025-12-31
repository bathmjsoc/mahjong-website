export type Player = {
  uuid: string;
  name: string;
  scores: Map<Session, number>;
};

export type Session = {
  number: number;
  date: Date;
};

export type Table = {
  number: number;
  members: Map<Wind, Player | null>;
};

export type Tournament = {
  uuid: string;
  name: string;
  members: number;
  lastUpdated: Date;
};

export type Wind = "east" | "south" | "west" | "north";

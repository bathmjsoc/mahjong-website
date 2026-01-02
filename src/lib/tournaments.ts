import type { Tournament } from "@/lib/types";

export function sortTournamentsNewest(tournaments: Tournament[]): Tournament[] {
  return tournaments
    .slice()
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
}

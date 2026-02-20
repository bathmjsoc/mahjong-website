import type { Tournament } from "@/lib/types";

export function sortTournamentsNewest(tournaments: Tournament[]): Tournament[] {
  return tournaments
    .slice()
    .sort(
      (a, b) =>
        new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime(),
    );
}

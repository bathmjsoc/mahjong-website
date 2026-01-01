import { TournamentCard } from "@/components/TournamentCard";
import { sortTournamentsNewest } from "@/lib/tournaments";
import type { Tournament } from "@/lib/types";

type TournamentListProps = {
  tournaments: Tournament[];
};

export function TournamentList({ tournaments }: TournamentListProps) {
  if (tournaments.length === 0) {
    return (
      <div className="text-(--primary-color) text-sm">
        No tournaments found!
      </div>
    );
  }

  const sortedTournaments = sortTournamentsNewest(tournaments);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
      {sortedTournaments.map((tournament) => (
        <TournamentCard key={tournament.uuid} tournament={tournament} />
      ))}
    </div>
  );
}

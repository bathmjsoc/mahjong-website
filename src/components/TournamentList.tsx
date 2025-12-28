import TournamentCard from "@/components/TournamentCard";
import type { Tournament } from "../lib/types";

interface TournamentListProps {
  tournaments: Tournament[];
}

export default function TournamentList({ tournaments }: TournamentListProps) {
  if (tournaments.length === 0) {
    return (
      <p className="text-sm text-(--primary-color)">No tournaments found!</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.uuid} tournament={tournament} />
      ))}
    </div>
  );
}

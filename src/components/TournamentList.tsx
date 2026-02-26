import { Users } from "lucide-react";
import Link from "next/link";
import type { Tournament } from "@/lib/types";
import { formatTimeAgo } from "@/lib/utils";

type TournamentListProps = {
  tournaments: Tournament[];
};

export function TournamentList({ tournaments }: TournamentListProps) {
  if (tournaments.length === 0) {
    return (
      <div className="text-primary text-xs italic">No tournaments found!</div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,300px)] gap-5 w-full justify-center">
      {tournaments.map((tournament) => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
}

type TournamentCardProps = {
  tournament: Tournament;
};

function TournamentCard({ tournament }: TournamentCardProps) {
  return (
    <Link
      href={`/tournament/${tournament.id}`}
      className="
        bg-primary text-secondary
        flex flex-col gap-10 p-3 rounded-lg
        transition duration-300 hover:scale-97 active:scale-95
      "
    >
      {/* Tournament Name */}
      <span title={tournament.name} className="text-lg">
        {tournament.name}
      </span>

      {/* Tournament Information */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center justify-center gap-1">
          <Users className="size-4" />
          {tournament.members}
        </div>
        Updated {formatTimeAgo(tournament.last_updated)}
      </div>
    </Link>
  );
}

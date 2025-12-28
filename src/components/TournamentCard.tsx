import { Users } from "lucide-react";
import Link from "next/link";
import type { Tournament } from "@/lib/types";
import { formatTimeAgo } from "@/lib/utils";

type TournamentCardProps = {
  tournament: Tournament;
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
  return (
    <Link
      href={`/tournament/${tournament.uuid}`}
      className="
        bg-(--primary-color) text-(--secondary-color)
        w-full max-w-sm space-y-10 p-3 rounded-lg
        transition duration-300 hover:scale-97 active:scale-95
      "
    >
      <h3 title={tournament.name} className="text-lg truncate">
        {tournament.name}
      </h3>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center justify-center gap-1">
          <Users className="size-4" />
          {tournament.members}
        </div>
        <time dateTime={tournament.lastUpdated.toISOString()}>
          Updated {formatTimeAgo(tournament.lastUpdated)}
        </time>
      </div>
    </Link>
  );
}

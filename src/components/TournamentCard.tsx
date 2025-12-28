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
        transition-all duration-300
        hover:scale-97 active:scale-95
      "
    >
      <h3 className="text-lg truncate">{tournament.name}</h3>
      <div className="flex justify-between items-center text-xs">
        <div className="flex">
          <Users className="size-4 mr-1" />
          {tournament.members}
        </div>
        Updated {formatTimeAgo(tournament.lastUpdated)}
      </div>
    </Link>
  );
}

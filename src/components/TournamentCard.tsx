import { UsersIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import type { Tournament } from "@/lib/types";
import { formatTimeAgo } from "@/lib/utils";

export default function TournamentCard({
  tournament,
}: {
  tournament: Tournament;
}) {
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
        <div className="flex items-center space-x-1">
          <UsersIcon className="size-4" />
          <span>{tournament.members}</span>
        </div>

        <span>Updated {formatTimeAgo(tournament.lastUpdated)}</span>
      </div>
    </Link>
  );
}

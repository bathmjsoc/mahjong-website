import { PencilRuler, Play, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EditTournamentModal } from "@/app/dashboard/_components/EditTournamentModal";
import { FilledButton } from "@/elements/FilledButton";
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
    <div className="grid w-full grid-cols-[repeat(auto-fit,300px)] justify-center gap-5">
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col justify-between gap-3 rounded-lg bg-primary p-3 text-secondary">
        <span className="line-clamp-2 text-lg">
          {tournament.name}
        </span>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center justify-between gap-1">
              <Users className="size-4" />
              {tournament.player_count}
            </div>
            Updated {formatTimeAgo(tournament.last_updated)}
          </div>

          <div className="flex gap-3">
            <Link href={`/tournament/${tournament.id}`} className="flex-1">
              <FilledButton className="flex w-full items-center justify-center">
                <Play className="size-5" />
              </FilledButton>
            </Link>

            <FilledButton onClick={() => setIsEditModalOpen(true)}>
              <PencilRuler className="size-5" />
            </FilledButton>
          </div>
        </div>
      </div>

      <EditTournamentModal
        isOpen={isEditModalOpen}
        tournament={tournament}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}

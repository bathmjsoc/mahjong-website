import { PencilRuler, Play, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CreateTournamentModal } from "@/app/dashboard/_components/CreateTournamentModal";
import { FilledButton } from "@/elements/FilledButton";
import type { Tournament } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { EditTournamentModal } from "./EditTournamentModal";

type TournamentListProps = {
  tournaments: Tournament[];
};

export function TournamentList({ tournaments }: TournamentListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <div className="grid w-full grid-cols-[repeat(auto-fit,300px)] justify-center gap-5">
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}

        <div className="flex flex-1 items-center justify-center">
          <FilledButton
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-full p-3"
            title="Create Tournament"
          >
            <Plus className="size-7" />
          </FilledButton>
        </div>
      </div>

      <CreateTournamentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
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
        <span className="line-clamp-2 text-lg">{tournament.name}</span>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center justify-between gap-1">
              <Users className="size-4" />
              {tournament.player_count}
            </div>
            Updated {formatRelativeTime(tournament.last_updated)}
          </div>

          <div className="flex gap-3">
            <Link href={`/tournament/${tournament.id}`} className="flex-1">
              <FilledButton
                className="flex w-full items-center justify-center"
                title="Play Tournament"
              >
                <Play className="size-5" />
              </FilledButton>
            </Link>

            <FilledButton
              onClick={() => setIsEditModalOpen(true)}
              title="Edit Tournament"
            >
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

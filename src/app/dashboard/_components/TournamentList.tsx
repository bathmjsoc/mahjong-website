import { Cog, Play, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FilledButton } from "@/elements/FilledButton";
import type { Tournament } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { CreateTournamentModal } from "./CreateTournamentModal";
import { EditTournamentModal } from "./EditTournamentModal";

type TournamentListProps = {
  tournaments: Tournament[];
};

export function TournamentList({ tournaments }: TournamentListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,300px)] justify-center gap-5">
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}

        <div className="flex h-40 w-75 items-center justify-center">
          <FilledButton
            className="rounded-full p-3"
            onClick={() => setIsCreateModalOpen(true)}
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
  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <div className="flex h-40 w-75 flex-col justify-between rounded-lg bg-primary p-3 text-secondary">
        <span className="line-clamp-2 text-lg">{tournament.name}</span>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-xs">
            <span className="flex gap-1">
              <Users className="size-4" />
              {tournament.player_count}
            </span>
            Updated {formatRelativeTime(tournament.last_updated)}
          </div>

          <div className="flex gap-3">
            <FilledButton
              className="flex w-full justify-center"
              onClick={() => router.push(`/tournament/${tournament.id}`)}
              title="Open Tournament"
            >
              <Play className="size-5" />
            </FilledButton>

            <FilledButton
              onClick={() => setIsEditModalOpen(true)}
              title="Edit Tournament"
            >
              <Cog className="size-5" />
            </FilledButton>
          </div>
        </div>
      </div>

      <EditTournamentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        tournament={tournament}
      />
    </>
  );
}

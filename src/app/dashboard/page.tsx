"use client";

import { useState } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { CreateTournamentModal } from "./_components/CreateTournamentModal";
import { TournamentList } from "./_components/TournamentList";

export default function DashboardPage() {
  const { tournaments } = useTournaments();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-10 p-10">
      <FilledButton
        onClick={() => setIsCreateModalOpen(true)}
        className="w-sm py-3"
      >
        Create New Tournament
      </FilledButton>

      <CreateTournamentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <TournamentList tournaments={tournaments} />
    </div>
  );
}

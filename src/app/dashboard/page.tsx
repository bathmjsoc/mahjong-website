"use client";

import { useState } from "react";
import { fetchTournaments } from "@/actions/tournaments";
import { FilledButton } from "@/elements/FilledButton";
import { CreateTournamentModal } from "./_components/CreateTournamentModal";
import { TournamentList } from "./_components/TournamentList";

export default async function DashboardPage() {
  const tournaments = await fetchTournaments();

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

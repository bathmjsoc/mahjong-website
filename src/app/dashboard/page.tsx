"use client";

import { useState } from "react";
import { CreateTournamentModal } from "@/components/modals/CreateTournamentModal";
import { TournamentList } from "@/components/TournamentList";
import { FilledButton } from "@/elements/FilledButton";
import { useTournaments } from "@/hooks/useTournaments";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { tournaments } = useTournaments();

  return (
    <div className="flex flex-col items-center gap-10 p-10">
      <FilledButton onClick={() => setIsOpen(true)} className="w-sm py-3">
        Create New Tournament
      </FilledButton>

      <CreateTournamentModal
        isOpen={isOpen}
        closeModalAction={() => setIsOpen(false)}
      />

      <TournamentList tournaments={tournaments} />
    </div>
  );
}

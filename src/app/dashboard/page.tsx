"use client";

import { useState } from "react";
import { FilledButton } from "@/elements/FilledButton";
import { useTournaments } from "@/hooks/useTournaments";
import { CreateTournamentModal } from "./_components/CreateTournamentModal";
import { TournamentList } from "./_components/TournamentList";

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

"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { signOut } from "@/actions/auth";
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
        onClick={signOut}
        className="absolute top-3 right-3 size-9 rounded-xl bg-primary hover:text-negative"
      >
        <LogOut className="size-5" />
      </FilledButton>

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

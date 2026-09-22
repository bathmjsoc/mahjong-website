"use client";

import { LogOut } from "lucide-react";
import { signOut } from "@/actions/auth";
import { FilledButton } from "@/elements/FilledButton";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { TournamentList } from "./_components/TournamentList";

export default function DashboardPage() {
  const { tournaments } = useTournaments();

  return (
    <div className="flex items-center justify-center pt-16">
      <FilledButton
        onClick={signOut}
        className="absolute top-3 right-3 size-9 rounded-xl bg-primary hover:text-negative"
        title="Sign Out"
      >
        <LogOut className="size-5" />
      </FilledButton>

      <TournamentList tournaments={tournaments} />
    </div>
  );
}

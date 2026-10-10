"use client";

import { LogOut } from "lucide-react";
import { signOut } from "@/actions/auth";
import { FilledButton } from "@/elements/FilledButton";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { TournamentList } from "./_components/TournamentList";

export default function DashboardPage() {
  const { tournaments } = useTournaments();

  return (
    <>
      <div className="p-16">
        <TournamentList tournaments={tournaments} />
      </div>

      <FilledButton
        className="fixed top-3.5 right-0 rounded-xl bg-primary hover:text-negative"
        onClick={signOut}
        title="Sign Out"
      >
        <LogOut className="size-5" />
      </FilledButton>
    </>
  );
}

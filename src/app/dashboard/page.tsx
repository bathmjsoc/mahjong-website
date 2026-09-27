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
      <div className="pt-16">
        <TournamentList tournaments={tournaments} />
      </div>

      <FilledButton
        onClick={signOut}
        className="fixed top-3 right-3 rounded-xl bg-primary hover:text-negative"
        title="Sign Out"
      >
        <LogOut className="size-5" />
      </FilledButton>
    </>
  );
}

import { LogOut } from "lucide-react";
import type { Metadata } from "next";
import { signOut } from "@/actions/auth";
import { fetchTournaments } from "@/actions/tournaments";
import { CreateTournamentButton } from "@/components/CreateTournamentButton";
import { TournamentList } from "@/components/TournamentList";
import { FilledButton } from "@/elements/FilledButton";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const tournaments = await fetchTournaments();

  return (
    <div className="flex flex-col items-center gap-10 p-10">
      <CreateTournamentButton />
      <TournamentList tournaments={tournaments} />

      <FilledButton
        onClick={signOut}
        className="
          bg-primary absolute top-3 right-3 size-9 rounded-xl
          hover:text-negative
        "
      >
        <LogOut className="size-5" />
      </FilledButton>
    </div>
  );
}

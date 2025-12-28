import type { Metadata } from "next";
import CreateTournamentButton from "@/components/CreateTournamentButton";
import TournamentList from "@/components/TournamentList";
import { fetchTournaments } from "@/lib/tournaments";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function Dashboard() {
  const tournaments = await fetchTournaments();

  return (
    <main className="flex flex-col min-h-dvh items-center p-10 space-y-10">
      <h1 className="text-2xl font-bold">Select a Tournament</h1>
      <CreateTournamentButton />
      <TournamentList tournaments={tournaments} />
    </main>
  );
}

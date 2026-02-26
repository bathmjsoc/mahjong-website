import type { Metadata } from "next";
import { fetchTournaments } from "@/actions/tournaments";
import { CreateTournamentButton } from "@/components/CreateTournamentButton";
import { TournamentList } from "@/components/TournamentList";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const tournaments = await fetchTournaments();

  return (
    <div className="flex flex-col items-center p-10 gap-10">
      <CreateTournamentButton />
      <TournamentList tournaments={tournaments} />
    </div>
  );
}

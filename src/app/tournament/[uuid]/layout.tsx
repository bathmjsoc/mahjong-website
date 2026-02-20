import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fetchLogs } from "@/actions/logs";
import { fetchPlayers } from "@/actions/players";
import { fetchSessions } from "@/actions/sessions";
import { fetchTables } from "@/actions/tables";
import { getTournamentName } from "@/actions/tournaments";
import { Topbar } from "@/components/Topbar";
import { TournamentProvider } from "@/context/TournamentContext";

type TournamentLayoutProps = {
  children: ReactNode;
  params: Promise<{ uuid: string }>;
};

export async function generateMetadata({
  params,
}: TournamentLayoutProps): Promise<Metadata> {
  const { uuid: tournamentId } = await params

  return {
    title: await getTournamentName(tournamentId),
  };
}

export default async function TournamentLayout({
  children,
  params,
}: TournamentLayoutProps) {
  const { uuid: tournamentId } = await params

  const [players, sessions, tables, logs] = await Promise.all([
    fetchPlayers(tournamentId),
    fetchSessions(tournamentId),
    fetchTables(tournamentId),
    fetchLogs(tournamentId),
  ]);

  return (
    <TournamentProvider data={{ tournamentId, sessions, players, tables, logs }}>
      <div className="min-w-max">
        <Topbar />
        <main>{children}</main>
      </div>
    </TournamentProvider>
  );
}

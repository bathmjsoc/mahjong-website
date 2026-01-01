import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fetchLogs } from "@/actions/logs";
import { fetchPlayers } from "@/actions/players";
import { fetchSessions } from "@/actions/sessions";
import { fetchTables } from "@/actions/tables";
import { getTournamentName } from "@/actions/tournaments";
import Topbar from "@/components/Topbar";
import { TournamentProvider } from "@/context/TournamentContext";

type TournamentLayoutProps = {
  children: ReactNode;
  params: Promise<{ uuid: string }>;
};

export async function generateMetadata({
  params,
}: TournamentLayoutProps): Promise<Metadata> {
  const { uuid } = await params;

  return {
    title: await getTournamentName(uuid),
  };
}

export default async function TournamentLayout({
  children,
  params,
}: TournamentLayoutProps) {
  const { uuid } = await params;

  const [players, sessions, tables, logs] = await Promise.all([
    fetchPlayers(uuid),
    fetchSessions(uuid),
    fetchTables(uuid),
    fetchLogs(uuid),
  ]);

  return (
    <TournamentProvider data={{ uuid, sessions, players, tables, logs }}>
      <div className="min-w-max">
        <Topbar />
        <main>{children}</main>
      </div>
    </TournamentProvider>
  );
}

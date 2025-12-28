import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import TableList from "@/components/TableList";
import { fetchPlayers } from "@/lib/players";
import { fetchSessions } from "@/lib/sessions";
import { fetchTables } from "@/lib/tables";
import { getTournamentName } from "@/lib/tournaments";

type PageProps = {
  params: Promise<{ uuid: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { uuid } = await params;

  return {
    title: await getTournamentName(uuid),
  };
}

export default async function TournamentPage({ params }: PageProps) {
  const { uuid } = await params;

  const [players, sessions, tables] = await Promise.all([
    fetchPlayers(uuid),
    fetchSessions(uuid),
    fetchTables(uuid),
  ]);

  return (
    <main className="flex min-h-dvh">
      <Sidebar players={players} sessions={sessions} />
      <TableList tables={tables} players={players} />
    </main>
  );
}

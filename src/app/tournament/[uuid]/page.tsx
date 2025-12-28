import ManageTableButtons from "@/components/ManageTableButtons";
import Sidebar from "@/components/Sidebar";
import TableList from "@/components/TableList";
import { fetchPlayers } from "@/lib/players";
import { fetchSessions } from "@/lib/sessions";
import { fetchTables } from "@/lib/tables";

type PageProps = {
  params: Promise<{ uuid: string }>;
};

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
      <section className="flex flex-col items-center w-full h-min">
        <ManageTableButtons />
        <TableList tables={tables} players={players} />
      </section>
    </main>
  );
}

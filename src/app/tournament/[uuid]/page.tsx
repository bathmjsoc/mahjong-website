import ManageTableButtons from "@/components/ManageTableButtons";
import Sidebar from "@/components/Sidebar";
import TableList from "@/components/TableList";

export default function TournamentPage() {
  return (
    <main className="flex min-h-dvh">
      <Sidebar />
      <section className="flex flex-col items-center w-full h-min">
        <ManageTableButtons />
        <TableList />
      </section>
    </main>
  );
}

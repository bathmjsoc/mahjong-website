import { Plus } from "lucide-react";
import TableCard from "@/components/TableCard";
import IconButton from "@/elements/IconButton";
import { sortTablesId } from "@/lib/tables";
import type { Player, Table } from "@/lib/types";

type TableListProps = {
  tables: Table[];
  players: Player[];
};

export default function TableList({ tables, players }: TableListProps) {
  const sortedTables = sortTablesId(tables);

  return (
    <section className="grid grid-cols-[repeat(auto-fit,280px)] gap-10 w-full justify-center">
      {sortedTables.map((table) => (
        <TableCard key={table.id} table={table} players={players} />
      ))}

      {/* Add New Table Button */}
      <div className="flex items-center justify-center size-70">
        <IconButton className={`bg-(--accent-color) rounded-full p-3`}>
          <Plus className="size-10" />
        </IconButton>
      </div>
    </section>
  );
}

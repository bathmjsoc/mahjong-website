import TableCard from "@/components/TableCard";
import { sortTablesId } from "@/lib/tables";
import type { Player, Table } from "@/lib/types";

type TableListProps = {
  tables: Table[];
  players: Player[];
};

export default function TableList({ tables, players }: TableListProps) {
  const sortedTables = sortTablesId(tables);

  return (
    <div className="flex justify-center w-full h-min p-3">
      <div className="grid grid-cols-[repeat(auto-fit,280px)] gap-10 w-full justify-center">
        {sortedTables.map((table) => (
          <TableCard key={table.id} table={table} players={players}></TableCard>
        ))}
      </div>
    </div>
  );
}

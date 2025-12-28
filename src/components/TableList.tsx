import { PaintBucket, Shuffle } from "lucide-react";
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
    <div className="flex flex-col items-center w-full h-min">
      <div className="flex space-x-10 my-7">
        <IconButton className="bg-(--primary-color) rounded-full p-3">
          <PaintBucket className="size-5" />
        </IconButton>
        <IconButton className="bg-(--primary-color) rounded-full p-3">
          <Shuffle className="size-5" />
        </IconButton>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,280px)] gap-10 w-full justify-center">
        {sortedTables.map((table) => (
          <TableCard key={table.id} table={table} players={players}></TableCard>
        ))}
      </div>
    </div>
  );
}

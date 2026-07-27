import { Archive, Plus, Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { FilledButton } from "@/elements/FilledButton";
import { useSessions } from "@/hooks/sessions/useSessions";
import { useTableMutations } from "@/hooks/tables/useTableMutations";
import type { Table } from "@/lib/types";
import { TableSeat } from "./TableSeat";

type TableListProps = {
  tables: Table[];
  className?: string;
};

export function TableList({ tables, className }: TableListProps) {
  const { createTable } = useTableMutations();
  const { currentSession } = useSessions();

  function handleCreateTable() {
    if (!currentSession) return;
    createTable(currentSession);
  }

  return (
    <div
      className={twMerge(
        "grid w-full grid-cols-[repeat(auto-fit,280px)] justify-center gap-10",
        className,
      )}
    >
      {tables.map((table) => (
        <TableCard key={table.id} table={table} />
      ))}

      {/* Add New Table Button */}
      <div className="flex size-70 items-center justify-center">
        <FilledButton onClick={handleCreateTable} className="rounded-full p-3">
          <Plus className="size-7" />
        </FilledButton>
      </div>
    </div>
  );
}

type TableProps = {
  table: Table;
};

function TableCard({ table }: TableProps) {
  const { deleteTable, saveTable } = useTableMutations();

  return (
    <div
      className={twMerge(
        "grid h-70 w-70 grid-cols-5 grid-rows-5",
        table.saved && "opacity-50",
      )}
    >
      <TableSeat
        wind="east"
        table={table}
        gridPosition="row-start-1 col-start-1 col-span-5"
      />
      <TableSeat
        wind="south"
        table={table}
        gridPosition="col-start-1 row-start-1 row-span-5"
        tableClassName="-rotate-90"
        buttonClassName="rotate-90"
      />
      <TableSeat
        wind="west"
        table={table}
        gridPosition="row-start-5 col-start-1 col-span-5"
        tableClassName="flex-row-reverse"
      />
      <TableSeat
        wind="north"
        table={table}
        gridPosition="col-start-5 row-start-1 row-span-5"
        tableClassName="rotate-90"
        buttonClassName="-rotate-90"
      />
      {/* Table Number */}
      <div className="col-start-3 row-start-3 flex items-center justify-center text-7xl text-primary">
        {table.saved ? "S" : table.number}
      </div>

      <div className="col-span-3 col-start-2 row-start-4 flex items-center justify-center gap-5">
        {/* Save Table Button */}
        <FilledButton
          onClick={() => saveTable(table)}
          className="rounded-full bg-primary enabled:hover:text-info"
          disabled={table.saved}
        >
          <Archive className="size-4" />
        </FilledButton>

        {/* Delete Table Button */}
        <FilledButton
          onClick={() => deleteTable(table)}
          className="rounded-full bg-primary hover:text-negative"
        >
          <Trash2 className="size-4" />
        </FilledButton>
      </div>
    </div>
  );
}

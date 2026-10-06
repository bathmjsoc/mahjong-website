import { Archive, Plus, Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { FilledButton } from "@/elements/FilledButton";
import { useTableMutations } from "@/hooks/tables/useTableMutations";
import type { Table } from "@/lib/types";
import { TableSeat } from "./TableSeat";

type TableListProps = {
  tables: Table[];
  className?: string;
};

export function TableList({ tables, className }: TableListProps) {
  const { createTable } = useTableMutations();

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

      <div className="flex size-70 items-center justify-center">
        <FilledButton
          className="rounded-full p-3"
          onClick={createTable}
          title="Add New Table"
        >
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
        "grid size-70 grid-cols-5 grid-rows-5",
        table.saved && "opacity-50",
      )}
    >
      <TableSeat
        gridPosition="row-start-1 col-start-1 col-span-5"
        table={table}
        wind="east"
      />

      <TableSeat
        buttonClassName="rotate-90"
        gridPosition="col-start-1 row-start-1 row-span-5"
        table={table}
        tableClassName="-rotate-90"
        wind="south"
      />

      <TableSeat
        gridPosition="row-start-5 col-start-1 col-span-5"
        table={table}
        tableClassName="flex-row-reverse"
        wind="west"
      />

      <TableSeat
        buttonClassName="-rotate-90"
        gridPosition="col-start-5 row-start-1 row-span-5"
        table={table}
        tableClassName="rotate-90"
        wind="north"
      />

      <div className="col-start-3 row-start-3 flex items-center justify-center text-7xl text-primary">
        {table.saved ? "S" : table.number}
      </div>

      <div className="col-span-3 col-start-2 row-start-4 flex items-center justify-center gap-5">
        <FilledButton
          className="rounded-full bg-primary enabled:hover:text-info"
          disabled={table.saved}
          onClick={() => saveTable(table)}
          title="Save Table"
        >
          <Archive className="size-4" />
        </FilledButton>

        <FilledButton
          className="rounded-full bg-primary hover:text-negative"
          onClick={() => deleteTable(table)}
          title="Delete Table"
        >
          <Trash2 className="size-4" />
        </FilledButton>
      </div>
    </div>
  );
}

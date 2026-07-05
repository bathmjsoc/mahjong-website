"use client";

import { Archive, Plus, Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { createTable, deleteTable, saveTable } from "@/actions/tables";
import { TableSeat } from "@/components/TableSeat";
import { useSessions } from "@/context/SessionContext";
import { FilledButton } from "@/elements/FilledButton";
import type { Table } from "@/lib/types";

type TableListProps = {
  tables: Table[];
  className?: string;
};

export function TableList({ tables, className }: TableListProps) {
  const { currentSession } = useSessions();

  return (
    <div
      className={twMerge(
        "grid grid-cols-[repeat(auto-fit,280px)] gap-10 w-full justify-center",
        className,
      )}
    >
      {tables.map((table) => (
        <TableCard key={table.id} table={table} />
      ))}

      {/* Add New Table Button */}
      <div className="flex items-center justify-center size-70">
        <FilledButton
          onClick={() => createTable(currentSession)}
          className="rounded-full p-3"
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
  return (
    <div
      className={twMerge(
        "grid grid-cols-5 grid-rows-5 w-70 h-70",
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
      <div className="flex items-center justify-center text-primary text-7xl row-start-3 col-start-3">
        {table.saved ? "S" : table.number}
      </div>

      <div className="flex items-center justify-center gap-5 row-start-4 col-start-2 col-span-3">
        {/* Save Table Button */}
        <FilledButton
          onClick={() => saveTable(table)}
          className="bg-primary rounded-full enabled:hover:text-info"
          disabled={table.saved}
        >
          <Archive className="size-4" />
        </FilledButton>

        {/* Delete Table Button */}
        <FilledButton
          onClick={() => deleteTable(table)}
          className="bg-primary rounded-full hover:text-negative"
        >
          <Trash2 className="size-4" />
        </FilledButton>
      </div>
    </div>
  );
}

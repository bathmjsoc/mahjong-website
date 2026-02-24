"use client";

import { Archive, Plus, Trash2 } from "lucide-react";
import { createTable, deleteTable } from "@/actions/tables";
import { TableSeat } from "@/components/TableSeat";
import { useTournament } from "@/context/TournamentContext";
import { IconButton } from "@/elements/IconButton";
import type { Table } from "@/lib/types";

export function TableList() {
  const { tables, tournamentId } = useTournament();

  return (
    <div className="grid grid-cols-[repeat(auto-fit,280px)] gap-10 w-full justify-center">
      {tables.map((table, index) => (
        <TableCard key={table.id} table={table} number={index + 1} />
      ))}

      {/* Add New Table Button */}
      <div className="flex items-center justify-center size-70">
        <IconButton
          onClick={() => createTable(tournamentId)}
          className="bg-(--accent-color) rounded-full p-3"
        >
          <Plus className="size-8" />
        </IconButton>
      </div>
    </div>
  );
}

type TableProps = {
  table: Table;
  number: number;
};

function TableCard({ table, number }: TableProps) {
  return (
    <div className="grid grid-cols-5 grid-rows-5 w-70 h-70">
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
      <div className="flex items-center justify-center text-(--primary-color) text-7xl row-start-3 col-start-3">
        {number}
      </div>

      <div className="flex items-center justify-center gap-5 row-start-4 col-start-2 col-span-3">
        {/* Save Table Button */}
        <IconButton className="hover:text-(--save-color)">
          <div className="bg-(--primary-color) flex items-center justify-center rounded-full size-8">
            <Archive className="size-4" />
          </div>
        </IconButton>

        {/* Delete Table Button */}
        <IconButton
          onClick={() => deleteTable(table)}
          className="hover:text-(--negative-color)"
        >
          <div className="bg-(--primary-color) flex items-center justify-center rounded-full size-8">
            <Trash2 className="size-4" />
          </div>
        </IconButton>
      </div>
    </div>
  );
}

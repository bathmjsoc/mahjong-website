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
    <section className="grid grid-cols-[repeat(auto-fit,280px)] gap-10 w-full justify-center">
      {tables.map((table, index) => (
        <TableCard key={table.id} table={table} number={index} />
      ))}

      {/* Add New Table Button */}
      <div className="flex items-center justify-center size-70">
        <IconButton
          onClick={() => createTable(tournamentId)}
          className="bg-(--accent-color) rounded-full p-3"
        >
          <Plus className="size-10" />
        </IconButton>
      </div>
    </section>
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
        tableClassName="-rotate-90 origin-center"
        buttonClassName="rotate-90"
      />

      <TableSeat
        wind="west"
        table={table}
        gridPosition="row-start-5 col-start-1 col-span-5"
        tableClassName="flex-row-reverse space-x-reverse"
      />

      <TableSeat
        wind="north"
        table={table}
        gridPosition="col-start-5 row-start-1 row-span-5"
        tableClassName="rotate-90 origin-center"
        buttonClassName="-rotate-90"
      />

      {/* Table Number */}
      <div className="flex items-center justify-center text-(--primary-color) text-7xl row-start-3 col-start-3">
        {number + 1}
      </div>

      {/* Save/Delete Buttons */}
      <div className="flex items-center justify-center space-x-5 row-start-4 col-start-2 col-span-3">
        <IconButton className="hover:text-(--save-color)">
          <div className="bg-(--primary-color) flex items-center justify-center rounded-full size-8">
            <Archive className="size-4" />
          </div>
        </IconButton>

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

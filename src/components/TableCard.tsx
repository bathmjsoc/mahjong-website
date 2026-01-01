"use client";

import { Archive, Trash2 } from "lucide-react";
import { TableSeat } from "@/components/TableSeat";
import { IconButton } from "@/elements/IconButton";
import type { Table } from "@/lib/types";

type TableProps = {
  table: Table;
};

export function TableCard({ table }: TableProps) {
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
        {table.number}
      </div>

      {/* Save/Delete Buttons */}
      <div className="flex items-center justify-center space-x-5 row-start-4 col-start-2 col-span-3">
        <IconButton className="hover:text-(--save-color)!">
          <div className="bg-(--primary-color) flex items-center justify-center rounded-full size-8">
            <Archive className="size-4" />
          </div>
        </IconButton>

        <IconButton className="hover:text-(--negative-color)!">
          <div className="bg-(--primary-color) flex items-center justify-center rounded-full size-8">
            <Trash2 className="size-4" />
          </div>
        </IconButton>
      </div>
    </div>
  );
}

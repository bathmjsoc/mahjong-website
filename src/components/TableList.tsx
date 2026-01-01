"use client";

import { Plus } from "lucide-react";
import { TableCard } from "@/components/TableCard";
import { useTournament } from "@/context/TournamentContext";
import { IconButton } from "@/elements/IconButton";

export function TableList() {
  const { sortedTables } = useTournament();

  return (
    <section className="grid grid-cols-[repeat(auto-fit,280px)] gap-10 w-full justify-center">
      {sortedTables.map((table) => (
        <TableCard key={table.number} table={table} />
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

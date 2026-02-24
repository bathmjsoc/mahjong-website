"use client";

import { Shuffle } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { updateTable } from "@/actions/tables";
import { Sidebar } from "@/components/Sidebar";
import { TableList } from "@/components/TableList";
import { useTournament } from "@/context/TournamentContext";
import { IconButton } from "@/elements/IconButton";
import { shuffle } from "@/lib/utils";

export default function TournamentPage() {
  const { players, lockedPlayerIds, tables } = useTournament();
  const [isShaking, setIsShaking] = useState(false);

  async function handleShuffle() {
    setIsShaking(true);

    const availableTables = tables.filter((table) => !table.is_saved);
    const availablePlayers = shuffle(
      players.filter((player) => !lockedPlayerIds.has(player.id)),
    );

    for (const table of availableTables) {
      const [east = null, south = null, west = null, north = null] =
        availablePlayers.splice(0, 4);

      await updateTable(table, { east, south, west, north });
    }

    setIsShaking(false);
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar />

      <div className="flex flex-col items-center w-full overflow-hidden">
        <div className="py-5">
          <IconButton
            onClick={handleShuffle}
            disabled={isShaking}
            className="bg-(--primary-color) rounded-2xl p-3"
          >
            <Shuffle className="size-7" />
          </IconButton>
        </div>

        <div className={twMerge("w-full", isShaking && "animate-shake")}>
          <TableList />
        </div>
      </div>
    </div>
  );
}

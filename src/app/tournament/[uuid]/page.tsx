"use client";

import { Shuffle } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { shuffleTables } from "@/actions/tables";
import { Sidebar } from "@/components/Sidebar";
import { TableList } from "@/components/TableList";
import { WindIndicator } from "@/components/WindIndicator";
import { useTournament } from "@/context/TournamentContext";
import { IconButton } from "@/elements/IconButton";

export default function TournamentPage() {
  const { currentSession, lockedPlayerIds, registeredPlayers, tables } =
    useTournament();
  const [isShaking, setIsShaking] = useState(false);

  async function handleShuffle() {
    setIsShaking(true);

    const availableTables = tables.filter((table) => !table.is_saved);
    const availablePlayers = registeredPlayers.filter(
      (player) => !lockedPlayerIds.has(player.id),
    );

    await shuffleTables(currentSession, availableTables, availablePlayers);

    setIsShaking(false);
  }

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <WindIndicator />

      <div className="flex flex-col items-center w-full overflow-hidden">
        <div className="py-5">
          <IconButton
            onClick={handleShuffle}
            disabled={isShaking}
            className="bg-primary flex gap-2 items-center justify-center px-4 py-2 rounded-lg hover:text-info"
          >
            <Shuffle className="size-5" />
            Shuffle Tables
          </IconButton>
        </div>

        <div className={twMerge("w-full", isShaking && "animate-shake")}>
          <TableList tables={tables} />
        </div>
      </div>
    </div>
  );
}

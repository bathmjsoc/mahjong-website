"use client";

import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { updateTable } from "@/actions/tables";
import { WinSelector } from "@/components/WinSelector";
import { useAttendance } from "@/context/AttendanceContext";
import { usePlayers } from "@/context/PlayerContext";
import { useTables } from "@/context/TableContext";
import { RoundedListbox } from "@/elements/RoundedListbox";
import type { Player, Table, Wind } from "@/lib/types";

type TableSeatProps = {
  table: Table;
  wind: Wind;
  gridPosition: string;
  tableClassName?: string;
  buttonClassName?: string;
};

export function TableSeat({
  table,
  wind,
  gridPosition,
  tableClassName,
  buttonClassName,
}: TableSeatProps) {
  const { lockedPlayerIds, registeredPlayers } = useAttendance();
  const { playerMap } = usePlayers();
  const { duplicatePlayerIds } = useTables();

  const occupantId = table[`${wind}_id`];
  const isDuplicate = occupantId ? duplicatePlayerIds.has(occupantId) : false;
  const isLocked = occupantId ? lockedPlayerIds.has(occupantId) : false;

  const occupant = useMemo(() => {
    if (!occupantId) return null;
    return playerMap[occupantId] ?? null;
  }, [playerMap, occupantId]);

  async function handleSelect(player: Player | null) {
    if (!player) return;

    await updateTable(table, {
      [wind]: player,
    });
  }

  return (
    <div className={twMerge("flex items-center justify-center", gridPosition)}>
      <div
        className={twMerge(
          "flex items-center justify-between gap-1 bg-primary text-secondary",
          "w-50 shrink-0 rounded-full p-1 transition duration-300",
          isLocked && "ring-2 ring-neutral",
          isDuplicate && "ring-2 ring-negative",
          tableClassName,
        )}
      >
        {/* Scoring Menu */}
        <WinSelector
          table={table}
          className={buttonClassName}
          occupant={occupant}
        />

        {/* Player Select Menu */}
        <RoundedListbox<Player>
          value={occupant}
          options={registeredPlayers}
          onChange={handleSelect}
          getOptionLabel={(player) => player.name}
          getOptionKey={(player) => player.id}
          disabled={table.saved}
          emptyMessage="No players found"
          placeholder="[EMPTY]"
          buttonClassName="h-8 text-xs tracking-tighter rounded-full"
          optionsClassName="w-auto"
        />
      </div>
    </div>
  );
}

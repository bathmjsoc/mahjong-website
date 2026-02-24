import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { updateOccupant } from "@/actions/tables";
import { WinSelector } from "@/components/WinSelector";
import { useTournament } from "@/context/TournamentContext";
import { RoundedListbox } from "@/elements/RoundedListbox";
import type { Player, Table, Wind, WindKey } from "@/lib/types";

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
  const { duplicatePlayerIds, players, registeredPlayers } = useTournament();
  const occupantId = table[`${wind}_id` as WindKey];
  const isDuplicate = occupantId ? duplicatePlayerIds.has(occupantId) : false;

  const occupant = useMemo(
    () => players.find((p) => p.id === occupantId) ?? null,
    [players, occupantId],
  );

  async function handleSelect(player: Player | null) {
    if (!player) return;
    await updateOccupant(table, wind, player);
  }

  return (
    <div className={twMerge("flex items-center justify-center", gridPosition)}>
      <div
        className={twMerge(
          "bg-(--primary-color) text-(--secondary-color)",
          "flex items-center justify-between gap-1 rounded-full p-1 w-50 shrink-0",
          isDuplicate && "ring-2 ring-(--negative-color)",
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
          emptyMessage="No players found"
          placeholder="[EMPTY]"
          buttonClassName="h-8 text-xs tracking-tighter rounded-full"
          optionsClassName="w-auto"
        />
      </div>
    </div>
  );
}

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
  const { duplicatePlayers, registeredPlayers } = useTournament();
  const occupant =
    registeredPlayers.find(
      (player) => table[`${wind}_id` as WindKey] === player.id,
    ) ?? null;
  const isDuplicate = occupant ? duplicatePlayers.has(occupant.id) : false;

  async function handleSelect(player: Player | null) {
    if (!player) return;
    await updateOccupant(table, wind, player);
  }

  return (
    <div className={twMerge("flex items-center justify-center", gridPosition)}>
      <div
        className={twMerge(
          "bg-(--primary-color) text-(--secondary-color)",
          "flex items-center justify-between space-x-1 rounded-full p-1 w-50 shrink-0",
          tableClassName,
        )}
      >
        {/* Scoring Menu */}
        <WinSelector table={table} className={buttonClassName} />

        {/* Player Select Menu */}
        <RoundedListbox<Player>
          value={occupant}
          options={registeredPlayers}
          onChange={handleSelect}
          getOptionLabel={(player) => player.name}
          getOptionKey={(player) => player.id}
          emptyMessage="No players found"
          placeholder="[EMPTY]"
          highlight={isDuplicate}
          buttonClassName="h-8 text-xs"
          optionsClassName="w-auto"
        />
      </div>
    </div>
  );
}

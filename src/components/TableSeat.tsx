import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { WinSelector } from "@/components/WinSelector";
import { useTournament } from "@/context/TournamentContext";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { getSeatOccupant } from "@/lib/players";
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
  const { sortedPlayers, setSeatOccupant } = useTournament();

  const occupant = getSeatOccupant(table, wind);
  const [selectedPlayer, setSelectedPlayer] = useState(occupant);

  async function handleSelect(player: Player | null) {
    setSelectedPlayer(player);
    await setSeatOccupant(table, wind, player);
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
          value={selectedPlayer}
          options={sortedPlayers}
          onChange={handleSelect}
          getOptionLabel={(player) => player.name}
          getOptionKey={(player) => player.uuid}
          emptyMessage="No players found"
          placeholder="[EMPTY]"
          buttonClassName="h-8 text-xs"
          optionsClassName="w-auto"
        />
      </div>
    </div>
  );
}

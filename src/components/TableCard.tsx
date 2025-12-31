"use client";

import { Archive, Trash2 } from "lucide-react";
import { useState } from "react";
import DropDown from "@/elements/DropDown";
import IconButton from "@/elements/IconButton";
import RoundedListbox from "@/elements/RoundedListbox";
import { getPlayerAt, setPlayerAt, sortAlphabetical } from "@/lib/players";
import type { Player, Table, Wind } from "@/lib/types";

type seatProps = {
  wind: Wind;
  table: Table;
  players: Player[];
  gridPosition: string;
  tableClassName?: string;
  buttonClassName?: string;
};

const TABLE_BUTTON_CLASS =
  "bg-(--primary-color) flex items-center justify-center rounded-full size-8";

export default function TableCard({
  table,
  players,
}: {
  table: Table;
  players: Player[];
}) {
  return (
    <div className="grid grid-cols-5 grid-rows-5 w-70 h-70">
      <Seat
        wind="east"
        table={table}
        players={players}
        gridPosition="row-start-1 col-start-1 col-span-5"
      />

      <Seat
        wind="south"
        table={table}
        players={players}
        gridPosition="col-start-5 row-start-1 row-span-5"
        tableClassName="rotate-90 origin-center"
        buttonClassName="-rotate-90"
      />

      <Seat
        wind="west"
        table={table}
        players={players}
        gridPosition="row-start-5 col-start-1 col-span-5"
        tableClassName="flex-row-reverse space-x-reverse"
      />

      <Seat
        wind="north"
        table={table}
        players={players}
        gridPosition="col-start-1 row-start-1 row-span-5"
        tableClassName="-rotate-90 origin-center"
        buttonClassName="rotate-90"
      />

      {/* Table Number */}
      <div className="flex items-center justify-center text-(--primary-color) text-7xl row-start-3 col-start-3">
        {table.number}
      </div>

      {/* Save/Delete Buttons */}
      <div className="flex items-center justify-center space-x-5 row-start-4 col-start-2 col-span-3">
        <IconButton className="hover:text-blue-400">
          <div className={TABLE_BUTTON_CLASS}>
            <Archive className="size-4" />
          </div>
        </IconButton>

        <IconButton className="hover:text-red-400">
          <div className={TABLE_BUTTON_CLASS}>
            <Trash2 className="size-4" />
          </div>
        </IconButton>
      </div>
    </div>
  );
}

function Seat({
  wind,
  table,
  players,
  gridPosition,
  tableClassName = "",
  buttonClassName = "",
}: seatProps) {
  const [selectedPlayer, setSelectedPlayer] = useState(
    getPlayerAt(table, wind),
  );

  const sortedPlayers = sortAlphabetical(players);

  async function handleSelect(player: Player | null) {
    if (player) {
      setSelectedPlayer(player);
      await setPlayerAt(table, wind, player.uuid);
    }
  }

  return (
    <div className={`flex items-center justify-center ${gridPosition}`}>
      <div
        className={`
          bg-(--primary-color) text-(--secondary-color) 
          flex items-center justify-between space-x-1 rounded-full p-1 w-50 shrink-0
          ${tableClassName}
        `}
      >
        {/* Scoring Menu */}
        <DropDownMenu className={buttonClassName} />

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
          optionsClassName="w-auto!"
        />
      </div>
    </div>
  );
}

function DropDownMenu({ className }: { className: string }) {
  return (
    <DropDown title="食" buttonClassName={`rounded-full size-8! ${className}`}>
      <DropDown title="打出">
        <DropDown title="some_name">
          <DropDown.Item onClick={() => console.log(`打出`)}>
            Test Option
          </DropDown.Item>
        </DropDown>
      </DropDown>
      <DropDown title="自摸">
        <DropDown title="some_name">
          <DropDown.Item onClick={() => console.log(`自摸`)}>
            Test Option
          </DropDown.Item>
        </DropDown>
      </DropDown>
      <DropDown title="包自摸">
        <DropDown title="some_name">
          <DropDown.Item onClick={() => console.log(`包自摸`)}>
            Test Option
          </DropDown.Item>
        </DropDown>
      </DropDown>
    </DropDown>
  );
}

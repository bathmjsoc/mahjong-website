"use client";

import { ArchiveBoxIcon, TrashIcon } from "@heroicons/react/24/solid";
import DropDown from "@/elements/DropDown";
import IconButton from "@/elements/IconButton";
import RoundedListbox from "@/elements/RoundedListbox";
import { getPlayerAt, setPlayerAt, sortAlphabetical } from "@/lib/players";
import type { Player, Table, Wind } from "@/lib/types";

type seatProps = {
  wind: Wind;
  table: Table;
  playerOptions: { value: string; label: string }[];
  gridPosition: string;
  tableClassName?: string;
  buttonClassName?: string;
};

function Seat({
  wind,
  table,
  playerOptions,
  gridPosition,
  tableClassName = "",
  buttonClassName = "",
}: seatProps) {
  const selectedUuid = getPlayerAt(table, wind);
  const selectedOption = playerOptions.find((p) => p.value === selectedUuid);

  return (
    <div className={`flex items-center justify-center ${gridPosition}`}>
      <div
        className={`
          bg-(--primary-color) text-(--secondary-color) 
          flex items-center justify-between rounded-full p-1 space-x-1 w-50 shrink-0
          ${tableClassName}
        `}
      >
        <DropDown
          title="食"
          buttonClassName={`rounded-full size-8! ${buttonClassName}`}
        >
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

        <RoundedListbox
          value={selectedUuid}
          onChange={(playerUuid) => setPlayerAt(table, wind, playerUuid)}
          selectedLabel={selectedOption?.label}
          buttonClassName="h-8 text-xs"
          optionsClassName="w-auto!"
        >
          {playerOptions.map((option) => (
            <RoundedListbox.Option key={option.value} value={option.value}>
              {option.label}
            </RoundedListbox.Option>
          ))}
        </RoundedListbox>
      </div>
    </div>
  );
}

export default function TableCard({
  table,
  players,
}: {
  table: Table;
  players: Player[];
}) {
  const sortedPlayers = sortAlphabetical(players);
  const playerOptions = sortedPlayers.map((player) => ({
    value: player.uuid,
    label: player.name,
  }));

  return (
    <div className="grid grid-cols-5 grid-rows-5 w-70 h-70">
      <Seat
        wind="east"
        table={table}
        playerOptions={playerOptions}
        gridPosition="row-start-1 col-start-1 col-span-5"
      />

      <Seat
        wind="south"
        table={table}
        playerOptions={playerOptions}
        gridPosition="col-start-5 row-start-1 row-span-5"
        tableClassName="rotate-90 origin-center"
        buttonClassName="-rotate-90"
      />

      <Seat
        wind="west"
        table={table}
        playerOptions={playerOptions}
        gridPosition="row-start-5 col-start-1 col-span-5"
        tableClassName="flex-row-reverse space-x-reverse"
      />

      <Seat
        wind="north"
        table={table}
        playerOptions={playerOptions}
        gridPosition="col-start-1 row-start-1 row-span-5"
        tableClassName="-rotate-90 origin-center"
        buttonClassName="rotate-90"
      />

      <div className="flex items-center justify-center text-(--primary-color) text-7xl row-start-3 col-start-3">
        <span>{table.id}</span>
      </div>

      <div className="flex items-center justify-center space-x-5 row-start-4 col-start-2 col-span-3">
        <IconButton className="hover:text-blue-400">
          <div className="flex items-center justify-center bg-(--primary-color) rounded-full text-md size-8">
            <ArchiveBoxIcon className="size-5" />
          </div>
        </IconButton>

        <IconButton className="hover:text-red-400 ">
          <div className="flex items-center justify-center bg-(--primary-color) rounded-full text-md size-8">
            <TrashIcon className="size-5" />
          </div>
        </IconButton>
      </div>
    </div>
  );
}

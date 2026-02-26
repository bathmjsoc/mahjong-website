"use client";

import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useTournament } from "@/context/TournamentContext";
import { DropDown } from "@/elements/DropDown";
import type { Player, Table } from "@/lib/types";

type WinSelectorProps = {
  table: Table;
  className?: string;
  occupant: Player | null;
};

const FAAN_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10] as const;

export function WinSelector({ table, className, occupant }: WinSelectorProps) {
  const { players } = useTournament();

  const opponents = useMemo(() => {
    const ids = [
      table.east_id,
      table.south_id,
      table.west_id,
      table.north_id,
    ] as const;
    return ids
      .map((id) => players.find((player) => player.id === id) ?? null)
      .filter((player) => player?.id !== occupant?.id);
  }, [table, players, occupant?.id]);

  function handleSelect(
    winType: string,
    faan: number | null,
    player: Player | null,
  ) {
    console.log(`winType=${winType}, faan=${faan}, target=${player?.name}`);
  }

  return (
    <DropDown
      title="食"
      buttonClassName={twMerge("rounded-full size-8", className)}
      disabled={!occupant}
    >
      <DropDown title="打出">
        {opponents.map((player) => (
          <DropDown
            key={player?.id}
            title={player?.name ?? "[EMPTY]"}
            disabled={!player}
          >
            {FAAN_OPTIONS.map((faan) => (
              <DropDown.Item
                key={faan}
                onClick={() => handleSelect("打出", faan, player)}
              >
                {faan}
              </DropDown.Item>
            ))}
          </DropDown>
        ))}
      </DropDown>

      <DropDown title="自摸">
        {FAAN_OPTIONS.map((faan) => (
          <DropDown.Item
            key={faan}
            onClick={() => handleSelect("自摸", faan, null)}
          >
            {faan}
          </DropDown.Item>
        ))}
      </DropDown>

      <DropDown title="包自摸">
        {opponents.map((player) => (
          <DropDown
            key={player?.id}
            title={player?.name ?? "[EMPTY]"}
            disabled={!player}
          >
            {FAAN_OPTIONS.map((faan) => (
              <DropDown.Item
                key={faan}
                onClick={() => handleSelect("包自摸", faan, player)}
              >
                {faan}
              </DropDown.Item>
            ))}
          </DropDown>
        ))}
      </DropDown>

      <div className="border-primary border-t">
        <DropDown.Item
          onClick={() => handleSelect("詐糊", null, occupant)}
          className="text-negative"
        >
          詐糊
        </DropDown.Item>
      </div>
    </DropDown>
  );
}

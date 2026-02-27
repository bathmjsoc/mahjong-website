"use client";

import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useTournament } from "@/context/TournamentContext";
import { DropDown } from "@/elements/DropDown";
import type { Player, Table, WinType } from "@/lib/types";

type WinSelectorProps = {
  table: Table;
  occupant: Player | null;
  className?: string;
};

const FAAN_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10] as const;

export function WinSelector({ table, occupant, className }: WinSelectorProps) {
  const { playerMap } = useTournament();

  const opponents = useMemo(() => {
    if (!occupant) return [];

    const seatIds = [
      table.east_id,
      table.south_id,
      table.west_id,
      table.north_id,
    ] as const;

    return seatIds.map((id) => {
      const player = id ? (playerMap.get(id) ?? null) : null;
      return player === occupant ? null : player;
    });
  }, [table, playerMap, occupant]);

  function handleSelect(
    winType: WinType,
    faan?: number,
    target?: Player | null,
  ) {
    if (!occupant) return;

    const winners: Player[] = [];
    const losers: Player[] = [];
    const others: Player[] = [];

    switch (winType) {
      case "打出":
      case "包自摸":
        winners.push(occupant);
        if (target) losers.push(target);
        opponents.forEach((player) => {
          if (player && !winners.includes(player) && !losers.includes(player)) {
            others.push(player);
          }
        });
        break;

      case "自摸":
        winners.push(occupant);
        opponents.forEach((player) => {
          player && losers.push(player);
        });
        break;

      case "詐糊":
        losers.push(occupant);
        opponents.forEach((player) => {
          player && winners.push(player);
        });
        break;
    }

    console.log(
      `WinType=${winType}, Faan=${faan}, Winners=${winners.map((p) => p.name).join(", ")}, Losers=${losers.map((p) => p.name).join(", ")}, Others=${others.map((p) => p.name).join(", ")}`,
    );
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
          <DropDown.Item key={faan} onClick={() => handleSelect("自摸", faan)}>
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
          onClick={() => handleSelect("詐糊")}
          className="text-negative"
        >
          詐糊
        </DropDown.Item>
      </div>
    </DropDown>
  );
}

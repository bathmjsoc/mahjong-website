"use client";

import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { createLog } from "@/actions/logs";
import { useTournament } from "@/context/TournamentContext";
import { DropDown } from "@/elements/DropDown";
import type { LogParticipant, Player, Table, WinType } from "@/lib/types";

type WinSelectorProps = {
  table: Table;
  occupant: Player | null;
  className?: string;
};

const FAAN_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10] as const;

export function WinSelector({ table, occupant, className }: WinSelectorProps) {
  const { currentSession, playerMap } = useTournament();

  const opponents = useMemo(() => {
    if (!occupant) return [];

    const seatIds = [
      table.east_id,
      table.south_id,
      table.west_id,
      table.north_id,
    ];

    return seatIds
      .map((id) => (id ? (playerMap[id] ?? null) : null))
      .filter((player) => !player || player.id !== occupant.id);
  }, [table, playerMap, occupant]);

  async function handleWin(
    winType: WinType,
    faan: number = 0,
    target?: Player | null,
  ) {
    if (!occupant) return;

    const participants: LogParticipant[] = [];
    const addParticipant = (
      player: Player | null | undefined,
      role: LogParticipant["role"],
    ) => {
      if (player) {
        participants.push({ player_id: player.id, role });
      }
    };

    switch (winType) {
      case "打出":
      case "包自摸":
        addParticipant(occupant, "winner");
        addParticipant(target, "loser");
        opponents
          .filter((player) => player?.id !== target?.id)
          .forEach((player) => {
            addParticipant(player, "other");
          });
        break;

      case "自摸":
        addParticipant(occupant, "winner");
        opponents.forEach((player) => {
          addParticipant(player, "loser");
        });
        break;

      case "詐糊":
        addParticipant(occupant, "loser");
        opponents.forEach((player) => {
          addParticipant(player, "winner");
        });
        break;
    }

    await createLog(currentSession, faan, winType, participants);
  }

  return (
    <DropDown
      title="食"
      buttonClassName={twMerge("rounded-full size-8", className)}
      disabled={!occupant}
    >
      <DropDown title="打出 (Throw)">
        {opponents.map((player) => (
          <DropDown
            key={player?.id}
            title={player?.name ?? "[EMPTY]"}
            disabled={!player}
          >
            {FAAN_OPTIONS.map((faan) => (
              <DropDown.Item
                key={faan}
                onClick={() => handleWin("打出", faan, player)}
              >
                {faan}
              </DropDown.Item>
            ))}
          </DropDown>
        ))}
      </DropDown>

      <DropDown title="自摸 (Self-Draw)">
        {FAAN_OPTIONS.map((faan) => (
          <DropDown.Item key={faan} onClick={() => handleWin("自摸", faan)}>
            {faan}
          </DropDown.Item>
        ))}
      </DropDown>

      <DropDown title="包自摸 (Special Case)">
        {opponents.map((player) => (
          <DropDown
            key={player?.id}
            title={player?.name ?? "[EMPTY]"}
            disabled={!player}
          >
            {FAAN_OPTIONS.map((faan) => (
              <DropDown.Item
                key={faan}
                onClick={() => handleWin("包自摸", faan, player)}
              >
                {faan}
              </DropDown.Item>
            ))}
          </DropDown>
        ))}
      </DropDown>

      <div className="border-primary border-t">
        <DropDown.Item
          onClick={() => handleWin("詐糊")}
          className="text-negative"
        >
          詐糊 (False Win)
        </DropDown.Item>
      </div>
    </DropDown>
  );
}

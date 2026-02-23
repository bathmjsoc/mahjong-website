import { twMerge } from "tailwind-merge";
import { useTournament } from "@/context/TournamentContext";
import { DropDown } from "@/elements/DropDown";
import type { Player, Table } from "@/lib/types";
import { useMemo } from "react";

type WinSelectorProps = {
  table: Table;
  className?: string;
  occupant: Player | null;
};

const FAAN_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10] as const;
const WIN_TYPES = ["打出", "自摸", "包自摸"] as const;

export function WinSelector({ table, className, occupant }: WinSelectorProps) {
  const { players } = useTournament();

  const opponents = useMemo(() => {
    const ids = [table.east_id, table.south_id, table.west_id, table.north_id];
    return ids
      .map((id) => players.find((player) => player.id === id) ?? null)
      .filter((player) => player?.id !== occupant?.id);
  }, [table, players]);

  function handleSelect(winType: string, faan: number, player: Player | null) {
    console.log(`winType=${winType}, faan=${faan}, target=${player?.name}`);
  }

  return (
    <DropDown
      title="食"
      buttonClassName={twMerge("rounded-full size-8", className)}
    >
      {WIN_TYPES.map((type) => {
        if (type === "自摸") {
          return (
            <DropDown key={type} title={type}>
              {FAAN_OPTIONS.map((faan) => (
                <DropDown.Item
                  key={faan}
                  onClick={() => handleSelect(type, faan, null)}
                >
                  {faan}
                </DropDown.Item>
              ))}
            </DropDown>
          );
        }

        return (
          <DropDown key={type} title={type}>
            {opponents.map((player) => (
              <DropDown
                key={player?.id}
                title={player?.name ?? "[EMPTY]"}
                disabled={!player}
              >
                {FAAN_OPTIONS.map((faan) => (
                  <DropDown.Item
                    key={faan}
                    onClick={() => handleSelect(type, faan, player)}
                  >
                    {faan}
                  </DropDown.Item>
                ))}
              </DropDown>
            ))}
          </DropDown>
        );
      })}
    </DropDown>
  );
}

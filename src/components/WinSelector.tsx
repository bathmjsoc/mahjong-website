import { twMerge } from "tailwind-merge";
import { useTournament } from "@/context/TournamentContext";
import { DropDown } from "@/elements/DropDown";
import type { Player, Table } from "@/lib/types";

type WinSelectorProps = {
  table: Table;
  placeholder?: string;
  className?: string;
};

const FAAN_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10] as const;
const WIN_TYPES = ["打出", "自摸", "包自摸"] as const;

export function WinSelector({
  table,
  placeholder = "[EMPTY]",
  className,
}: WinSelectorProps) {
  const { players } = useTournament();

  const tableIds = [
    table.east_id,
    table.south_id,
    table.west_id,
    table.north_id,
  ];
  const tableMembers = tableIds.map(
    (id) => players.find((p) => p.id === id) ?? null,
  );

  function handleSelect(winType: string, player: Player | null, faan: number) {
    console.log(`winType=${winType}, target=${player?.name}, faan=${faan}`);
  }

  return (
    <DropDown
      title="食"
      buttonClassName={twMerge("rounded-full size-8", className)}
    >
      {WIN_TYPES.map((winType) => (
        <DropDown key={winType} title={winType}>
          {tableMembers.map((player) => (
            <DropDown key={player?.id} title={player?.name ?? placeholder}>
              {FAAN_OPTIONS.map((faan) => (
                <DropDown.Item
                  key={faan}
                  onClick={() => handleSelect(winType, player, faan)}
                >
                  {faan}
                </DropDown.Item>
              ))}
            </DropDown>
          ))}
        </DropDown>
      ))}
    </DropDown>
  );
}

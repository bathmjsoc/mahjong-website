import { DropDown } from "@/elements/DropDown";
import type { Player, Table } from "@/lib/types";

type WinSelectorProps = {
  table: Table;
  placeholder?: string;
  className?: string;
};

const WIN_TYPES = ["打出", "自摸", "包自摸"] as const;
const FAAN_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10] as const;
export function WinSelector({
  table,
  placeholder = "[EMPTY]",
  className = "",
}: WinSelectorProps) {
  const tableMembers = Array.from(table.members.entries());

  function handleSelect(winType: string, player: Player | null, faan: number) {
    console.log(`winType=${winType}, target=${player?.name}, faan=${faan}`);
  }

  return (
    <DropDown title="食" buttonClassName={`rounded-full size-8 ${className}`}>
      {WIN_TYPES.map((winType) => (
        <DropDown key={winType} title={winType}>
          {tableMembers.map(([wind, player]) => (
            <DropDown key={wind} title={player?.name ?? placeholder}>
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

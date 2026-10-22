import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { useAttendance } from "@/hooks/attendance/useAttendance";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useTableMutations } from "@/hooks/tables/useTableMutations";
import { useTables } from "@/hooks/tables/useTables";
import type { Player, PointsAnimationEvent, Table, Wind } from "@/lib/types";
import { WinSelector } from "./WinSelector";

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
  const { lockedPlayerIds, registeredPlayerIds } = useAttendance();
  const { playerMap, players } = usePlayers();
  const { updateTable } = useTableMutations();
  const { duplicatePlayerIds } = useTables();

  const [animationPoints, setAnimationPoints] = useState<number>(0);

  const occupantId = table[`${wind}_id`];
  const occupant = (occupantId && playerMap.get(occupantId)) || null;

  const isDuplicate = Boolean(occupantId && duplicatePlayerIds.has(occupantId));
  const isLocked = Boolean(occupantId && lockedPlayerIds.has(occupantId));
  const isRegistered = Boolean(
    occupantId && registeredPlayerIds.has(occupantId),
  );

  const registeredPlayers = players.filter((player) =>
    registeredPlayerIds.has(player.id),
  );

  useEffect(() => {
    if (occupant === null) return;

    const eventName = `points-animation-${table.id}`;

    const handleAnimation = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;

      const {
        winners,
        losers,
        winnerPoints,
        loserPoints,
      }: PointsAnimationEvent = event.detail;

      if (winners.some((player) => player.id === occupant.id)) {
        setAnimationPoints(winnerPoints);
      } else if (losers.some((player) => player.id === occupant.id)) {
        setAnimationPoints(loserPoints);
      }

      setTimeout(() => setAnimationPoints(0), 2000);
    };

    window.addEventListener(eventName, handleAnimation);
    return () => window.removeEventListener(eventName, handleAnimation);
  }, [occupant, table.id]);

  function handleSelect(player: Player | null) {
    updateTable(table, {
      [wind]: player,
    });
  }

  return (
    <div className={twMerge("flex items-center justify-center", gridPosition)}>
      <div
        className={twMerge(
          "bg-primary flex gap-1",
          "w-50 shrink-0 rounded-full p-1 transition duration-300",
          isLocked && "ring-neutral ring-2",
          (isDuplicate || !isRegistered) && "ring-negative ring-2",
          tableClassName,
        )}
      >
        <WinSelector
          className={buttonClassName}
          occupant={occupant}
          table={table}
        />

        <RoundedListbox<Player | null>
          buttonClassName="text-xs tracking-tighter rounded-full"
          disabled={table.saved}
          getOptionKey={(player) => player?.id ?? "[EMPTY]"}
          getOptionLabel={(player) => player?.name ?? "[EMPTY]"}
          onChange={handleSelect}
          options={[null, ...registeredPlayers]}
          optionsClassName="w-50"
          placeholder="[EMPTY]"
          value={occupant}
        />
      </div>

      {animationPoints !== 0 && (
        <span
          className={twMerge(
            "animate-fly-out outline-text pointer-events-none absolute font-bold",
            animationPoints > 0 ? "text-positive" : "text-negative",
          )}
        >
          {animationPoints > 0 ? `+${animationPoints}` : animationPoints}
        </span>
      )}
    </div>
  );
}

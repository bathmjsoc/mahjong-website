import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { RoundedListbox } from "@/elements/RoundedListbox";
import { useAttendance } from "@/hooks/attendance/useAttendance";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useTableMutations } from "@/hooks/tables/useTableMutations";
import { useTables } from "@/hooks/tables/useTables";
import { useTournaments } from "@/hooks/tournaments/useTournaments";
import { getPointDeltas } from "@/lib/scoring";
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
  const { scoringRulesMap } = useTournaments();

  const [animationPoints, setAnimationPoints] = useState<number>(0);

  const occupantId = table[`${wind}_id`];
  const occupant = (occupantId && playerMap.get(occupantId)) || null;

  const isDuplicate = !!occupantId && duplicatePlayerIds.has(occupantId);
  const isLocked = !!occupantId && lockedPlayerIds.has(occupantId);
  const isRegistered = !!occupantId && registeredPlayerIds.has(occupantId);

  const registeredPlayers = players.filter((player) =>
    registeredPlayerIds.has(player.id),
  );

  useEffect(() => {
    if (!occupant?.id) return;

    const eventName = `points-animation-${table.id}`;

    const handleAnimation = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;

      const { faan, winType, winners, losers }: PointsAnimationEvent =
        event.detail;

      const pointDeltas = getPointDeltas(faan, winType, scoringRulesMap);

      if (winners.some((p) => p.id === occupant.id)) {
        setAnimationPoints(pointDeltas.winner);
      } else if (losers.some((p) => p.id === occupant.id)) {
        setAnimationPoints(pointDeltas.loser);
      }

      setTimeout(() => setAnimationPoints(0), 2000);
    };

    window.addEventListener(eventName, handleAnimation);
    return () => window.removeEventListener(eventName, handleAnimation);
  }, [occupant?.id, table.id, scoringRulesMap]);

  function handleSelect(player: Player | null) {
    updateTable(table, {
      [wind]: player,
    });
  }

  return (
    <div className={twMerge("flex items-center justify-center", gridPosition)}>
      <div
        className={twMerge(
          "flex items-center justify-between gap-1 bg-primary text-secondary",
          "w-50 shrink-0 rounded-full p-1 transition duration-300",
          isLocked && "ring-2 ring-neutral",
          (isDuplicate || !isRegistered) && "ring-2 ring-negative",
          tableClassName,
        )}
      >
        {/* Scoring Menu */}
        <WinSelector
          table={table}
          className={buttonClassName}
          occupant={occupant}
        />

        {/* Player Select Menu */}
        <RoundedListbox<Player>
          value={occupant}
          options={registeredPlayers}
          onChange={handleSelect}
          getOptionLabel={(player) => player.name}
          getOptionKey={(player) => player.id}
          disabled={table.saved}
          emptyMessage="No players found"
          placeholder="[EMPTY]"
          buttonClassName="h-8 text-xs tracking-tighter rounded-full"
          optionsClassName="w-auto"
        />
      </div>

      {/* Point Delta Animation */}
      {animationPoints !== 0 && (
        <span
          className={twMerge(
            "pointer-events-none absolute animate-fly-out font-bold outline-text",
            animationPoints > 0 ? "text-positive" : "text-negative",
          )}
        >
          {animationPoints > 0 ? `+${animationPoints}` : animationPoints}
        </span>
      )}
    </div>
  );
}

import { LockKeyhole, LockKeyholeOpen, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { IconButton } from "@/elements/IconButton";
import { useAttendance } from "@/hooks/attendance/useAttendance";
import { useAttendanceMutations } from "@/hooks/attendance/useAttendanceMutations";
import { useLogs } from "@/hooks/logs/useLogs";
import { useTableMutations } from "@/hooks/tables/useTableMutations";
import { useTables } from "@/hooks/tables/useTables";
import { scoreToColor } from "@/lib/helpers";
import { sortPlayersByScore } from "@/lib/scoring";
import type { Player } from "@/lib/types";
import { useSessionContext } from "@/providers/SessionProvider";

type PlayerListProps = {
  players: Player[];
};

export function PlayerList({ players }: PlayerListProps) {
  const sessionId = useSessionContext();

  const { lockedPlayerIds, registeredPlayerIds } = useAttendance();
  const { overallScores, sessionScores } = useLogs();
  const { seatedPlayerIds } = useTables();

  if (registeredPlayerIds.size === 0) {
    return <span className="text-xs italic">No players registered.</span>;
  }

  const registeredPlayers = players.filter((player) =>
    registeredPlayerIds.has(player.id),
  );
  const scores = sessionScores[sessionId] ?? {};
  const rankedPlayers = sortPlayersByScore(registeredPlayers, scores);
  const firstPlacePlayer = sortPlayersByScore(players, overallScores)[0];

  return (
    <table className="w-full table-fixed">
      <thead>
        <tr>
          <th className="w-7" />
          <th className="w-66">Name</th>
          <th className="w-22">Score</th>
          <th className="w-7 text-[10px] opacity-66">
            [{registeredPlayerIds.size}]
          </th>
        </tr>
      </thead>

      <tbody>
        {rankedPlayers.map((player) => (
          <PlayerRow
            isFirstPlace={player.id === firstPlacePlayer.id}
            isLocked={lockedPlayerIds.has(player.id)}
            isSeated={seatedPlayerIds.has(player.id)}
            key={player.id}
            player={player}
            score={scores[player.id] ?? 0}
          />
        ))}
      </tbody>
    </table>
  );
}

type PlayerRowProps = {
  player: Player;
  score: number;
  isLocked: boolean;
  isSeated: boolean;
  isFirstPlace: boolean;
};

function PlayerRow({
  player,
  score,
  isLocked,
  isSeated,
  isFirstPlace,
}: PlayerRowProps) {
  const { deregisterPlayer, lockPlayer, unlockPlayer } =
    useAttendanceMutations();
  const { unseatPlayer } = useTableMutations();

  function handleDeregisterPlayer() {
    deregisterPlayer(player);
    unseatPlayer(player);
  }

  function handleToggleLock() {
    isLocked ? unlockPlayer(player) : lockPlayer(player);
  }

  return (
    <tr>
      <td>
        <IconButton
          className="flex w-full items-center justify-center"
          onClick={handleToggleLock}
          title={isLocked ? "Unlock Player" : "Lock Player"}
        >
          <div className="relative size-4">
            <LockKeyhole
              className={twMerge(
                "text-neutral hover:text-secondary",
                "absolute size-4 transition duration-300",
                isLocked ? "scale-100 opacity-100" : "scale-50 opacity-0",
              )}
            />
            <LockKeyholeOpen
              className={twMerge(
                "text-secondary hover:text-neutral",
                "absolute size-4 transition duration-300",
                isLocked ? "scale-50 opacity-0" : "scale-100 opacity-100",
              )}
            />
          </div>
        </IconButton>
      </td>

      <td
        className={twMerge(
          "border-2 border-secondary px-2 py-1 text-left",
          "relative transition duration-300",
          !isSeated && "text-negative",
          isLocked && "text-neutral",
        )}
      >
        {isFirstPlace && (
          <span className="absolute -top-3 -left-3 -rotate-45">👑</span>
        )}

        <span className="block truncate">{player.name}</span>
      </td>

      <td
        className={twMerge(
          "border-2 border-secondary px-2 py-1 text-center",
          scoreToColor(score),
        )}
      >
        <span className="block truncate">{score}</span>
      </td>

      <td>
        <IconButton
          className="flex w-full items-center justify-center hover:text-negative"
          onClick={handleDeregisterPlayer}
          title="Deregister Player"
        >
          <X className="size-5" />
        </IconButton>
      </td>
    </tr>
  );
}

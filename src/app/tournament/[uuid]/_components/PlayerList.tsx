import { LockKeyhole, LockKeyholeOpen, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { IconButton } from "@/elements/IconButton";
import { useAttendance } from "@/hooks/attendance/useAttendance";
import { useAttendanceMutations } from "@/hooks/attendance/useAttendanceMutations";
import { useLogs } from "@/hooks/logs/useLogs";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useTables } from "@/hooks/tables/useTables";
import { rankPlayers, scoreToColor } from "@/lib/scores";
import type { Player } from "@/lib/types";
import { useSessionContext } from "@/providers/SessionProvider";

export function PlayerList() {
  const sessionId = useSessionContext();

  const { lockedPlayerIds, registeredPlayerIds } = useAttendance();
  const { sessionScores } = useLogs();
  const { players } = usePlayers();
  const { seatedPlayerIds } = useTables();

  if (registeredPlayerIds.size === 0) {
    return <span className="text-xs italic">No players registered.</span>;
  }

  const registeredPlayers = players.filter(
    (player) => !lockedPlayerIds.has(player.id),
  );
  const scores = sessionScores[sessionId] ?? {};
  const rankedPlayers = rankPlayers(registeredPlayers, scores);

  return (
    <table>
      <thead>
        <tr>
          <th className="w-7" />
          <th className="w-68">Name</th>
          <th className="w-20">Score</th>
          <th className="w-7 text-[10px] opacity-66">
            [{registeredPlayerIds.size}]
          </th>
        </tr>
      </thead>
      <tbody>
        {rankedPlayers.map(([player, score]) => (
          <PlayerRow
            key={player.id}
            player={player}
            score={score}
            isLocked={lockedPlayerIds.has(player.id)}
            isUnseated={!seatedPlayerIds.has(player.id)}
          />
        ))}
      </tbody>
    </table>
  );
}

type PlayerRowProps = {
  isLocked: boolean;
  isUnseated: boolean;
  player: Player;
  score: number;
};

function PlayerRow({ isLocked, isUnseated, player, score }: PlayerRowProps) {
  const sessionId = useSessionContext();

  const { deregisterPlayer, lockPlayer, unlockPlayer } =
    useAttendanceMutations();

  function handleLockToggle() {
    isLocked ? unlockPlayer(sessionId, player) : lockPlayer(sessionId, player);
  }

  return (
    <tr>
      {/* Lock/Unlock Player Icon */}
      <td>
        <IconButton
          title={isLocked ? "Unlock Player" : "Lock Player"}
          onClick={handleLockToggle}
          className="flex w-full items-center justify-center"
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
          "border-2 border-secondary px-2 py-1 text-left text-secondary",
          "transition duration-300",
          isUnseated && "text-negative",
          isLocked && "text-neutral",
        )}
      >
        {player.name}
      </td>

      <td
        className={twMerge(
          "border-2 border-secondary text-center",
          scoreToColor(score),
        )}
      >
        {score}
      </td>

      {/* Deregister Player Icon */}
      <td>
        <IconButton
          title="Deregister Player"
          onClick={() => deregisterPlayer(sessionId, player)}
          className="flex w-full items-center justify-center hover:text-negative"
        >
          <X className="size-5" />
        </IconButton>
      </td>
    </tr>
  );
}

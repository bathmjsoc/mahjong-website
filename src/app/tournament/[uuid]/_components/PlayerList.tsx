import { LockKeyhole, LockKeyholeOpen, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import {
  deregisterPlayer,
  lockPlayer,
  unlockPlayer,
} from "@/actions/attendance";
import { IconButton } from "@/elements/IconButton";
import { useAttendance } from "@/hooks/useAttendance";
import { useLogs } from "@/hooks/useLogs";
import { useTables } from "@/hooks/useTables";
import { rankPlayers, scoreToColor } from "@/lib/scores";
import type { Player, Session } from "@/types/app.types";

type PlayerListProps = {
  session: Session;
};

export function PlayerList({ session }: PlayerListProps) {
  const { lockedPlayerIds, registeredPlayers } = useAttendance();
  const { sessionScores } = useLogs();
  const { seatedPlayerIds } = useTables();

  if (registeredPlayers.length === 0) {
    return <span className="text-xs italic">No players registered.</span>;
  }

  const scores = sessionScores[session.id] ?? {};
  const rankedPlayers = rankPlayers(registeredPlayers, scores);

  return (
    <table>
      <thead>
        <tr>
          <th className="w-7" />
          <th className="w-68">Name</th>
          <th className="w-20">Score</th>
          <th className="w-7 text-[10px] opacity-66">
            [{registeredPlayers.length}]
          </th>
        </tr>
      </thead>
      <tbody>
        {rankedPlayers.map(([player, score]) => (
          <PlayerRow
            session={session}
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
  session: Session;
  isLocked: boolean;
  isUnseated: boolean;
  player: Player;
  score: number;
};

function PlayerRow({
  session,
  isLocked,
  isUnseated,
  player,
  score,
}: PlayerRowProps) {
  const scoreColor = scoreToColor(score);

  function handleLockToggle() {
    isLocked ? unlockPlayer(session, player) : lockPlayer(session, player);
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
        className={twMerge("border-2 border-secondary text-center", scoreColor)}
      >
        {score}
      </td>

      {/* Deregister Player Icon */}
      <td>
        <IconButton
          title="Deregister Player"
          onClick={() => deregisterPlayer(session, player)}
          className="flex w-full items-center justify-center hover:text-negative"
        >
          <X className="size-5" />
        </IconButton>
      </td>
    </tr>
  );
}

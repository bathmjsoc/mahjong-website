"use client";

import { LockKeyhole, LockKeyholeOpen, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import {
  deregisterPlayer,
  lockPlayer,
  unlockPlayer,
} from "@/actions/attendance";
import { useAttendance } from "@/context/AttendanceContext";
import { useLogs } from "@/context/LogContext";
import { useTables } from "@/context/TableContext";
import { IconButton } from "@/elements/IconButton";
import type { Player, Session } from "@/lib/types";
import { rankPlayers, scoreToColor } from "@/lib/utils";

type PlayerListProps = {
  players: Player[];
  session: Session;
};

export function PlayerList({ players, session }: PlayerListProps) {
  const { lockedPlayerIds } = useAttendance();
  const { sessionScores } = useLogs();
  const { seatedPlayerIds } = useTables();

  if (players.length === 0) {
    return <span className="text-xs italic">No players registered.</span>;
  }

  const scores = sessionScores[session.id] ?? {};
  const rankedPlayers = rankPlayers(players, scores);

  return (
    <table>
      <thead>
        <tr>
          <th className="w-7" />
          <th className="w-68">Name</th>
          <th className="w-20">Score</th>
          <th className="w-7 text-[10px] opacity-66">[{players.length}]</th>
        </tr>
      </thead>
      <tbody>
        {rankedPlayers.map((player) => (
          <PlayerRow
            key={player.id}
            player={player}
            score={scores[player.id] ?? 0}
            isLocked={lockedPlayerIds.has(player.id)}
            isUnseated={!seatedPlayerIds.has(player.id)}
            session={session}
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
          onClick={handleLockToggle}
          className="flex items-center justify-center w-full"
        >
          <div className="relative size-4">
            <LockKeyhole
              className={twMerge(
                "text-neutral hover:text-secondary",
                "absolute size-4 transition duration-300",
                isLocked ? "opacity-100 scale-100" : "opacity-0 scale-50",
              )}
            />
            <LockKeyholeOpen
              className={twMerge(
                "text-secondary hover:text-neutral",
                "absolute size-4 transition duration-300",
                isLocked ? "opacity-0 scale-50" : "opacity-100 scale-100",
              )}
            />
          </div>
        </IconButton>
      </td>

      <td
        className={twMerge(
          "text-secondary border-secondary border-2 text-left px-2 py-1",
          "transition duration-300",
          isUnseated && "text-negative",
          isLocked && "text-neutral",
        )}
      >
        {player.name}
      </td>

      <td
        className={twMerge("border-secondary border-2 text-center", scoreColor)}
      >
        {score}
      </td>

      {/* Deregister Player Icon */}
      <td>
        <IconButton
          onClick={() => deregisterPlayer(session, player)}
          className="flex items-center justify-center w-full hover:text-negative"
        >
          <X className="size-5" />
        </IconButton>
      </td>
    </tr>
  );
}

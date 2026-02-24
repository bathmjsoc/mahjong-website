import { LockKeyhole, LockKeyholeOpen, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import {
  deregisterPlayer,
  lockPlayer,
  unlockPlayer,
} from "@/actions/attendance";
import { useTournament } from "@/context/TournamentContext";
import { IconButton } from "@/elements/IconButton";
import type { Player } from "@/lib/types";
import { scoreToColor } from "@/lib/utils";

type PlayerListProps = {
  players: Player[];
};

export function PlayerList({ players }: PlayerListProps) {
  return (
    <table>
      <thead>
        <tr>
          <th className="w-7" />
          <th className="w-68">Name</th>
          <th className="w-20">Score</th>
          <th className="w-7" />
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <PlayerRow key={player.id} player={player} />
        ))}
      </tbody>
    </table>
  );
}

type PlayerRowProps = {
  player: Player;
};

function PlayerRow({ player }: PlayerRowProps) {
  const { currentSession, lockedPlayerIds, unseatedPlayerIds } =
    useTournament();
  const isLocked = lockedPlayerIds.has(player.id);
  const isUnseated = unseatedPlayerIds.has(player.id);
  const score = 0;

  function handleSelect() {
    isLocked
      ? unlockPlayer(currentSession, player)
      : lockPlayer(currentSession, player);
  }

  return (
    <tr>
      {/* Lock/Unlock Player Icon */}
      <td>
        <IconButton
          onClick={handleSelect}
          className="flex items-center justify-center w-full"
        >
          <div className="relative size-4">
            <LockKeyhole
              className={twMerge(
                "text-(--neutral-color) hover:text-(--secondary-color)",
                "absolute size-4 transition duration-300",
                isLocked ? "opacity-100 scale-100" : "opacity-0 scale-50",
              )}
            />
            <LockKeyholeOpen
              className={twMerge(
                "text-(--secondary-color) hover:text-(--neutral-color)",
                "absolute size-4 transition duration-300",
                isLocked ? "opacity-0 scale-50" : "opacity-100 scale-100",
              )}
            />
          </div>
        </IconButton>
      </td>

      <td
        className={twMerge(
          "text-(--secondary-color) border-(--secondary-color) border-2 text-left p-1",
          "transition duration-300",
          isUnseated && "text-(--negative-color)",
          isLocked && "text-(--neutral-color)",
        )}
      >
        {player.name}
      </td>

      <td
        className={twMerge(
          "border-(--secondary-color) border-2 text-center",
          scoreToColor(score),
        )}
      >
        {score}
      </td>

      {/* Deregister Player Icon */}
      <td>
        <IconButton
          onClick={() => deregisterPlayer(currentSession, player)}
          className="flex items-center justify-center w-full hover:text-(--negative-color)"
        >
          <X className="size-5" />
        </IconButton>
      </td>
    </tr>
  );
}

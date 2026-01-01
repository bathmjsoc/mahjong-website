import { LockKeyhole, LockKeyholeOpen, X } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useTournament } from "@/context/TournamentContext";
import { IconButton } from "@/elements/IconButton";
import { getPlayerScore } from "@/lib/players";
import type { Player } from "@/lib/types";
import { scoreToColor } from "@/lib/utils";

export function PlayerList() {
  const { rankedPlayers } = useTournament();

  return (
    <table className="table-fixed">
      <thead>
        <tr>
          <th className="w-7" />
          <th className="w-68">Name</th>
          <th className="w-20">Score</th>
          <th className="w-7" />
        </tr>
      </thead>
      <tbody>
        {rankedPlayers.length > 0 ? (
          rankedPlayers.map((player) => (
            <PlayerRow key={player.uuid} player={player} />
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center text-sm pt-10 italic">
              No registered players
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

type PlayerRowProps = {
  player: Player;
};

function PlayerRow({ player }: PlayerRowProps) {
  const { selectedSession, deregisterPlayer } = useTournament();

  const [isLocked, setIsLocked] = useState(false);

  const score = getPlayerScore(player, selectedSession);

  return (
    <tr>
      <td>
        <IconButton
          onClick={() => setIsLocked(!isLocked)}
          className="flex items-center justify-center w-full"
        >
          <div className="relative size-4">
            <LockKeyhole
              className={twMerge(
                "text-(--neutral-color) hover:text-(--secondary-color)",
                "absolute transition duration-300 size-4",
                isLocked ? "opacity-100 scale-100" : "opacity-0 scale-50",
              )}
            />
            <LockKeyholeOpen
              className={twMerge(
                "text-(--secondary-color) hover:text-(--neutral-color)",
                "absolute transition duration-300 size-4",
                isLocked ? "opacity-0 scale-50" : "opacity-100 scale-100",
              )}
            />
          </div>
        </IconButton>
      </td>

      <td className="border-(--secondary-color) border-2 text-left p-2 truncate">
        {player.name}
      </td>

      <td
        className={twMerge(
          "border-(--secondary-color) border-2 text-center",
          scoreToColor(score ?? 0),
        )}
      >
        {score}
      </td>

      <td>
        <IconButton
          onClick={() => deregisterPlayer(player)}
          className="flex items-center justify-center w-full hover:text-(--negative-color)"
        >
          <X className="size-5" />
        </IconButton>
      </td>
    </tr>
  );
}

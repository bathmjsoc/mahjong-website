import { LockKeyhole, LockKeyholeOpen, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { deregisterPlayer, lockPlayer, unlockPlayer } from "@/actions/players";
import { IconButton } from "@/elements/IconButton";
import type { Player } from "@/lib/types";
import { scoreToColor } from "@/lib/utils";

type PlayerListProps = {
  players: Player[];
};

export function PlayerList({ players }: PlayerListProps) {
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
  const score = 0;

  function handleSelect() {
    player.locked ? unlockPlayer(player) : lockPlayer(player);
  }

  return (
    <tr>
      <td>
        <IconButton
          onClick={handleSelect}
          className="flex items-center justify-center w-full"
        >
          <div className="relative size-4">
            <LockKeyhole
              className={twMerge(
                "text-(--neutral-color) hover:text-(--secondary-color)",
                "absolute transition duration-300 size-4",
                player.locked ? "opacity-100 scale-100" : "opacity-0 scale-50",
              )}
            />
            <LockKeyholeOpen
              className={twMerge(
                "text-(--secondary-color) hover:text-(--neutral-color)",
                "absolute transition duration-300 size-4",
                player.locked ? "opacity-0 scale-50" : "opacity-100 scale-100",
              )}
            />
          </div>
        </IconButton>
      </td>

      <td
        className={twMerge(
          "border-(--secondary-color) border-2 text-left p-2 truncate",
          "transition duration-300",
          player.locked ? "text-(--neutral-color)" : "text-(--secondary-color)",
        )}
      >
        {player.name}
      </td>

      <td
        className={twMerge(
          "border-(--secondary-color) border-2 text-center p-2",
          scoreToColor(score),
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

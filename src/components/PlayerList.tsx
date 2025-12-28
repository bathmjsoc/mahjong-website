import {
  LockClosedIcon,
  LockOpenIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import IconButton from "@/elements/IconButton";
import { deregisterPlayer, sortDescending } from "@/lib/players";
import type { Player } from "@/lib/types";

type PlayerListProps = {
  players: Player[];
};

function scoreToColor(score: number): string {
  if (score < 0) return "bg-red-700";
  if (score > 0) return "bg-green-700";
  return "bg-yellow-600";
}

export default function PlayerList({ players }: PlayerListProps) {
  const sortedPlayers = sortDescending(players);

  return (
    <table className="table-fixed">
      <thead>
        <tr className="text-center">
          <th className="w-7" />
          <th className="w-68">Name</th>
          <th className="w-20">Score</th>
          <th className="w-7" />
        </tr>
      </thead>
      <tbody>
        {sortedPlayers.map((player) => (
          <PlayerRow key={player.uuid} player={player} />
        ))}
      </tbody>
    </table>
  );
}

type PlayerRowProps = {
  player: Player;
};

function PlayerRow({ player }: PlayerRowProps) {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <tr key={player.uuid}>
      <td className="text-lg text-center align-middle leading-none">
        <IconButton
          onClick={() => setIsLocked(!isLocked)}
          className="hover:text-yellow-600"
        >
          <div className="relative size-4">
            <LockClosedIcon
              className={`
                absolute transition duration-300
                ${isLocked ? "opacity-100 scale-100" : "opacity-0 scale-50"}
                `}
            />
            <LockOpenIcon
              className={`
                absolute transition duration-300
                ${isLocked ? "opacity-0 scale-50" : "opacity-100 scale-100"}
              `}
            />
          </div>
        </IconButton>
      </td>

      <td className="border-2 border-(--secondary-color) text-left p-2 truncate">
        {player.name}
      </td>

      <td
        className={`border-2 border-(--secondary-color) text-center p-2
              ${scoreToColor(player.score)}`}
      >
        {player.score}
      </td>

      <td className="text-lg text-center align-middle leading-none">
        <IconButton
          onClick={() => deregisterPlayer(player.uuid)}
          className="hover:text-red-700"
        >
          <XCircleIcon className="size-5" />
        </IconButton>
      </td>
    </tr>
  );
}

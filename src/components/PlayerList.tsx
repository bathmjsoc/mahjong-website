import { LockKeyhole, LockKeyholeOpen, X } from "lucide-react";
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
        <tr>
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
      <td>
        <IconButton
          onClick={() => setIsLocked(!isLocked)}
          className="flex items-center justify-center w-full"
        >
          <div className="relative size-4">
            <LockKeyhole
              className={`
                absolute transition duration-300 size-4 
                text-yellow-600 hover:text-(--secondary-color)
                ${isLocked ? "opacity-100 scale-100" : "opacity-0 scale-50"}
              `}
            />
            <LockKeyholeOpen
              className={`
                absolute transition duration-300 size-4
                text-(--secondary-color) hover:text-yellow-600
                ${isLocked ? "opacity-0 scale-50" : "opacity-100 scale-100"}
              `}
            />
          </div>
        </IconButton>
      </td>

      <td className="border-(--secondary-color) border-2 text-left p-2 truncate">
        {player.name}
      </td>

      <td
        className={`border-(--secondary-color) border-2 text-center
          ${scoreToColor(player.score)}
        `}
      >
        {player.score}
      </td>

      <td>
        <IconButton
          onClick={() => deregisterPlayer(player.uuid)}
          className="flex items-center justify-center w-full hover:text-red-700"
        >
          <X className="size-5" />
        </IconButton>
      </td>
    </tr>
  );
}

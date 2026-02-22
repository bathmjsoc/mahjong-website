import { twMerge } from "tailwind-merge";
import type { Player } from "@/lib/types";
import { formatPosition, scoreToColor } from "@/lib/utils";

type LeaderboardProps = {
  players: Player[];
};

export function Leaderboard({ players }: LeaderboardProps) {
  return (
    <table className="table-fixed">
      <thead className="bg-(--primary-color) text-(--secondary-color) border-(--primary-color) border">
        <tr>
          <th className="w-25">Rank</th>
          <th className="w-75">Name</th>
          <th className="w-25">Score</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player, index) => (
          <PlayerRow key={player.id} player={player} position={index + 1} />
        ))}
      </tbody>
    </table>
  );
}

type PlayerRowProps = {
  player: Player;
  position: number;
};

function PlayerRow({ player, position }: PlayerRowProps) {
  const score = 0;

  return (
    <tr>
      <td className="border-(--primary-color) border-y border-l text-center px-2 text-xs">
        {formatPosition(position)}
      </td>

      <td className="border-(--primary-color) border-y text-center">
        {player.name}
      </td>

      <td
        className={twMerge(
          "border-(--primary-color-color) border-y border-r text-center",
          scoreToColor(score),
        )}
      >
        {score}
      </td>
    </tr>
  );
}

import { twMerge } from "tailwind-merge";
import type { Player } from "@/lib/types";
import { formatPosition, scoreToColor } from "@/lib/utils";

type LeaderboardProps = {
  players: Player[];
};

export function Leaderboard({ players }: LeaderboardProps) {
  return (
    <table className="table-fixed border-(--primary-color) border">
      <thead className="bg-(--primary-color) text-(--secondary-color)">
        <tr>
          <th className="w-25">Rank</th>
          <th className="w-75">Name</th>
          <th className="w-25">Score</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-(--primary-color)">
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
    <tr className="text-center text-sm">
      <td className="border-l">{formatPosition(position)}</td>

      <td>{player.name}</td>

      <td className={twMerge("border-r", scoreToColor(score))}>{score}</td>
    </tr>
  );
}

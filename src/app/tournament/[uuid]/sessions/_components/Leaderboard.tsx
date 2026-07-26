import { twMerge } from "tailwind-merge";
import { rankPlayers, scoreToColor } from "@/lib/scores";
import { formatPosition } from "@/lib/utils";
import type { Player } from "@/types/app.types";

type LeaderboardProps = {
  players: Player[];
  scores: Record<string, number>;
};

export function Leaderboard({ players, scores }: LeaderboardProps) {
  if (players.length === 0) {
    return (
      <span className="text-primary text-xs italic">No players found.</span>
    );
  }

  const rankedPlayers = rankPlayers(players, scores);

  return (
    <table className="table-fixed border border-primary">
      <thead className="bg-primary text-secondary">
        <tr>
          <th className="w-25">Rank</th>
          <th className="w-75">Name</th>
          <th className="w-25">Score</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-primary">
        {rankedPlayers.map(([player, score], index) => (
          <PlayerRow
            key={player.id}
            player={player}
            score={score}
            position={index + 1}
          />
        ))}
      </tbody>
    </table>
  );
}

type PlayerRowProps = {
  player: Player;
  position: number;
  score: number;
};

function PlayerRow({ player, position, score }: PlayerRowProps) {
  const formattedPosition = formatPosition(position);
  const scoreColor = scoreToColor(score);

  return (
    <tr className="text-center text-primary text-sm">
      <td className="border-l">{formattedPosition}</td>

      <td>{player.name}</td>

      <td className={twMerge("border-r", scoreColor)}>{score}</td>
    </tr>
  );
}

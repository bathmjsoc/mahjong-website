import { twMerge } from "tailwind-merge";
import { sortPlayersByScore } from "@/lib/scoring";
import type { Player } from "@/lib/types";
import { scoreToColor } from "@/lib/ui";
import { getOrdinalSuffix } from "@/lib/utils";

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

  const rankedPlayers = sortPlayersByScore(players, scores);

  return (
    <table className="border-primary w-xl table-fixed border">
      <thead className="bg-primary text-secondary">
        <tr>
          <th>Rank</th>
          <th className="w-sm">Name</th>
          <th>Score</th>
        </tr>
      </thead>

      <tbody className="divide-primary divide-y">
        {rankedPlayers.map((player, index) => (
          <PlayerRow
            key={player.id}
            player={player}
            position={index + 1}
            score={scores[player.id] ?? 0}
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
  return (
    <tr className="text-primary text-center text-sm">
      <td>
        {position}
        {getOrdinalSuffix(position)}
      </td>

      <td>
        <span className="block truncate">{player.name}</span>
      </td>

      <td className={twMerge("text-secondary", scoreToColor(score))}>
        {score}
      </td>
    </tr>
  );
}

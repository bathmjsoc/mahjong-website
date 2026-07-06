"use client";

import { twMerge } from "tailwind-merge";
import type { Player } from "@/lib/types";
import { formatPosition, rankPlayers, scoreToColor } from "@/lib/utils";

type LeaderboardProps = {
  players: Player[];
  scores: Record<string, number>;
};

export function Leaderboard({ players, scores }: LeaderboardProps) {
  const rankedPlayers = rankPlayers(players, scores);

  if (players.length === 0) {
    return (
      <span className="text-primary text-xs italic">No players found.</span>
    );
  }

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
        {rankedPlayers.map((player, index) => (
          <PlayerRow
            key={player.id}
            player={player}
            score={scores[player.id] ?? 0}
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

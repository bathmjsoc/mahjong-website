"use client";

import { twMerge } from "tailwind-merge";
import { useTournament } from "@/context/TournamentContext";
import type { Player, Session } from "@/lib/types";
import { formatPosition, rankPlayers, scoreToColor } from "@/lib/utils";

type LeaderboardProps = {
  players: Player[];
  session: Session;
};

export function Leaderboard({ players, session }: LeaderboardProps) {
  const { overallScores, sessionScores } = useTournament();

  if (players.length === 0) {
    return (
      <span className="text-primary text-xs italic">No players found.</span>
    );
  }

  const scores = sessionScores[session.id] || overallScores;
  const rankedPlayers = rankPlayers(players, scores);

  return (
    <table className="table-fixed border-primary border">
      <thead className="bg-primary text-secondary">
        <tr>
          <th className="w-25">Rank</th>
          <th className="w-75">Name</th>
          <th className="w-25">Score</th>
        </tr>
      </thead>
      <tbody className="divide-primary divide-y">
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
    <tr className="text-primary text-center text-sm">
      <td className="border-l">{formattedPosition}</td>

      <td>{player.name}</td>

      <td className={twMerge("border-r", scoreColor)}>{score}</td>
    </tr>
  );
}

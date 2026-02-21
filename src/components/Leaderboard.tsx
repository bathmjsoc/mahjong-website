import { twMerge } from "tailwind-merge";
import type { Player, Session } from "@/lib/types";
import { formatPosition, scoreToColor } from "@/lib/utils";

type LeaderboardProps = {
  session: Session;
};

export function Leaderboard({ session }: LeaderboardProps) {
  const dummy: Player = {
    id: "some_uuid",
    name: "some_very_long_name_to_test",
    registered: false,
    locked: false,
  };
  const players: Player[] = Array(100).fill(dummy);
  // const players = getPlayersFromSession(session)

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
        {players.length > 0 ? (
          players.map((player, index) => (
            <PlayerRow
              key={player.id}
              player={player}
              position={index + 1}
              session={session}
            />
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center text-sm pt-10 italic">
              No players found for the selected session.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

type PlayerRowProps = {
  player: Player;
  position: number;
  session: Session;
};

function PlayerRow({ player, position, session }: PlayerRowProps) {
  const score = 0;

  if (session.number === -1) {
    // Caclulate total score
  } else {
    // Calculate score in session.number
  }

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

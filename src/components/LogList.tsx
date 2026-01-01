"use client";

import { Trash2 } from "lucide-react";
import { useTournament } from "@/context/TournamentContext";
import { IconButton } from "@/elements/IconButton";
import type { Log, Player } from "@/lib/types";

export function LogList() {
  const { logs } = useTournament();

  return (
    <table className="text-(--primary-color) text-sm w-full border-separate border-spacing-y-2">
      <thead>
        <tr>
          <th className="w-[10%]">Session</th>
          <th className="w-[10%]">Faan</th>
          <th className="w-[10%]">Win Type</th>
          <th className="w-[20%]">Winner</th>
          <th className="">Loser(s)</th>
          <th className="w-7" />
        </tr>
      </thead>
      <tbody>
        {logs.length > 0 ? (
          logs.map((log) => <LogRow key={log.id} log={log} />)
        ) : (
          <tr>
            <td colSpan={6} className="text-center text-sm pt-10 italic">
              No logs found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

type LogRowProps = {
  log: Log;
};

function LogRow({ log }: LogRowProps) {
  function playersToString(players: Player[]) {
    return players.map((player) => player.name).join(", ");
  }

  return (
    <tr>
      <td className="border-(--primary-color) border-l border-r-0 border-y rounded-l-xl text-center p-2 truncate">
        {log.session.number}
      </td>

      <td className="border-(--primary-color) border-x-0 border-y text-center p-2 truncate">
        {log.faan}
      </td>

      <td className="border-(--primary-color) border-x-0 border-y text-center p-2 truncate">
        {log.type}
      </td>

      <td className="border-(--primary-color) border-x-0 border-y text-center p-2 truncate">
        {log.winner.name}
      </td>

      <td className="border-(--primary-color) border-l-0 border-r border-y rounded-r-xl text-center p-2 truncate">
        {playersToString(log.losers)}
      </td>

      <td>
        <IconButton className="flex items-center justify-center w-full text-(--primary-color)! hover:text-(--negative-color)!">
          <Trash2 className="size-5" />
        </IconButton>
      </td>
    </tr>
  );
}

import { Trash2 } from "lucide-react";
import { disableLog } from "@/actions/logs";
import { IconButton } from "@/elements/IconButton";
import type { Log } from "@/lib/types";

type LogListProps = {
  logs: Log[];
};

export function LogList({ logs }: LogListProps) {
  if (logs.length === 0) {
    return <span className="text-primary text-xs italic">No logs found.</span>;
  }

  return (
    <table className="text-primary text-sm w-full border-separate border-spacing-y-2">
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
        {logs.map((log) => (
          <LogRow key={log.id} log={log} />
        ))}
      </tbody>
    </table>
  );
}

type LogRowProps = {
  log: Log;
};

function LogRow({ log }: LogRowProps) {
  return (
    <tr>
      <td className="border-primary border-l border-r-0 border-y rounded-l-xl text-center p-2 truncate">
        {log.session_id}
      </td>

      <td className="border-primary border-x-0 border-y text-center p-2 truncate">
        {log.faan}
      </td>

      <td className="border-primary border-x-0 border-y text-center p-2 truncate">
        {log.type}
      </td>

      <td className="border-primary border-x-0 border-y text-center p-2 truncate">
        {log.winners.map((player) => player.name).join(", ")}
      </td>

      <td className="border-primary border-l-0 border-r border-y rounded-r-xl text-center p-2 truncate">
        {log.losers.map((player) => player.name).join(", ")}
      </td>

      <td>
        <IconButton
          onClick={() => disableLog(log)}
          className="text-primary hover:text-negative flex items-center justify-center w-full"
        >
          <Trash2 className="size-5" />
        </IconButton>
      </td>
    </tr>
  );
}

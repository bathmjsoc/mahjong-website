import { Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { disableLog } from "@/actions/logs";
import { IconButton } from "@/elements/IconButton";
import { usePlayers } from "@/hooks/usePlayers";
import { useSessions } from "@/hooks/useSessions";
import type { Log } from "@/lib/types";
import { winTypeMap } from "@/lib/utils";

type LogListProps = {
  logs: Log[];
};

export function LogList({ logs }: LogListProps) {
  if (logs.length === 0) {
    return <span className="text-primary text-xs italic">No logs found.</span>;
  }

  return (
    <table className="w-full max-w-7xl border-separate border-spacing-y-2 text-primary text-sm">
      <thead>
        <tr>
          <th className="w-[10%]">Session</th>
          <th className="w-[10%]">Faan</th>
          <th className="w-[10%]">Type</th>
          <th className="w-auto">Winner(s)</th>
          <th className="w-auto">Loser(s)</th>
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
  const { playerMap } = usePlayers();
  const { sessionMap } = useSessions();

  return (
    <tr className={log.disabled ? "text-negative" : "text-primary"}>
      <td
        className={twMerge(
          log.disabled ? "border-negative" : "border-primary",
          "truncate rounded-l-xl border-y border-r-0 border-l p-2 text-center",
        )}
      >
        {sessionMap[log.session_id].number}
      </td>

      <td
        className={twMerge(
          log.disabled ? "border-negative" : "border-primary",
          "truncate border-x-0 border-y p-2 text-center",
        )}
      >
        {log.faan ?? "N/A"}
      </td>

      <td
        title={winTypeMap[log.win_type]}
        className={twMerge(
          log.disabled ? "border-negative" : "border-primary",
          "truncate border-x-0 border-y p-2 text-center",
        )}
      >
        {log.win_type}
      </td>

      <td
        className={twMerge(
          log.disabled ? "border-negative" : "border-primary",
          "truncate border-x-0 border-y p-2 text-center",
        )}
      >
        {log.winner_ids.map((id) => playerMap[id].name).join(", ")}
      </td>

      <td
        className={twMerge(
          log.disabled ? "border-negative" : "border-primary",
          "truncate rounded-r-xl border-y border-r border-l-0 p-2 text-center",
        )}
      >
        {log.loser_ids.map((id) => playerMap[id].name).join(", ")}
      </td>

      <td>
        {!log.disabled && (
          <IconButton
            onClick={() => disableLog(log)}
            className="flex w-full items-center justify-center text-primary enabled:hover:text-negative"
          >
            <Trash2 className="size-5" />
          </IconButton>
        )}
      </td>
    </tr>
  );
}

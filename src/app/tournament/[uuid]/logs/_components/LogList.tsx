import { Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { IconButton } from "@/elements/IconButton";
import { useLogMutations } from "@/hooks/logs/useLogMutations";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useSessions } from "@/hooks/sessions/useSessions";
import { WIN_TYPE_MAP } from "@/lib/constants";
import type { Log } from "@/lib/types";

type LogListProps = {
  logs: Log[];
};

export function LogList({ logs }: LogListProps) {
  if (logs.length === 0) {
    return <span className="text-primary text-xs italic">No logs found.</span>;
  }

  return (
    <table className="w-350 table-fixed border-separate border-spacing-y-2 text-primary text-sm">
      <thead>
        <tr>
          <th className="w-1/10">Session</th>
          <th className="w-1/10">Faan</th>
          <th className="w-1/10">Type</th>
          <th>Winner(s)</th>
          <th>Loser(s)</th>
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
  const { disableLog } = useLogMutations();
  const { playerMap } = usePlayers();
  const { sessionMap } = useSessions();

  const borderColor = log.disabled ? "border-negative" : "border-primary";

  return (
    <tr className={log.disabled ? "text-negative" : "text-primary"}>
      <td
        className={twMerge(
          "rounded-l-xl border-y border-r-0 border-l p-2 text-center",
          borderColor,
        )}
        title={sessionMap.get(log.session_id)?.start_date}
      >
        {sessionMap.get(log.session_id)?.number}
      </td>

      <td
        className={twMerge("border-x-0 border-y p-2 text-center", borderColor)}
        title={log.hand_type ?? undefined}
      >
        {log.faan}
      </td>

      <td
        className={twMerge("border-x-0 border-y p-2 text-center", borderColor)}
        title={WIN_TYPE_MAP[log.win_type]}
      >
        {log.win_type}
      </td>

      <td
        className={twMerge("border-x-0 border-y p-2 text-center", borderColor)}
      >
        {log.winner_ids
          .map((id) => playerMap.get(id)?.name)
          .filter(Boolean)
          .join(", ")}
      </td>

      <td
        className={twMerge(
          "rounded-r-xl border-y border-r border-l-0 p-2 text-center",
          borderColor,
        )}
      >
        {log.loser_ids
          .map((id) => playerMap.get(id)?.name)
          .filter(Boolean)
          .join(", ")}
      </td>

      <td>
        {!log.disabled && (
          <IconButton
            className="flex w-full items-center justify-center text-primary enabled:hover:text-negative"
            onClick={() => disableLog(log)}
            title="Disable Log"
          >
            <Trash2 className="size-5" />
          </IconButton>
        )}
      </td>
    </tr>
  );
}

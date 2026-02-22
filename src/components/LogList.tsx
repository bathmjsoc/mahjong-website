import { Trash2 } from "lucide-react";
import { IconButton } from "@/elements/IconButton";
import type { Log } from "@/lib/types";

type LogListProps = {
  logs: Log[];
};

export function LogList({ logs }: LogListProps) {
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
      <td className="border-(--primary-color) border-l border-r-0 border-y rounded-l-xl text-center p-2 truncate">
        {log.session_id}
      </td>

      <td className="border-(--primary-color) border-x-0 border-y text-center p-2 truncate">
        {log.faan}
      </td>

      <td className="border-(--primary-color) border-x-0 border-y text-center p-2 truncate">
        {log.type}
      </td>

      <td className="border-(--primary-color) border-x-0 border-y text-center p-2 truncate">
        {log.winner_ids}
      </td>

      <td className="border-(--primary-color) border-l-0 border-r border-y rounded-r-xl text-center p-2 truncate">
        {log.loser_ids}
      </td>

      <td>
        <IconButton className="flex items-center justify-center w-full text-(--primary-color) hover:text-(--negative-color)">
          <Trash2 className="size-5" />
        </IconButton>
      </td>
    </tr>
  );
}

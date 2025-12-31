"use client";

import { Input } from "@headlessui/react";
import { Trash2 } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import IconButton from "@/elements/IconButton";
import { fetchLogs } from "@/lib/logs";
import type { Log } from "@/lib/types";
import { parseSearch } from "@/lib/utils";

export default async function Logs() {
  const [query, setQuery] = useState("");

  const logs = await fetchLogs("temp");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newQuery = e.target.value;
    setQuery(newQuery);
    console.log(parseSearch(newQuery));
  }

  return (
    <div className="flex flex-col items-center gap-10 p-10">
      <Input
        onChange={handleChange}
        value={query}
        className="
          bg-(--secondary-color) border-(--primary-color) border-2
          outline-none rounded-lg w-sm p-2 text-center
        "
        placeholder="Enter a query..."
      />

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
    </div>
  );
}

type LogRowProps = {
  log: Log;
};

function LogRow({ log }: LogRowProps) {
  return (
    <tr>
      <td className="border-(--primary-color) border-l-2 border-r-0 border-y-2 rounded-l-xl text-center p-1 truncate">
        {log.session.number}
      </td>

      <td className="border-(--primary-color) border-x-0 border-y-2 text-center p-1 truncate">
        {log.faan}
      </td>

      <td className="border-(--primary-color) border-x-0 border-y-2 text-center p-1 truncate">
        {log.type}
      </td>

      <td className="border-(--primary-color) border-x-0 border-y-2 text-center p-1 truncate">
        {log.winner.name}
      </td>

      <td className="border-(--primary-color) border-l-0 border-r-2 border-y-2 rounded-r-xl text-center p-1 truncate">
        {log.losers.map((player) => player.name).join(", ")}
      </td>

      <td>
        <IconButton className="flex items-center justify-center w-full text-(--primary-color)! hover:text-red-700!">
          <Trash2 className="size-5" />
        </IconButton>
      </td>
    </tr>
  );
}

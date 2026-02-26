"use client";

import { Input } from "@headlessui/react";
import { useState } from "react";
import { LogList } from "@/components/LogList";
import { useTournament } from "@/context/TournamentContext";

export default function LogsPage() {
  const { logs } = useTournament();
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col items-center gap-10 p-10">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a query..."
        autoFocus={true}
        className="
          bg-secondary border-primary border-2
          outline-none h-10 rounded-lg w-sm px-2 text-center text-sm
        "
      />

      {logs.length > 0 ? (
        <LogList logs={logs} />
      ) : (
        <span className="text-primary text-xs italic">No logs found.</span>
      )}
    </div>
  );
}

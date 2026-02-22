"use client";

import { LogList } from "@/components/LogList";
import { type ChangeEvent, useState } from "react";
import { Input } from "@headlessui/react";
import { useTournament } from "@/context/TournamentContext";

export default function LogsPage() {
  const { logs } = useTournament();
  const [query, setQuery] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newQuery = e.target.value;
    setQuery(newQuery);
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
        autoFocus={true}
      />

      {logs.length > 0 ? (
        <LogList logs={logs} />
      ) : (
        <span className="text-xs italic">No logs found.</span>
      )}
    </div>
  );
}

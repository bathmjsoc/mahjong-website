"use client";

import { Input } from "@headlessui/react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { LogList } from "@/components/LogList";
import { useTournament } from "@/context/TournamentContext";
import { IconButton } from "@/elements/IconButton";

export default function LogsPage() {
  const { enabledLogs, logs } = useTournament();
  const [query, setQuery] = useState("");
  const [showDisabled, setShowDisabled] = useState(false);

  return (
    <div className="flex flex-col items-center gap-10 p-10">
      <div className="flex items-center gap-2">
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

        <IconButton
          onClick={() => setShowDisabled(!showDisabled)}
          className="flex items-center justify-center"
        >
          <div className="relative size-5">
            <Eye
              className={twMerge(
                "text-primary hover:text-info",
                "absolute size-5 transition duration-300",
                showDisabled ? "opacity-100 scale-100" : "opacity-0 scale-50",
              )}
            />
            <EyeOff
              className={twMerge(
                "text-primary hover:text-info",
                "absolute size-5 transition duration-300",
                showDisabled ? "opacity-0 scale-50" : "opacity-100 scale-100",
              )}
            />
          </div>
        </IconButton>
      </div>

      <LogList logs={showDisabled ? logs : enabledLogs} />
    </div>
  );
}

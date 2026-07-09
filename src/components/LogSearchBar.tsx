import { Eye, EyeOff, Info } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { IconButton } from "@/elements/IconButton";
import type { LogSearchTag } from "@/lib/types";
import { normalizeText } from "@/lib/utils";

type LogSearchBarProps = {
  addTag: (tag: LogSearchTag) => void;
  showDisabledLogs: boolean;
  toggleDisabledLogs: () => void;
};

export function LogSearchBar({
  addTag,
  showDisabledLogs,
  toggleDisabledLogs,
}: LogSearchBarProps) {
  const [query, setQuery] = useState("");

  function handleSubmit() {
    const input = normalizeText(query);

    const [key, value] = input.split("=");
    if (!key || !value) return;

    switch (key) {
      case "session":
      case "type":
      case "faan":
      case "player":
        addTag({
          id: crypto.randomUUID(),
          label: input,
          key: key,
          value: value,
        });

        setQuery("");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <SearchInstructions />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
        placeholder="Enter a query..."
        className="h-10 w-sm rounded-lg border-2 border-primary bg-secondary px-2 text-center text-sm outline-none"
      />

      <IconButton
        onClick={toggleDisabledLogs}
        className="flex items-center justify-center text-primary hover:text-info"
      >
        <div className="relative size-5">
          <Eye
            className={twMerge(
              "absolute size-5 transition duration-300",
              showDisabledLogs ? "scale-100 opacity-100" : "scale-50 opacity-0",
            )}
          />
          <EyeOff
            className={twMerge(
              "absolute size-5 transition duration-300",
              showDisabledLogs ? "scale-50 opacity-0" : "scale-100 opacity-100",
            )}
          />
        </div>
      </IconButton>
    </div>
  );
}

function SearchInstructions() {
  return (
    <div className="group relative inline-block">
      <IconButton className="flex items-center justify-center text-primary hover:text-info">
        <Info className="size-5" />
      </IconButton>

      <div className="absolute left-1/2 z-10 mt-3 hidden w-max -translate-x-1/2 rounded-xl border-2 border-primary bg-secondary p-2 text-xs group-hover:block">
        <span className="font-bold">How to Search Logs</span>

        <ol className="list-inside list-decimal">
          <li>
            Enter queries in the form <em>key=value</em>:
            <ul className="ml-4 list-inside list-disc">
              <li>session=[session number]</li>
              <li>type=[win type]</li>
              <li>faan=[number of faan]</li>
              <li>player=[player name]</li>
            </ul>
          </li>

          <li>
            Press <em>Enter</em> to create a tag
          </li>
        </ol>
      </div>
    </div>
  );
}

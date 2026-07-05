"use client";

import { Eye, EyeOff, Info, X } from "lucide-react";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { LogList } from "@/components/LogList";
import { useLogs } from "@/context/LogContext";
import { IconButton } from "@/elements/IconButton";

type SearchTag = {
  id: string;
  display: string;
  key: string;
  value: string;
};

function normalizeText(text: string) {
  return text.replaceAll(" ", "").toLowerCase();
}

export default function LogsPage() {
  const { enabledLogs, logs } = useLogs();

  const [query, setQuery] = useState("");
  const [showDisabled, setShowDisabled] = useState(false);
  const [tags, setTags] = useState<SearchTag[]>([]);

  const baseLogs = showDisabled ? logs : enabledLogs;

  const filteredLogs = useMemo(() => {
    if (!tags.length) return baseLogs;

    let result = baseLogs;

    for (const tag of tags) {
      if (tag.key === "session") {
        result = result.filter((log) => {
          return log.session_number === parseInt(tag.value, 10);
        });
      } else if (tag.key === "type") {
        result = result.filter((log) => {
          return normalizeText(log.win_type) === normalizeText(tag.value);
        });
      } else if (tag.key === "faan") {
        result = result.filter((log) => {
          return log.faan === parseInt(tag.value, 10);
        });
      } else if (tag.key === "player") {
        result = result.filter((log) => {
          const isWinner = log.winners.some((player) => {
            return normalizeText(player.name) === normalizeText(tag.value);
          });

          const isLoser = log.losers.some((player) => {
            return normalizeText(player.name) === normalizeText(tag.value);
          });

          return isWinner || isLoser;
        });
      }
    }

    return result;
  }, [baseLogs, tags]);

  function createTag() {
    const input = normalizeText(query);

    const separatorIndex = input.indexOf("=");
    if (separatorIndex === -1) return;

    const key = input.substring(0, separatorIndex);
    const value = input.substring(separatorIndex + 1);
    if (!key || !value) return;

    if (["session", "type", "faan", "player"].includes(key)) {
      const tag: SearchTag = {
        id: crypto.randomUUID(),
        display: input,
        key: key,
        value: value,
      };

      setTags((oldTags) => [...oldTags, tag]);
      setQuery("");
    }
  }

  function removeTag(id: string) {
    setTags((oldTags) => oldTags.filter((tag) => tag.id !== id));
  }

  return (
    <div className="flex flex-col items-center gap-10 p-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <div className="group relative inline-block">
            <IconButton className="text-primary flex items-center justify-center hover:text-info ">
              <Info className="size-5" />
            </IconButton>

            <div
              className="
                hidden group-hover:block absolute bg-secondary border-primary border-2
                w-max left-1/2 -translate-x-1/2 mt-3 p-2 rounded-xl z-10 text-xs
              "
            >
              <span className="font-bold">How to Search Logs</span>

              <ol className="list-inside list-decimal">
                <li>
                  Enter queries in the form <em>key=value</em>:
                  <ul className="list-inside list-disc ml-4">
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

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") createTag();
            }}
            placeholder="Enter a query..."
            className="
              bg-secondary border-primary border-2
              outline-none h-10 rounded-lg w-sm px-2 text-center text-sm
            "
          />

          <IconButton
            onClick={() => setShowDisabled(!showDisabled)}
            className="text-primary flex items-center justify-center hover:text-info"
          >
            <div className="relative size-5">
              <Eye
                className={twMerge(
                  "absolute size-5 transition duration-300",
                  showDisabled ? "opacity-100 scale-100" : "opacity-0 scale-50",
                )}
              />
              <EyeOff
                className={twMerge(
                  "absolute size-5 transition duration-300",
                  showDisabled ? "opacity-0 scale-50" : "opacity-100 scale-100",
                )}
              />
            </div>
          </IconButton>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 w-xl">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="
                bg-accent text-secondary
                flex items-center justify-center gap-1
                rounded-full px-2 py-1 text-xs
              "
            >
              {tag.display}
              <IconButton
                onClick={() => removeTag(tag.id)}
                className="hover:text-negative"
              >
                <X className="size-3" />
              </IconButton>
            </div>
          ))}
        </div>
      </div>

      <LogList logs={filteredLogs} />
    </div>
  );
}

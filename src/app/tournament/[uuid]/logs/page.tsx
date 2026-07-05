"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { LogList } from "@/components/LogList";
import { LogSearchBar } from "@/components/LogSearchBar";
import { useLogs } from "@/context/LogContext";
import { IconButton } from "@/elements/IconButton";
import type { Log, LogSearchTag } from "@/lib/types";
import { normalizeText } from "@/lib/utils";

const tagFilters = {
  session: (log: Log, tag: LogSearchTag) => {
    return log.session_number === parseInt(tag.value, 10);
  },

  type: (log: Log, tag: LogSearchTag) => {
    return normalizeText(log.win_type) === normalizeText(tag.value);
  },

  faan: (log: Log, tag: LogSearchTag) => {
    return log.faan === parseInt(tag.value, 10);
  },

  player: (log: Log, tag: LogSearchTag) => {
    const isWinner = log.winners.some((player) => {
      return normalizeText(player.name) === normalizeText(tag.value);
    });

    const isLoser = log.losers.some((player) => {
      return normalizeText(player.name) === normalizeText(tag.value);
    });

    return isWinner || isLoser;
  },
};

export default function LogsPage() {
  const { enabledLogs, logs } = useLogs();

  const [showDisabledLogs, setShowDisabledLogs] = useState(false);
  const [tags, setTags] = useState<LogSearchTag[]>([]);

  const baseLogs = showDisabledLogs ? logs : enabledLogs;

  const filteredLogs = useMemo(() => {
    if (!tags.length) return baseLogs;

    let result = baseLogs;

    for (const tag of tags) {
      result = result.filter((log) => tagFilters[tag.key](log, tag));
    }

    return result;
  }, [baseLogs, tags]);

  function addTag(tag: LogSearchTag) {
    setTags((tags) => [...tags, tag]);
  }

  function removeTag(id: string) {
    setTags((tags) => tags.filter((tag) => tag.id !== id));
  }

  function toggleDisabledLogs() {
    setShowDisabledLogs((showDisabledLogs) => !showDisabledLogs);
  }

  return (
    <div className="flex flex-col items-center gap-10 p-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <LogSearchBar
          addTag={addTag}
          showDisabledLogs={showDisabledLogs}
          toggleDisabledLogs={toggleDisabledLogs}
        />

        <div className="flex flex-wrap items-center justify-center gap-2 w-xl">
          {tags.map((tag) => (
            <Tag key={tag.id} tag={tag} removeTag={removeTag} />
          ))}
        </div>
      </div>

      <LogList logs={filteredLogs} />
    </div>
  );
}

type TagProps = {
  tag: LogSearchTag;
  removeTag: (id: string) => void;
};

function Tag({ tag, removeTag }: TagProps) {
  return (
    <div
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
  );
}

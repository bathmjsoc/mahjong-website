"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { IconButton } from "@/elements/IconButton";
import { useLogs } from "@/hooks/logs/useLogs";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useSessions } from "@/hooks/sessions/useSessions";
import type { Log, LogSearchTag } from "@/lib/types";
import { normalizeText } from "@/lib/utils";
import { LogList } from "./_components/LogList";
import { LogSearchBar } from "./_components/LogSearchBar";

export default function LogsPage() {
  const { enabledLogs, logs } = useLogs();
  const { playerMap } = usePlayers();
  const { sessionMap } = useSessions();

  const [showDisabledLogs, setShowDisabledLogs] = useState(false);
  const [tags, setTags] = useState<LogSearchTag[]>([]);

  const baseLogs = showDisabledLogs ? logs : enabledLogs;

  const tagFilters = useMemo(
    () => ({
      session: (log: Log, tag: LogSearchTag) => {
        const session = sessionMap.get(log.session_id);
        return session?.number === parseInt(tag.value, 10);
      },

      type: (log: Log, tag: LogSearchTag) => {
        return normalizeText(log.win_type) === normalizeText(tag.value);
      },

      faan: (log: Log, tag: LogSearchTag) => {
        return log.faan === parseInt(tag.value, 10);
      },

      player: (log: Log, tag: LogSearchTag) => {
        const isWinner = log.winner_ids.some((id) => {
          const playerName = playerMap[id]?.name ?? "";
          return normalizeText(playerName) === normalizeText(tag.value);
        });

        const isLoser = log.loser_ids.some((id) => {
          const playerName = playerMap[id]?.name ?? "";
          return normalizeText(playerName) === normalizeText(tag.value);
        });

        return isWinner || isLoser;
      },
    }),
    [playerMap, sessionMap],
  );

  const filteredLogs = useMemo(() => {
    if (!tags.length) return baseLogs;

    return baseLogs.filter((log) =>
      tags.every((tag) => tagFilters[tag.key](log, tag)),
    );
  }, [baseLogs, tagFilters, tags]);

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

        <div className="flex w-xl flex-wrap items-center justify-center gap-2">
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
    <div className="flex items-center justify-center gap-1 rounded-full bg-accent px-2 py-1 text-secondary text-xs">
      {tag.label}

      <IconButton
        onClick={() => removeTag(tag.id)}
        className="hover:text-negative"
      >
        <X className="size-3" />
      </IconButton>
    </div>
  );
}

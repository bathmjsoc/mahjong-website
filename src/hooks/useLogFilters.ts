import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useLogs } from "@/hooks/logs/useLogs";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useSessions } from "@/hooks/sessions/useSessions";
import type { Log, LogSearchTag } from "@/lib/types";
import { normalizeText } from "@/lib/utils";

export function useLogFilters() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { logs, logsWithDisabled } = useLogs();
  const { playerMap } = usePlayers();
  const { sessionMap } = useSessions();

  const showDisabledLogs = searchParams.get("disabled") === "true";
  const baseLogs = showDisabledLogs ? logsWithDisabled : logs;

  const tags: LogSearchTag[] = useMemo(() => {
    return Array.from(searchParams)
      .filter(([key]) => key !== "disabled")
      .map(([key, value]) => ({ key, value }));
  }, [searchParams]);

  const filteredLogs = useMemo(() => {
    if (tags.length === 0) return baseLogs;

    const filters = tags.map((tag) => {
      switch (tag.key) {
        case "session": {
          const session = Number.parseInt(tag.value, 10);
          return (log: Log) => {
            const sessionNumber = sessionMap.get(log.session_id)?.number;
            return sessionNumber === session;
          };
        }

        case "type": {
          const type = normalizeText(tag.value);
          return (log: Log) => normalizeText(log.win_type) === type;
        }

        case "faan": {
          const faan = Number.parseInt(tag.value, 10);
          return (log: Log) => log.faan === faan;
        }

        case "player": {
          const name = normalizeText(tag.value);

          return (log: Log) => {
            const playerIds = [...log.winner_ids, ...log.loser_ids];

            return playerIds.some((id) => {
              const playerName = playerMap.get(id)?.name ?? "";
              return normalizeText(playerName) === name;
            });
          };
        }

        default: {
          return () => true;
        }
      }
    });

    return baseLogs.filter((log) => filters.every((matchFn) => matchFn(log)));
  }, [baseLogs, playerMap, sessionMap, tags]);

  return {
    filteredLogs,
    showDisabledLogs,
    tags,

    addTag: (tag: LogSearchTag) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.getAll(tag.key).includes(tag.value)) return;

      params.append(tag.key, tag.value);
      router.replace(`${pathname}?${params}`);
    },

    removeTag: (tag: LogSearchTag) => {
      const params = new URLSearchParams(searchParams.toString());

      params.delete(tag.key, tag.value);
      router.replace(`${pathname}?${params}`);
    },

    toggleDisabledLogs: () => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("disabled", String(!showDisabledLogs));
      router.replace(`${pathname}?${params}`);
    },
  };
}

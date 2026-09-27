import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useLogs } from "@/hooks/logs/useLogs";
import { usePlayers } from "@/hooks/players/usePlayers";
import { useSessions } from "@/hooks/sessions/useSessions";
import type { LogSearchTag } from "@/lib/types";
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

  const tags: LogSearchTag[] = Array.from(searchParams).map(([key, value]) => {
    return { key, value };
  });

  const filteredLogs = useMemo(() => {
    if (tags.length === 0) return baseLogs;

    return baseLogs.filter((log) =>
      tags.every((tag) => {
        switch (tag.key) {
          case "session": {
            const searchSession = parseInt(tag.value, 10);
            return sessionMap.get(log.session_id)?.number === searchSession;
          }

          case "type": {
            const searchType = normalizeText(tag.value);
            return normalizeText(log.win_type) === searchType;
          }

          case "faan": {
            const searchFaan = parseInt(tag.value, 10);
            return log.faan === searchFaan;
          }

          case "player": {
            const searchName = normalizeText(tag.value);

            const isWinner = log.winner_ids.some((id) => {
              const playerName = playerMap.get(id)?.name ?? "";
              return normalizeText(playerName) === searchName;
            });

            const isLoser = log.loser_ids.some((id) => {
              const playerName = playerMap.get(id)?.name ?? "";
              return normalizeText(playerName) === searchName;
            });

            return isWinner || isLoser;
          }

          default:
            return true;
        }
      }),
    );
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

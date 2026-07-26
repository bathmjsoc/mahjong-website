import { useQuery } from "@tanstack/react-query";
import { fetchTables } from "@/actions/tables";
import { useSessions } from "@/hooks/sessions/useSessions";
import type { Table } from "@/types/app.types";

type UseTablesType = {
  availableTables: Table[];
  duplicatePlayerIds: Set<string>;
  seatedPlayerIds: Set<string>;
  tables: Table[];
  isLoading: boolean;
  isError: boolean;
};

export function useTables(): UseTablesType {
  const { currentSession } = useSessions();

  const queryKey = ["tables", currentSession?.id];
  const query = useQuery({
    queryKey,
    queryFn: () => {
      if (!currentSession) return [];
      return fetchTables(currentSession);
    },
    enabled: !!currentSession,
    select: (tables) => {
      tables.sort((a, b) => {
        if (a.saved !== b.saved) {
          return Number(a.saved) - Number(b.saved);
        }

        return a.number - b.number;
      });

      const availableTables: Table[] = [];
      const duplicatePlayerIds = new Set<string>();
      const seatedPlayerIds = new Set<string>();

      for (const table of tables) {
        if (table.saved) continue;
        availableTables.push(table);

        const SEAT_IDS = [
          table.east_id,
          table.south_id,
          table.west_id,
          table.north_id,
        ] as const;

        for (const id of SEAT_IDS) {
          if (!id) continue;

          if (seatedPlayerIds.has(id)) {
            duplicatePlayerIds.add(id);
          } else {
            seatedPlayerIds.add(id);
          }
        }
      }

      return {
        tables,
        availableTables,
        duplicatePlayerIds,
        seatedPlayerIds,
      };
    },
  });

  return {
    availableTables: query.data?.availableTables ?? [],
    duplicatePlayerIds: query.data?.duplicatePlayerIds ?? new Set<string>(),
    seatedPlayerIds: query.data?.seatedPlayerIds ?? new Set<string>(),
    tables: query.data?.tables ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

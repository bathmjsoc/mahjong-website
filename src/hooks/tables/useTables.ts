import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useSessions } from "@/hooks/sessions/useSessions";
import { createClient } from "@/lib/supabase/client";
import type { Session, Table } from "@/lib/types";

type UseTablesType = {
  availableTables: Table[];
  duplicatePlayerIds: Set<string>;
  seatedPlayerIds: Set<string>;
  tables: Table[];
};

export function useTables(): UseTablesType {
  const { currentSession } = useSessions();

  const selectTables = useCallback((rawTables: Table[]) => {
    const tables = [...rawTables].sort((a, b) => {
      if (a.saved !== b.saved) {
        return Number(a.saved) - Number(b.saved);
      }

      return a.number - b.number;
    });

    const availableTables = [];
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
  }, []);

  const query = useSuspenseQuery({
    queryKey: ["tables", currentSession?.id],
    queryFn: () => {
      if (!currentSession) return [];
      return fetchTables(currentSession);
    },
    select: selectTables,
  });

  return {
    availableTables: query.data.availableTables,
    duplicatePlayerIds: query.data.duplicatePlayerIds,
    seatedPlayerIds: query.data.seatedPlayerIds,
    tables: query.data.tables,
  };
}

async function fetchTables(session: Session): Promise<Table[]> {
  const supabase = createClient();

  const { data: tables, error } = await supabase
    .from("tables")
    .select("*")
    .eq("session_id", session.id);

  if (error)
    throw new Error(`fetchTables encountered an error: ${error.message}`);

  return tables ?? [];
}

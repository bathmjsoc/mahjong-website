import { useSuspenseQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Table } from "@/lib/types";
import { useSessionContext } from "@/providers/SessionProvider";

type UseTablesType = {
  availableTables: Table[];
  duplicatePlayerIds: Set<string>;
  seatedPlayerIds: Set<string>;
  tables: Table[];
};

export function useTables(): UseTablesType {
  const { sessionId } = useSessionContext();

  const query = useSuspenseQuery({
    queryKey: ["tables", sessionId],
    queryFn: () => fetchTables(sessionId),
    select: selectTables,
  });

  return query.data;
}

function selectTables(rawTables: Table[]): UseTablesType {
  const tables = rawTables.toSorted((a, b) => {
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

    const seatIds = [
      table.east_id,
      table.south_id,
      table.west_id,
      table.north_id,
    ] as const;

    for (const id of seatIds) {
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
}

async function fetchTables(sessionId: string): Promise<Table[]> {
  const supabase = createClient();

  const { data: tables, error } = await supabase
    .from("tables")
    .select("*")
    .eq("session_id", sessionId);

  if (error) {
    throw new Error(`fetchTables encountered an error: ${error.message}`);
  }

  return tables ?? [];
}

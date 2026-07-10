"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchTables } from "@/actions/tables";
import { useSessions } from "@/hooks/useSessions";
import { createClient } from "@/lib/supabase/client";
import type { Table } from "@/lib/types";

type UseTablesType = {
  availableTables: Table[];
  duplicatePlayerIds: Set<string>;
  seatedPlayerIds: Set<string>;
  tables: Table[];
  isLoading: boolean;
  isError: boolean;
};

const supabase = createClient();

export function useTables(): UseTablesType {
  const { currentSession } = useSessions();

  const queryClient = useQueryClient();
  const queryKey = ["tables", currentSession.id];

  const query = useQuery({
    queryKey,
    queryFn: () => fetchTables(currentSession),
    enabled: !!currentSession,
    select: (tables) => {
      const availableTables: Table[] = [];
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
        ];

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
    },
  });

  useEffect(() => {
    if (!currentSession) return;

    const channel = supabase
      .channel(`tables:${currentSession.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tables",
          filter: `session_id=eq.${currentSession.id}`,
        },
        () => queryClient.invalidateQueries({ queryKey }),
      )
      .subscribe();

    return () => void supabase.removeChannel(channel);
  }, [currentSession, queryClient, queryKey]);

  return {
    availableTables: query.data?.availableTables ?? [],
    duplicatePlayerIds: query.data?.duplicatePlayerIds ?? new Set<string>(),
    seatedPlayerIds: query.data?.seatedPlayerIds ?? new Set<string>(),
    tables: query.data?.tables ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

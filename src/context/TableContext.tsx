"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchTables } from "@/actions/tables";
import { useSessions } from "@/context/SessionContext";
import { createClient } from "@/lib/supabase/browser";
import type { Table } from "@/lib/types";

type TablesContextType = {
  availableTables: Table[];
  duplicatePlayerIds: Set<string>;
  seatedPlayerIds: Set<string>;
  tables: Table[];
};

const TablesContext = createContext<TablesContextType | undefined>(undefined);
const supabase = createClient();

export const TablesProvider = ({ children }: { children: ReactNode }) => {
  const { currentSession } = useSessions();

  const [tables, setTables] = useState<Table[]>([]);

  const { availableTables, seatedPlayerIds, duplicatePlayerIds } =
    useMemo(() => {
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
        availableTables,
        duplicatePlayerIds,
        seatedPlayerIds,
      };
    }, [tables]);

  useEffect(() => {
    if (!currentSession) return;
    fetchTables(currentSession).then(setTables);

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
        () => fetchTables(currentSession).then(setTables),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [currentSession]);

  return (
    <TablesContext.Provider
      value={{
        availableTables,
        duplicatePlayerIds,
        seatedPlayerIds,
        tables,
      }}
    >
      {children}
    </TablesContext.Provider>
  );
};

export const useTables = () => {
  const context = useContext(TablesContext);
  if (!context)
    throw new Error("useTables must be used within TablesProvider!");
  return context;
};

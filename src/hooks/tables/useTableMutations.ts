import { useQueryClient } from "@tanstack/react-query";
import {
  createTable as createTableAction,
  deleteTable as deleteTableAction,
  updateTable as updateTableAction,
} from "@/actions/tables";
import {
  useCacheItems,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Player, Table, Wind } from "@/lib/types";

export function useTableMutations() {
  const queryClient = useQueryClient();

  const getTablesQueryKey = (table: Table) => ["tables", table.session_id];

  const { addItem, updateItem, removeItem } = useCacheItems<Table>({
    getId: (table) => table.id,
    getQueryKey: getTablesQueryKey,
  });

  const createMutation = useOptimisticMutation({
    mutationFn: createTableAction,
    getQueryKey: getTablesQueryKey,
    optimisticUpdate: addItem,
  });

  const saveMutation = useOptimisticMutation({
    mutationFn: createTableAction,
    getQueryKey: getTablesQueryKey,
    optimisticUpdate: addItem,
  });

  const updateMutation = useOptimisticMutation({
    mutationFn: updateTableAction,
    getQueryKey: getTablesQueryKey,
    optimisticUpdate: updateItem,
  });

  const deleteMutation = useOptimisticMutation({
    mutationFn: deleteTableAction,
    getQueryKey: getTablesQueryKey,
    optimisticUpdate: removeItem,
  });

  return {
    createTable(sessionId: string) {
      const tables =
        queryClient.getQueryData<Table[]>(["tables", sessionId]) ?? [];
      const nextNumber = tables.filter((table) => !table.saved).length + 1;

      createMutation.mutate({
        id: crypto.randomUUID(),
        session_id: sessionId,
        east_id: null,
        south_id: null,
        west_id: null,
        north_id: null,
        number: nextNumber,
        saved: false,
      });
    },

    saveTable(table: Table) {
      saveMutation.mutate({
        ...table,
        id: crypto.randomUUID(), // Assign a new UUID to create a copy of the table
        saved: true,
      });
    },

    updateTable(table: Table, seats: Partial<Record<Wind, Player | null>>) {
      const updatedTable = { ...table };

      if ("east" in seats) updatedTable.east_id = seats.east?.id ?? null;
      if ("south" in seats) updatedTable.south_id = seats.south?.id ?? null;
      if ("west" in seats) updatedTable.west_id = seats.west?.id ?? null;
      if ("north" in seats) updatedTable.north_id = seats.north?.id ?? null;

      updateMutation.mutate(updatedTable);
    },

    deleteTable(table: Table) {
      deleteMutation.mutate(table);
    },
  };
}

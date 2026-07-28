import { useQueryClient } from "@tanstack/react-query";
import {
  createTable as createTableAction,
  deleteTable as deleteTableAction,
  saveTable as saveTableAction,
  updateTable as updateTableAction,
} from "@/actions/tables";
import {
  useCacheItems,
  useOptimisticMutation,
} from "@/hooks/useOptimisticUpdates";
import type { Player, Table, Wind } from "@/lib/types";

type UpdateTableVariables = {
  table: Table;
  seats: Partial<Record<Wind, Player | null>>;
};

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
    mutationFn: saveTableAction,
    getQueryKey: getTablesQueryKey,
    optimisticUpdate: (table) => updateItem({ ...table, saved: true }),
  });

  const updateMutation = useOptimisticMutation<UpdateTableVariables, void>({
    mutationFn: ({ table, seats }) => updateTableAction(table, seats),
    getQueryKey: ({ table }) => getTablesQueryKey(table),
    optimisticUpdate: ({ table, seats }) => {
      const nextTable: Table = { ...table };

      if ("east" in seats) nextTable.east_id = seats.east?.id ?? null;
      if ("south" in seats) nextTable.south_id = seats.south?.id ?? null;
      if ("west" in seats) nextTable.west_id = seats.west?.id ?? null;
      if ("north" in seats) nextTable.north_id = seats.north?.id ?? null;

      updateItem(nextTable);
    },
  });

  const deleteMutation = useOptimisticMutation({
    mutationFn: deleteTableAction,
    getQueryKey: getTablesQueryKey,
    optimisticUpdate: removeItem,
  });

  return {
    createTable(sessionId: string) {
      const tables = queryClient.getQueryData<Table[]>(["tables", sessionId]);

      createMutation.mutate({
        id: crypto.randomUUID(),
        session_id: sessionId,
        east_id: null,
        south_id: null,
        west_id: null,
        north_id: null,
        number: (tables?.length ?? 0) + 1,
        saved: false,
      });
    },

    saveTable(table: Table) {
      saveMutation.mutate(table);
    },

    updateTable(table: Table, seats: Partial<Record<Wind, Player | null>>) {
      updateMutation.mutate({ table, seats });
    },

    deleteTable(table: Table) {
      deleteMutation.mutate(table);
    },
  };
}

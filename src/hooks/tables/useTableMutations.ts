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
import { SEATS } from "@/lib/constants";
import type { Player, Session, Table, Wind } from "@/types/app.types";

type UpdateTableVariables = {
  table: Table;
  players: Partial<Record<Wind, Player | null>>;
  nextTable: Table;
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
    mutationFn: ({ table, players }) => updateTableAction(table, players),
    getQueryKey: ({ table }) => getTablesQueryKey(table),
    optimisticUpdate: ({ nextTable }) => updateItem(nextTable),
  });

  const deleteMutation = useOptimisticMutation({
    mutationFn: deleteTableAction,
    getQueryKey: getTablesQueryKey,
    optimisticUpdate: removeItem,
  });

  return {
    createTable(session: Session) {
      const tables = queryClient.getQueryData<Table[]>(["tables", session.id]);

      createMutation.mutate({
        id: crypto.randomUUID(),
        session_id: session.id,
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

    updateTable(table: Table, players: Partial<Record<Wind, Player | null>>) {
      const nextTable: Table = { ...table };

      for (const wind of SEATS) {
        if (wind in players) {
          nextTable[`${wind}_id`] = players[wind]?.id ?? null;
        }
      }

      updateMutation.mutate({ table, players, nextTable });
    },

    deleteTable(table: Table) {
      deleteMutation.mutate(table);
    },
  };
}

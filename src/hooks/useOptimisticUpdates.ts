import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";

type OptimisticMutationOptions<TVariables, TData> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  getQueryKey: (variables: TVariables) => QueryKey;
  optimisticUpdate: (variables: TVariables) => void;
};

export function useOptimisticMutation<TVariables, TData>({
  mutationFn,
  getQueryKey,
  optimisticUpdate,
}: OptimisticMutationOptions<TVariables, TData>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutationFn,
    async onMutate(variables) {
      const queryKey = getQueryKey(variables);

      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      optimisticUpdate(variables);

      return { previousData, queryKey };
    },
    onError(_error, _variables, context) {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },
  });
}

type CachedItemsOptions<T> = {
  getQueryKey: (item: T) => QueryKey;
  getId: (item: T) => string;
};

export function useCacheItems<T>({
  getQueryKey,
  getId,
}: CachedItemsOptions<T>) {
  const queryClient = useQueryClient();

  return useMemo(
    () => ({
      addItem(item: T) {
        const queryKey = getQueryKey(item);

        queryClient.setQueryData<T[]>(queryKey, (items = []) => [
          ...items,
          item,
        ]);
      },

      updateItem(item: T) {
        const queryKey = getQueryKey(item);
        const itemId = getId(item);

        queryClient.setQueryData<T[]>(queryKey, (items = []) =>
          items.map((current) => (getId(current) === itemId ? item : current)),
        );
      },

      patchItem(id: string, queryKey: QueryKey, changes: Partial<T>) {
        queryClient.setQueryData<T[]>(queryKey, (items = []) =>
          items.map((current) =>
            getId(current) === id ? { ...current, ...changes } : current,
          ),
        );
      },

      removeItem(item: T) {
        const queryKey = getQueryKey(item);
        const itemId = getId(item);

        queryClient.setQueryData<T[]>(queryKey, (items = []) =>
          items.filter((current) => getId(current) !== itemId),
        );
      },
    }),
    [getId, getQueryKey, queryClient],
  );
}

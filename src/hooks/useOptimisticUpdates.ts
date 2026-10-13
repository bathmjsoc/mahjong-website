import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

type UseOptimisticMutationType<TVariables, TData> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKeyFn: (variables: TVariables) => QueryKey;
  optimisticFn: (variables: TVariables) => void;
};

export function useOptimisticMutation<TVariables, TData>({
  mutationFn,
  queryKeyFn,
  optimisticFn,
}: UseOptimisticMutationType<TVariables, TData>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutationFn,
    async onMutate(variables) {
      const queryKey = queryKeyFn(variables);

      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      optimisticFn(variables);

      return { previousData, queryKey };
    },
    onError(_error, _variables, context) {
      if (context) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },
    onSettled(_data, _error, variables) {
      const queryKey = queryKeyFn(variables);

      return queryClient.invalidateQueries({ queryKey });
    },
  });
}

type UseCacheMutatorsType<T> = {
  getQueryKey: (item: T) => QueryKey;
  getId: (item: T) => string;
};

export function useCacheMutators<T>({
  getQueryKey,
  getId,
}: UseCacheMutatorsType<T>) {
  const queryClient = useQueryClient();

  return {
    upsertItem(item: T) {
      const queryKey = getQueryKey(item);
      const itemId = getId(item);

      const currentItems = queryClient.getQueryData<T[]>(queryKey) ?? [];
      const index = currentItems.findIndex(
        (current) => getId(current) === itemId,
      );

      const updatedItems =
        index === -1 ? [...currentItems, item] : currentItems.with(index, item);
      queryClient.setQueryData<T[]>(queryKey, updatedItems);
    },

    removeItem(item: T) {
      const queryKey = getQueryKey(item);
      const itemId = getId(item);

      const currentItems = queryClient.getQueryData<T[]>(queryKey) ?? [];
      const updatedItems = currentItems.filter(
        (current) => getId(current) !== itemId,
      );

      queryClient.setQueryData<T[]>(queryKey, updatedItems);
    },
  };
}

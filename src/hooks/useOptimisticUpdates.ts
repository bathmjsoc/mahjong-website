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
    createItem(item: T) {
      const queryKey = getQueryKey(item);

      const currentItems = queryClient.getQueryData<T[]>(queryKey) ?? [];
      const updatedItems = [...currentItems, item];

      queryClient.setQueryData<T[]>(queryKey, updatedItems);
    },

    updateItem(item: T) {
      const queryKey = getQueryKey(item);
      const itemId = getId(item);

      const currentItems = queryClient.getQueryData<T[]>(queryKey) ?? [];
      const updatedItems = currentItems.map((current) =>
        getId(current) === itemId ? item : current,
      );

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

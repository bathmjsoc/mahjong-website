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
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },
    onSettled(_data, _error, variables) {
      void queryClient.invalidateQueries({ queryKey: getQueryKey(variables) });
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

      queryClient.setQueryData<T[]>(queryKey, (items = []) => [...items, item]);
    },

    updateItem(item: T) {
      const queryKey = getQueryKey(item);
      const itemId = getId(item);

      queryClient.setQueryData<T[]>(queryKey, (items = []) =>
        items.map((current) => (getId(current) === itemId ? item : current)),
      );
    },

    removeItem(item: T) {
      const queryKey = getQueryKey(item);
      const itemId = getId(item);

      queryClient.setQueryData<T[]>(queryKey, (items = []) =>
        items.filter((current) => getId(current) !== itemId),
      );
    },
  };
}

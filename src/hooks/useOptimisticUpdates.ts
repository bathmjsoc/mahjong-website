import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

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
      optimisticUpdate(variables);
    },
    onSettled(_data, _error, variables) {
      void queryClient.invalidateQueries({
        queryKey: getQueryKey(variables),
      });
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

  return {
    addItem(item: T) {
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

    patchItem(item: T, changes: Partial<T>) {
      const itemId = getId(item);

      queryClient.setQueryData<T[]>(getQueryKey(item), (items = []) =>
        items.map((current) =>
          getId(current) === itemId ? { ...current, ...changes } : current,
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
  };
}

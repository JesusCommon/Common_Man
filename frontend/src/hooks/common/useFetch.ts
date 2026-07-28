import { useCallback, useEffect, useState } from 'react';

interface UseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: unknown;
}

interface UseFetchOptions {
  enabled?: boolean;
}

interface UseFetchReturn<T> extends UseFetchState<T> {
  refetch: () => Promise<void>;
}

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[] = [],
  options: UseFetchOptions = {},
): UseFetchReturn<T> {
  const { enabled = true } = options;

  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    isLoading: enabled,
    error: null,
  });

  const depsKey = JSON.stringify(deps);

  const fetchData = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await fetchFn();
      setState({ data: result, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey]);

  useEffect(() => {
    if (!enabled) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [enabled, fetchData]);

  return { ...state, refetch: fetchData };
}
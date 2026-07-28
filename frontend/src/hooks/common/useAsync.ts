import { useCallback, useState } from 'react';

interface UseAsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: unknown;
}

interface UseAsyncReturn<T, Args extends unknown[]> extends UseAsyncState<T> {
  execute: (...args: Args) => Promise<T>;
  reset: () => void;
}

export function useAsync<T, Args extends unknown[] = []>(
  asyncFn: (...args: Args) => Promise<T>,
): UseAsyncReturn<T, Args> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T> => {
      setState({ data: null, isLoading: true, error: null });
      try {
        const result = await asyncFn(...args);
        setState({ data: result, isLoading: false, error: null });
        return result;
      } catch (error) {
        setState({ data: null, isLoading: false, error });
        throw error;
      }
    },
    [asyncFn],
  );

  const reset = useCallback((): void => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
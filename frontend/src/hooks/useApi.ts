import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (promise: Promise<{ data: { data: T } }>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await promise;
      setState({ data: response.data.data, loading: false, error: null });
      return response.data.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message ?? 'An error occurred';
      setState({ data: null, loading: false, error: message });
      throw err;
    }
  }, []);

  return { ...state, execute };
}

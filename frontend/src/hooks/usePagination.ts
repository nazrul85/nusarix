import { useState, useEffect, useCallback, useRef } from 'react';
import { AxiosError } from 'axios';
import { PaginatedResponse } from '../types';

interface PaginationState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  total: number;
  search: string;
}

export function usePagination<T>(
  fetchFn: (params: Record<string, unknown>) => Promise<{ data: { data: PaginatedResponse<T> } }>
) {
  const [state, setState] = useState<PaginationState<T>>({
    items: [],
    loading: false,
    error: null,
    currentPage: 1,
    lastPage: 1,
    total: 0,
    search: '',
  });

  // Use a ref to hold the latest fetchFn to avoid stale closure issues
  const fetchFnRef = useRef(fetchFn);
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const fetchData = useCallback(async (page = 1, search = '') => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetchFnRef.current({ page, search, per_page: 15 });
      const { data, current_page, last_page, total } = response.data.data;
      setState((prev) => ({
        ...prev,
        items: data,
        loading: false,
        currentPage: current_page,
        lastPage: last_page,
        total,
        search,
      }));
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message ?? 'Failed to load data',
      }));
    }
  }, []);

  useEffect(() => {
    fetchData(1, '');
  }, [fetchData]);

  const setPage = (page: number) => fetchData(page, state.search);
  const setSearch = (search: string) => fetchData(1, search);
  const refresh = () => fetchData(state.currentPage, state.search);

  return { ...state, setPage, setSearch, refresh };
}

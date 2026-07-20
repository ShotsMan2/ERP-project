import { useState, useCallback } from 'react';

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  total: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotal: (total: number) => void;
  onChange: (page: number, pageSize: number) => void;
  reset: () => void;
}

export function usePagination(initialPage = 1, initialPageSize = 20): UsePaginationReturn {
  const [state, setState] = useState<PaginationState>({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
  });

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setState((prev) => ({ ...prev, page: 1, pageSize }));
  }, []);

  const setTotal = useCallback((total: number) => {
    setState((prev) => ({ ...prev, total }));
  }, []);

  const onChange = useCallback((page: number, pageSize: number) => {
    setState({ page, pageSize, total: state.total });
  }, [state.total]);

  const reset = useCallback(() => {
    setState({ page: initialPage, pageSize: initialPageSize, total: 0 });
  }, [initialPage, initialPageSize]);

  return { ...state, setPage, setPageSize, setTotal, onChange, reset };
}

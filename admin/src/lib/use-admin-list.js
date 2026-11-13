import { useEffect, useState } from 'react';

// Filtering and page reset commit together, so a new query never requests a
// stale page. useAdminResource aborts superseded queries and discards results.
export function useAdminList(initialFilters = {}, initialLimit = 20) {
  const [search, setSearch] = useState('');
  const [state, setState] = useState({ filters: { ...initialFilters, search: '' }, page: 1, limit: initialLimit });
  useEffect(() => {
    const timer = setTimeout(() => setState(previous => previous.filters.search === search.trim() ? previous : {
      ...previous, page: 1, filters: { ...previous.filters, search: search.trim() }
    }), 350);
    return () => clearTimeout(timer);
  }, [search]);
  return { ...state, search, setSearch,
    pendingSearch: search.trim() !== state.filters.search,
    setPage: page => setState(previous => ({ ...previous, page })),
    setLimit: limit => setState(previous => ({ ...previous, limit, page: 1 })),
    filter: (key, value) => setState(previous => ({ ...previous, page: 1, filters: { ...previous.filters, [key]: value } })) };
}

import { useState } from 'react';
import type { SearchParams } from '../types';
import { useAppStore } from '../store/appStore';
import { flightApi } from '../api';

export function useFlightSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useAppStore((s) => s.searchParams);
  const setSearchResults = useAppStore((s) => s.setSearchResults);
  const setSearchParams = useAppStore((s) => s.setSearchParams);

  async function search(overrides?: Partial<SearchParams>) {
    const params = overrides ? { ...searchParams, ...overrides } : searchParams;
    setIsLoading(true);
    setError(null);
    try {
      const results = await flightApi.searchFlights(params);
      setSearchResults(results);
    } catch {
      setError('Failed to fetch flights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return { search, isLoading, error, setSearchParams };
}

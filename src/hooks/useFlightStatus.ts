import { useState, useEffect } from 'react';
import { flightApi } from '../api';
import type { FlightStatusInfo } from '../types';

export function useFlightStatus(flightNumber: string, date: string) {
  const [data, setData] = useState<FlightStatusInfo | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!flightNumber || !date) return;

    let cancelled = false;

    async function fetchStatus() {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      try {
        const result = await flightApi.getFlightStatus(flightNumber, date);
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) {
          setIsError(true);
          setError(e as Error);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchStatus();
    // Re-fetch every 30 seconds for live status
    const interval = setInterval(fetchStatus, 30_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [flightNumber, date]);

  return { data, isLoading, isError, error };
}

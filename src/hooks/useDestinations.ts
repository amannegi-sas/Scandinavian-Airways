import { useState, useEffect } from 'react';
import { destinationApi } from '../api';
import type { Destination } from '../types';

export function useDestinations(popularOnly = false) {
  const [data, setData] = useState<Destination[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fn = popularOnly
      ? destinationApi.getPopularDestinations
      : destinationApi.getDestinations;

    fn().then((result) => {
      if (!cancelled) {
        setData(result);
        setIsLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [popularOnly]);

  return { data, isLoading };
}

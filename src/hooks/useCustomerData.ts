import { useState, useEffect } from 'react';
import { bookingApi, euroBonusApi } from '../api';
import { useAppStore } from '../store/appStore';
import type { Booking } from '../types';

export function useBookings() {
  const [data, setData] = useState<Booking[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    bookingApi.getBookings().then((result) => {
      if (!cancelled) { setData(result); setIsLoading(false); }
    }).catch(() => {
      if (!cancelled) { setIsError(true); setIsLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  async function cancelBooking(bookingId: string) {
    setIsCancelling(true);
    setCancellingId(bookingId);
    try {
      await bookingApi.cancelBooking(bookingId);
      // Update local state to reflect the cancellation
      setData((prev) =>
        prev?.map((b) => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b)
      );
    } finally {
      setIsCancelling(false);
      setCancellingId(null);
    }
  }

  const cancel = { mutate: cancelBooking, isPending: isCancelling, variables: cancellingId };
  return { data, isLoading, isError, cancel };
}

export function useEuroBonus(memberId?: string) {
  const storeMember = useAppStore((s) => s.member);
  const id = memberId ?? storeMember?.memberId;

  const [data, setData] = useState<typeof storeMember>(undefined as never);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setIsLoading(true);
    euroBonusApi.getMember(id).then((result) => {
      if (!cancelled) { setData(result as never); setIsLoading(false); }
    }).catch(() => {
      if (!cancelled) { setIsError(true); setIsLoading(false); }
    });
    return () => { cancelled = true; };
  }, [id]);

  return { data, isLoading, isError };
}

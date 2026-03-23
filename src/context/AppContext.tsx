import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { SearchParams, Flight, Fare, EuroBonusMember } from '../types';

interface BookingDraft {
  flight: Flight | null;
  fare: Fare | null;
}

export interface AppState {
  searchParams: SearchParams;
  searchResults: Flight[];
  bookingDraft: BookingDraft;
  member: EuroBonusMember | null;
  isAuthenticated: boolean;

  setSearchParams: (params: Partial<SearchParams>) => void;
  setSearchResults: (flights: Flight[]) => void;
  selectFlightAndFare: (flight: Flight, fare: Fare) => void;
  clearBookingDraft: () => void;
  setMember: (member: EuroBonusMember | null) => void;
  setAuthenticated: (value: boolean) => void;
}

const defaultSearchParams: SearchParams = {
  origin: 'ARN',
  destination: 'CPH',
  departureDate: '',
  cabinClass: 'economy',
  tripType: 'roundtrip',
  passengers: { adults: 1, children: 0, infants: 0 },
};

function loadFromStorage(): { member: EuroBonusMember | null; isAuthenticated: boolean } {
  try {
    const raw = localStorage.getItem('Airways-app-storage');
    if (raw) {
      const stored = JSON.parse(raw);
      return {
        member: stored.member ?? null,
        isAuthenticated: stored.isAuthenticated ?? false,
      };
    }
  } catch {
    // ignore parse errors
  }
  return { member: null, isAuthenticated: false };
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = loadFromStorage();

  const [searchParams, setSearchParamsState] = useState<SearchParams>(defaultSearchParams);
  const [searchResults, setSearchResultsState] = useState<Flight[]>([]);
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>({ flight: null, fare: null });
  const [member, setMemberState] = useState<EuroBonusMember | null>(saved.member);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(saved.isAuthenticated);

  // Persist member and auth state to localStorage
  useEffect(() => {
    localStorage.setItem('Airways-app-storage', JSON.stringify({ member, isAuthenticated }));
  }, [member, isAuthenticated]);

  function setSearchParams(params: Partial<SearchParams>) {
    setSearchParamsState((prev) => ({ ...prev, ...params }));
  }

  function setSearchResults(flights: Flight[]) {
    setSearchResultsState(flights);
  }

  function selectFlightAndFare(flight: Flight, fare: Fare) {
    setBookingDraft({ flight, fare });
  }

  function clearBookingDraft() {
    setBookingDraft({ flight: null, fare: null });
  }

  function setMember(m: EuroBonusMember | null) {
    setMemberState(m);
  }

  function setAuthenticated(value: boolean) {
    setIsAuthenticatedState(value);
  }

  const value: AppState = {
    searchParams,
    searchResults,
    bookingDraft,
    member,
    isAuthenticated,
    setSearchParams,
    setSearchResults,
    selectFlightAndFare,
    clearBookingDraft,
    setMember,
    setAuthenticated,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside <AppProvider>');
  return ctx;
}

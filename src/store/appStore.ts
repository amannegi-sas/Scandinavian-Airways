import { useAppContext, type AppState } from '../context/AppContext';

// Thin wrapper that keeps the same selector-based API as before.
// All existing consumers (useAppStore((s) => s.member)) continue to work unchanged.
export function useAppStore<T>(selector: (state: AppState) => T): T {
  return selector(useAppContext());
}

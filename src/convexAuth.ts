/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useMemo, useState, useEffect } from 'react';

/**
 * Simple hook: reads a token from localStorage (or sessionStorage) and
 * returns the shape Convex expects:
 * { isLoading: boolean, isAuthenticated: boolean, fetchAccessToken: (...) => Promise<string|null> }
 */
export function useConvexAuth() {
  const TOKEN_KEY = import.meta.env.VITE_ID_TOKEN_KEY ?? 'idToken';
  const STORE =
    (import.meta.env.VITE_ID_TOKEN_STORE as string) || 'localStorage';

  const readToken = () => {
    try {
      if (STORE === 'sessionStorage') {
        return typeof window !== 'undefined'
          ? sessionStorage.getItem(TOKEN_KEY)
          : null;
      }
      return typeof window !== 'undefined'
        ? localStorage.getItem(TOKEN_KEY)
        : null;
    } catch {
      return null;
    }
  };

  const [tokenPresent, setTokenPresent] = useState<boolean>(!!readToken());
  const [isLoading] = useState(false);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_KEY) setTokenPresent(!!e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [TOKEN_KEY]);

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      return readToken() || null;
    },
    []
  );

  return useMemo(
    () => ({
      isLoading,
      isAuthenticated: !!tokenPresent,
      fetchAccessToken,
    }),
    [isLoading, tokenPresent, fetchAccessToken]
  );
}

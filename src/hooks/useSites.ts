// src/hooks/useSites.ts
import { useState, useEffect, useCallback } from 'react';

export interface Site {
  id: string;
  user_id: string;
  site_url: string;
  created_at: string;
}

function useSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/sites');
      if (!response.ok) {
        throw new Error('Failed to fetch sites');
      }
      const data = await response.json();
      setSites(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  return { sites, isLoading, error, mutate: fetchSites };
}

export default useSites;

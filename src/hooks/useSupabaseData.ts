import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface UseSupabaseDataOptions {
  table: string;
  columns?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  enabled?: boolean;
}

interface UseSupabaseDataResult<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  count: number;
}

export function useSupabaseData<T = any>({
  table,
  columns = '*',
  filters = {},
  orderBy,
  limit,
  enabled = true
}: UseSupabaseDataOptions): UseSupabaseDataResult<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const [count, setCount] = useState(0);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select(columns, { count: 'exact' });

      // Appliquer les filtres
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      // Appliquer le tri
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
      }

      // Appliquer la limite
      if (limit) {
        query = query.limit(limit);
      }

      const { data: result, error: queryError, count: totalCount } = await query;

      if (queryError) {
        throw new Error(queryError.message);
      }

      setData(result || []);
      setCount(totalCount || 0);
    } catch (err) {
      console.error(`Erreur lors du chargement de ${table}:`, err);
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [table, columns, filters, orderBy, limit, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    count
  };
}

// Hook spécialisé pour les témoignages
export function useTestimonies(status: 'pending' | 'approved' | 'rejected' = 'approved') {
  return useSupabaseData({
    table: 'testimonies',
    filters: { status },
    orderBy: { column: 'created_at', ascending: false }
  });
}

// Hook spécialisé pour les prières
export function usePrayers(status: 'pending' | 'approved' | 'rejected' = 'approved') {
  return useSupabaseData({
    table: 'prayer_requests',
    filters: { status },
    orderBy: { column: 'created_at', ascending: false }
  });
}

// Hook pour les statistiques du dashboard
export function useDashboardStats() {
  const { data: testimonies, loading: loadingTestimonies } = useTestimonies('pending');
  const { data: prayers, loading: loadingPrayers } = usePrayers('pending');

  return {
    pendingTestimonies: testimonies?.length || 0,
    pendingPrayers: prayers?.length || 0,
    loading: loadingTestimonies || loadingPrayers
  };
} 
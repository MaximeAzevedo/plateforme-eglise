import React from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes par défaut

  set<T>(key: string, data: T, ttl?: number): void {
    const expiry = ttl || this.defaultTTL;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Vérifier si l'élément a expiré
    if (Date.now() - item.timestamp > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    // Vérifier si l'élément a expiré
    if (Date.now() - item.timestamp > item.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Nettoyer les éléments expirés
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Statistiques du cache
  stats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Instance globale du cache
export const cache = new SimpleCache();

// Nettoyer le cache toutes les 10 minutes
setInterval(() => cache.cleanup(), 10 * 60 * 1000);

// Utilitaires pour les clés de cache
export const cacheKeys = {
  testimonies: (status: string) => `testimonies_${status}`,
  prayers: (status: string) => `prayers_${status}`,
  places: (filters: string) => `places_${filters}`,
  stats: () => 'dashboard_stats'
};

// Hook pour utiliser le cache avec les données Supabase
export function useCachedSupabaseData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): [T | null, boolean, () => Promise<void>] {
  const [data, setData] = React.useState<T | null>(cache.get(key));
  const [loading, setLoading] = React.useState(!cache.has(key));

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetcher();
      cache.set(key, result, ttl);
      setData(result);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl]);

  React.useEffect(() => {
    if (!cache.has(key)) {
      fetchData();
    }
  }, [key, fetchData]);

  return [data, loading, fetchData];
} 
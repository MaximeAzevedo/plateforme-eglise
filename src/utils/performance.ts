import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals';

// Types pour les métriques de performance
interface PerformanceMetrics {
  cls: number | null;
  fid: number | null;
  fcp: number | null;
  lcp: number | null;
  ttfb: number | null;
  timestamp: number;
  url: string;
  userAgent: string;
}

// Configuration des seuils de performance
const PERFORMANCE_THRESHOLDS = {
  lcp: { good: 2500, poor: 4000 },
  fid: { good: 100, poor: 300 },
  cls: { good: 0.1, poor: 0.25 },
  fcp: { good: 1800, poor: 3000 },
  ttfb: { good: 800, poor: 1800 }
} as const;

// Classe pour gérer les métriques de performance
class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private callbacks: Array<(metrics: PerformanceMetrics) => void> = [];

  constructor() {
    this.initializeMetrics();
  }

  private initializeMetrics() {
    // Collecter les Core Web Vitals
    getCLS(this.handleMetric.bind(this, 'cls'));
    getFID(this.handleMetric.bind(this, 'fid'));
    getFCP(this.handleMetric.bind(this, 'fcp'));
    getLCP(this.handleMetric.bind(this, 'lcp'));
    getTTFB(this.handleMetric.bind(this, 'ttfb'));

    // Ajouter les métadonnées
    this.metrics.timestamp = Date.now();
    this.metrics.url = window.location.href;
    this.metrics.userAgent = navigator.userAgent;
  }

  private handleMetric(name: keyof PerformanceMetrics, metric: Metric) {
    this.metrics[name] = metric.value;
    
    // Log en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${name.toUpperCase()}: ${metric.value}`, this.getMetricRating(name, metric.value));
    }

    // Vérifier si toutes les métriques sont collectées
    this.checkAndTriggerCallbacks();
  }

  private getMetricRating(name: keyof typeof PERFORMANCE_THRESHOLDS, value: number): string {
    const thresholds = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
    if (!thresholds) return '❓ Unknown';
    
    if (value <= thresholds.good) return '✅ Good';
    if (value <= thresholds.poor) return '🟡 Needs Improvement';
    return '❌ Poor';
  }

  private checkAndTriggerCallbacks() {
    // Vérifier si nous avons au moins LCP, FID et CLS (Core Web Vitals essentiels)
    if (this.metrics.lcp !== undefined && 
        this.metrics.fid !== undefined && 
        this.metrics.cls !== undefined) {
      
      const completeMetrics = this.metrics as PerformanceMetrics;
      this.callbacks.forEach(callback => callback(completeMetrics));
    }
  }

  // Ajouter un callback pour quand les métriques sont prêtes
  onMetricsReady(callback: (metrics: PerformanceMetrics) => void) {
    this.callbacks.push(callback);
  }

  // Obtenir les métriques actuelles
  getCurrentMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  // Calculer un score de performance global
  getPerformanceScore(): number {
    const { lcp, fid, cls, fcp, ttfb } = this.metrics;
    
    if (!lcp || !fid || !cls) return 0;

    let score = 0;
    let count = 0;

    // Score LCP (40% du total)
    if (lcp <= PERFORMANCE_THRESHOLDS.lcp.good) score += 40;
    else if (lcp <= PERFORMANCE_THRESHOLDS.lcp.poor) score += 20;
    count += 40;

    // Score FID (25% du total)
    if (fid <= PERFORMANCE_THRESHOLDS.fid.good) score += 25;
    else if (fid <= PERFORMANCE_THRESHOLDS.fid.poor) score += 12;
    count += 25;

    // Score CLS (25% du total)
    if (cls <= PERFORMANCE_THRESHOLDS.cls.good) score += 25;
    else if (cls <= PERFORMANCE_THRESHOLDS.cls.poor) score += 12;
    count += 25;

    // Score FCP (10% du total)
    if (fcp && fcp <= PERFORMANCE_THRESHOLDS.fcp.good) score += 10;
    else if (fcp && fcp <= PERFORMANCE_THRESHOLDS.fcp.poor) score += 5;
    count += 10;

    return Math.round((score / count) * 100);
  }

  // Envoyer les métriques à un service d'analytics (exemple)
  sendToAnalytics(endpoint?: string) {
    const metrics = this.getCurrentMetrics();
    const score = this.getPerformanceScore();

    const payload = {
      ...metrics,
      performanceScore: score,
      timestamp: Date.now()
    };

    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('Failed to send metrics:', err));
    }

    return payload;
  }
}

// Instance globale
export const performanceMonitor = new PerformanceMonitor();

// Hook React pour utiliser les métriques de performance
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = React.useState<Partial<PerformanceMetrics>>({});
  const [score, setScore] = React.useState<number>(0);

  React.useEffect(() => {
    // Écouter les mises à jour des métriques
    const interval = setInterval(() => {
      const currentMetrics = performanceMonitor.getCurrentMetrics();
      const currentScore = performanceMonitor.getPerformanceScore();
      
      setMetrics(currentMetrics);
      setScore(currentScore);
    }, 1000);

    // Callback pour quand toutes les métriques sont prêtes
    performanceMonitor.onMetricsReady((completeMetrics) => {
      setMetrics(completeMetrics);
      setScore(performanceMonitor.getPerformanceScore());
      clearInterval(interval);
    });

    return () => clearInterval(interval);
  }, []);

  return { metrics, score };
}

// Fonction pour mesurer les performances d'une fonction
export function measurePerformance<T>(
  name: string, 
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now();
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const end = performance.now();
      console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
    });
  } else {
    const end = performance.now();
    console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
  }
}

// Utilitaire pour logger les informations de performance du navigateur
export function logBrowserPerformance() {
  if (typeof window !== 'undefined' && window.performance) {
    const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    console.group('🚀 Performance Navigation');
    console.log('DNS Lookup:', perfData.domainLookupEnd - perfData.domainLookupStart, 'ms');
    console.log('TCP Connection:', perfData.connectEnd - perfData.connectStart, 'ms');
    console.log('Server Response:', perfData.responseStart - perfData.requestStart, 'ms');
    console.log('DOM Processing:', perfData.domContentLoadedEventEnd - perfData.responseEnd, 'ms');
    console.log('Total Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    console.groupEnd();
  }
}

// Export des constantes pour les tests
export { PERFORMANCE_THRESHOLDS };

// Import React pour le hook
import React from 'react'; 
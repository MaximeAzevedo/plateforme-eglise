import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Monitoring de performance en développement
if (import.meta.env.DEV) {
  import('./utils/performance.ts').then(({ performanceMonitor, logBrowserPerformance }) => {
    // Log initial des performances
    logBrowserPerformance();
    
    // Monitoring continu des Core Web Vitals
    performanceMonitor.onMetricsReady((metrics) => {
      console.log('📊 Core Web Vitals Ready:', {
        LCP: `${metrics.lcp}ms`,
        FID: `${metrics.fid}ms`, 
        CLS: metrics.cls,
        Score: `${performanceMonitor.getPerformanceScore()}/100`
      });
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

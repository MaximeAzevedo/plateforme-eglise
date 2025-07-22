import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les vendors en chunks
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react'],
          maps: ['react-leaflet', 'leaflet', 'react-leaflet-cluster'],
          supabase: ['@supabase/supabase-js'],
          // Séparer les pages admin
          admin: [
            './src/components/admin/AdminPage.tsx',
            './src/components/admin/ModerationDashboard.tsx',
            './src/components/admin/AdminAuth.tsx'
          ],
          // Séparer les modales communauté
          community: [
            './src/components/TestimonyGallery.tsx',
            './src/components/PrayerWall.tsx',
            './src/components/ContributionHub.tsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-leaflet',
      'leaflet',
      '@supabase/supabase-js'
    ]
  },
  server: {
    proxy: {
      // Proxy pour les requêtes Supabase si nécessaire
    }
  },
  define: {
    global: 'globalThis',
  }
});

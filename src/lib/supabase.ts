import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Logs pour debugging
console.log('🔧 Configuration Supabase:', {
  url: supabaseUrl ? '✅ Présente' : '❌ Manquante',
  key: supabaseAnonKey ? '✅ Présente' : '❌ Manquante',
  env: import.meta.env.MODE,
  // En dev, on peut voir les vraies valeurs pour debugging
  urlDebug: import.meta.env.DEV ? supabaseUrl : 'masqué',
  keyDebug: import.meta.env.DEV ? (supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'manquante') : 'masqué'
});

// Créer le client Supabase (même avec des valeurs manquantes pour éviter les crashes)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Export des variables pour debugging - plus permissif en développement
export const supabaseConfig = {
  url: supabaseUrl,
  key: supabaseAnonKey ? 'present' : 'missing',
  isConfigured: !!(supabaseUrl && supabaseAnonKey),
  // En développement, on accepte même une config partielle
  canAttemptConnection: import.meta.env.DEV ? !!(supabaseUrl || supabaseAnonKey) : !!(supabaseUrl && supabaseAnonKey)
}; 
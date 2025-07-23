import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Logs pour debugging
console.log('🔧 Configuration Supabase:', {
  url: supabaseUrl ? '✅ Présente' : '❌ Manquante',
  key: supabaseAnonKey ? '✅ Présente' : '❌ Manquante',
  env: import.meta.env.MODE
});

// Créer le client Supabase (même avec des valeurs manquantes pour éviter les crashes)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Export des variables pour debugging
export const supabaseConfig = {
  url: supabaseUrl,
  key: supabaseAnonKey ? 'present' : 'missing',
  isConfigured: !!(supabaseUrl && supabaseAnonKey)
}; 
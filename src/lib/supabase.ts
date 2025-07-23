import { createClient } from '@supabase/supabase-js';

// Validation des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes:', {
    url: supabaseUrl ? '✅ Présente' : '❌ Manquante',
    key: supabaseAnonKey ? '✅ Présente' : '❌ Manquante'
  });
  
  // En développement, afficher des informations utiles
  if (import.meta.env.DEV) {
    console.log('🔧 Pour corriger ce problème en local:');
    console.log('1. Créez un fichier .env à la racine du projet');
    console.log('2. Ajoutez vos variables Supabase:');
    console.log('   VITE_SUPABASE_URL=https://your-project.supabase.co');
    console.log('   VITE_SUPABASE_ANON_KEY=your-anon-key');
  } else {
    console.log('🔧 Pour corriger ce problème en production:');
    console.log('1. Configurez les variables d\'environnement sur Vercel');
    console.log('2. Redéployez l\'application');
  }
}

// Créer le client Supabase avec des valeurs par défaut si nécessaire
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
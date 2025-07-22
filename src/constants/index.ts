// Configuration de l'application
export const APP_CONFIG = {
  name: 'GOD × CONNECT',
  version: '1.0.0',
  description: 'Plateforme spirituelle communautaire',
  author: 'GOD × CONNECT Team'
} as const;

// URLs et endpoints
export const URLS = {
  heroBackground: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80',
  defaultChurchImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=300&q=80'
} as const;

// Configuration de la carte
export const MAP_CONFIG = {
  defaultCenter: [49.1193, 6.1757] as [number, number],
  defaultZoom: 12,
  clusterRadius: 40,
  popupMaxWidth: 300
} as const;

// Configuration du cache
export const CACHE_CONFIG = {
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  cleanupInterval: 10 * 60 * 1000, // 10 minutes
  maxSize: 100
} as const;

// Configuration des builds
export const BUILD_CONFIG = {
  chunkSizeLimit: 1000,
  target: 'esnext'
} as const;

// Délais et timeouts
export const TIMEOUTS = {
  testimonialRotation: 4000,
  notificationDisplay: 5000,
  apiTimeout: 10000,
  debounceSearch: 300
} as const;

// Limites et pagination
export const LIMITS = {
  testimonialsPerPage: 12,
  prayersPerPage: 10,
  searchResults: 50,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxCommentLength: 500,
  maxTitleLength: 100
} as const;

// Messages d'erreur standardisés
export const ERROR_MESSAGES = {
  network: 'Erreur de connexion. Veuillez vérifier votre connexion internet.',
  unauthorized: 'Accès non autorisé. Veuillez vous reconnecter.',
  notFound: 'Ressource non trouvée.',
  validation: 'Données invalides. Veuillez vérifier vos informations.',
  server: 'Erreur du serveur. Veuillez réessayer plus tard.',
  generic: 'Une erreur est survenue. Veuillez réessayer.'
} as const;

// Messages de succès
export const SUCCESS_MESSAGES = {
  save: 'Données sauvegardées avec succès !',
  delete: 'Élément supprimé avec succès !',
  update: 'Mise à jour effectuée avec succès !',
  send: 'Envoyé avec succès !',
  approve: 'Approuvé avec succès !',
  reject: 'Rejeté avec succès !'
} as const;

// Configuration des formulaires
export const FORM_CONFIG = {
  debounceTime: 300,
  maxRetries: 3,
  autoSaveInterval: 30000, // 30 secondes
  validationTimeout: 1000
} as const;

// Breakpoints responsive
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Animation durations
export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000
} as const;

// Données de test/démo
export const DEMO_DATA = {
  testimonyRotationInterval: 4000,
  statsUpdateInterval: 60000,
  mapRefreshInterval: 300000
} as const;

// Configuration de sécurité
export const SECURITY = {
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 heures
  adminPassword: 'god-connect-admin-2024' // À changer en production !
} as const;

// Export par défaut pour l'import simple
export default {
  APP_CONFIG,
  URLS,
  MAP_CONFIG,
  CACHE_CONFIG,
  BUILD_CONFIG,
  TIMEOUTS,
  LIMITS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FORM_CONFIG,
  BREAKPOINTS,
  ANIMATIONS,
  DEMO_DATA,
  SECURITY
}; 
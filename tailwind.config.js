/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ===== PALETTE CULTEO =====
      colors: {
        // Couleurs principales Culteo
        culteo: {
          'blanc-coquille': '#F9F9F9',
          'blanc-pur': '#FFFFFF',
          'vert-esperance': '#0A6847',
          'gris-basalte': '#3D3D3D',
          'jaune-lumiere': '#FFC107', // Ajouté car mentionné dans les specs
        },
        // Déclinaisons pour compatibilité avec les composants existants
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#0A6847',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        secondary: {
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#FFC107',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
        },
        // Gris pour les textes et backgrounds
        neutral: {
          50: '#F9F9F9',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#3D3D3D',
          900: '#1F2937',
        },
        // Classes utiles pour les composants (raccourcis directs)
        'culteo-blanc-coquille': '#F9F9F9',
        'culteo-blanc-pur': '#FFFFFF', 
        'culteo-vert-esperance': '#0A6847',
        'culteo-gris-basalte': '#3D3D3D',
        'culteo-jaune-lumiere': '#FFC107',
      },

      // ===== POLICES CULTEO =====
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        // Alias pour compatibilité
        heading: ['Poppins', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },

      // ===== OMBRES DOUCES CULTEO =====
      boxShadow: {
        'culteo-soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'culteo-medium': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'culteo-float': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },

      // ===== RAYONS DE BORDURE CULTEO =====
      borderRadius: {
        'culteo-sm': '8px',
        'culteo': '16px',
        'culteo-lg': '30px',
      },

      // ===== ANIMATIONS DOUCES =====
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
      },

      // ===== KEYFRAMES =====
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        },
        slideUp: {
          'from': { 
            opacity: '0', 
            transform: 'translateY(30px)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          }
        },
        scaleIn: {
          'from': { 
            opacity: '0', 
            transform: 'scale(0.95)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'scale(1)' 
          }
        }
      },

      // ===== SPACING CULTEO =====
      spacing: {
        'culteo': '1.5rem',
        'culteo-lg': '2rem',
        'culteo-xl': '3rem',
      },

      // ===== TAILLES DE TEXTE CULTEO =====
      fontSize: {
        'culteo-title': ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        'culteo-subtitle': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'culteo-body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
      },
    },
  },
  plugins: [
    // Plugin pour ajouter des utilitaires Culteo
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Classes de glassmorphism Culteo
        '.glass-culteo': {
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },

        // Texte avec couleur Culteo
        '.text-culteo-gradient': {
          background: 'linear-gradient(135deg, #0A6847 0%, #059669 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '600',
        },

        // Barres de scroll Culteo
        '.scrollbar-culteo': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#F9F9F9',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#0A6847',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#059669',
          },
        },
      }

      addUtilities(newUtilities)
    }
  ],
}
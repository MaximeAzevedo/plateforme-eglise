/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ===== PALETTE GOD x CONNECT =====
      colors: {
        // Couleurs principales divines
        divine: {
          DEFAULT: '#F59E0B',
          50: '#FFFDF2',
          100: '#FEF6DC',
          200: '#FDEAB8',
          300: '#FBBF24',
          400: '#F59E0B',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
          900: '#451A03',
        },
        spiritual: {
          DEFAULT: '#8B5CF6',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        hope: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        peace: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        light: {
          DEFAULT: '#F97316',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        love: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        // Gris sacrés avec noms explicites
        sacred: {
          white: '#FFFFFF',
          50: '#FAFBFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },

      // ===== DÉGRADÉS DIVINS =====
      backgroundImage: {
        'divine': 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
        'spiritual': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
        'peaceful': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        'holy': 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #F97316 100%)',
        'heaven': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        'dawn': 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
        'blessing': 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
        'worship': 'linear-gradient(135deg, #8B5CF6 0%, #EF4444 100%)',
        'glory': 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 25%, #F97316 50%, #EF4444 100%)',
        'divine-light': 'radial-gradient(circle at center, #FEF6DC 0%, #F59E0B 100%)',
        'spiritual-aura': 'radial-gradient(circle at center, #F5F3FF 0%, #8B5CF6 100%)',
      },

      // ===== TYPOGRAPHIE SACRÉE =====
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        divine: ['Playfair Display', 'serif'],
        sacred: ['Inter', 'system-ui', 'sans-serif'],
      },

      // ===== OMBRES DIVINES =====
      boxShadow: {
        'divine': '0 25px 50px -12px rgba(245, 158, 11, 0.25)',
        'spiritual': '0 25px 50px -12px rgba(139, 92, 246, 0.25)',
        'peaceful': '0 25px 50px -12px rgba(16, 185, 129, 0.25)',
        'hope': '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
        'love': '0 25px 50px -12px rgba(239, 68, 68, 0.25)',
        'holy': '0 25px 50px -12px rgba(245, 158, 11, 0.4), 0 0 40px rgba(139, 92, 246, 0.15)',
        'glow-divine': '0 0 20px rgba(245, 158, 11, 0.3), 0 0 40px rgba(245, 158, 11, 0.2)',
        'glow-spiritual': '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'large': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      },

      // ===== RAYONS DE BORDURE =====
      borderRadius: {
        'divine': '1.5rem',
        'spiritual': '2rem',
        'holy': '2.5rem',
      },

      // ===== ANIMATIONS SPIRITUELLES =====
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'pulse-divine': 'pulseDivine 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'blessing': 'blessing 3s ease-in-out infinite',
        'divine-pulse': 'divinePulse 2.5s ease-in-out infinite',
        'spiritual-flow': 'spiritualFlow 4s ease-in-out infinite',
      },

      // ===== KEYFRAMES DIVINES =====
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
        },
        pulseDivine: {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(245, 158, 11, 0.4)' 
          },
          '50%': { 
            boxShadow: '0 0 0 20px rgba(245, 158, 11, 0)' 
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)' },
          'to': { boxShadow: '0 0 30px rgba(245, 158, 11, 0.6)' }
        },
        bounceGentle: {
          '0%, 100%': { 
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': { 
            transform: 'translateY(-8px)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        heartbeat: {
          '0%, 100%': { 
            transform: 'scale(1)',
            filter: 'hue-rotate(0deg)'
          },
          '50%': { 
            transform: 'scale(1.05)',
            filter: 'hue-rotate(10deg)'
          }
        },
        blessing: {
          '0%, 100%': { 
            transform: 'scale(1) rotate(0deg)',
            opacity: '1'
          },
          '50%': { 
            transform: 'scale(1.02) rotate(1deg)',
            opacity: '0.95'
          }
        },
        divinePulse: {
          '0%, 100%': { 
            transform: 'scale(1)',
            background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)'
          },
          '50%': { 
            transform: 'scale(1.02)',
            background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)'
          }
        },
        spiritualFlow: {
          '0%': { 
            backgroundPosition: '0% 50%',
            transform: 'scale(1)'
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            transform: 'scale(1.01)'
          },
          '100%': { 
            backgroundPosition: '0% 50%',
            transform: 'scale(1)'
          }
        }
      },

      // ===== ESPACEMENT DIVIN =====
      spacing: {
        'divine': '1.5rem',
        'spiritual': '2rem',
        'holy': '3rem',
        'blessed': '4rem',
        'heavenly': '6rem',
      },

      // ===== TAILLES SACRÉES =====
      fontSize: {
        'divine': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'spiritual': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'blessed': ['1.5rem', { lineHeight: '1.4', fontWeight: '500' }],
        'sacred': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
      },

      // ===== TRANSITIONS DIVINES =====
      transitionDuration: {
        'divine': '300ms',
        'spiritual': '500ms',
        'holy': '700ms',
      },

      // ===== LARGEURS SACRÉES =====
      maxWidth: {
        'divine': '1400px',
        'spiritual': '1200px',
        'blessed': '800px',
      },

      // ===== Z-INDEX HIÉRARCHIE =====
      zIndex: {
        'ground': '0',
        'low': '10',
        'medium': '20',
        'high': '30',
        'divine': '40',
        'holy': '50',
        'heaven': '9999',
      },

      // ===== FLOU DIVIN =====
      backdropBlur: {
        'divine': '20px',
        'spiritual': '16px',
        'blessed': '12px',
      }
    },
  },
  plugins: [
    // Plugin pour ajouter des utilitaires personnalisés
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Classes de glassmorphism
        '.glass-divine': {
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(30, 41, 59, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
        },
        '.glass-spiritual': {
          background: 'rgba(139, 92, 246, 0.1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
        },

        // Texte avec dégradés
        '.text-divine-gradient': {
          background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '800',
        },
        '.text-spiritual-gradient': {
          background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '800',
        },
        '.text-peaceful-gradient': {
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '800',
        },

        // Barres de scroll divines
        '.scrollbar-divine': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme('colors.sacred.100'),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
          },
        },

        // Bordures avec dégradés
        '.border-divine-gradient': {
          border: '2px solid transparent',
          backgroundClip: 'padding-box',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
            zIndex: '-1',
            margin: '-2px',
            borderRadius: 'inherit',
            background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
          }
        }
      }

      addUtilities(newUtilities)
    }
  ],
}
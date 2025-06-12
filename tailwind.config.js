/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Palette de couleurs "Dune" - Vers Lui
      colors: {
        // Couleurs principales Dune
        primary: '#F8F8F4',      // Blanc Craie - Fond principal
        title: '#2C3E50',        // Bleu Ardoise - Titres
        text: '#34495E',         // Gris Anthracite - Paragraphes
        accent: '#D3A625',       // Or Doux - Boutons, liens, icônes
        
        // Tons sable
        sand: {
          light: '#F5F3EF',      // Sable très clair
          DEFAULT: '#ECE8E1',    // Sable clair
          medium: '#E3DDD4',     // Sable moyen
        },
        
        // Couleurs utilitaires
        border: '#E8E6E0',
        gray: {
          light: '#F7F7F7',
          DEFAULT: '#BDC3C7',
          dark: '#7F8C8D',
        },
        
        // États
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#3498DB',
      },
      
      // Typographie Vers Lui
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Lato', 'sans-serif'],
        'sans': ['Lato', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
      
      // Tailles de police harmonieuses
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'title': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'subtitle': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
        'heading': ['1.5rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'caption': ['0.875rem', { lineHeight: '1.5' }],
        'small': ['0.75rem', { lineHeight: '1.4' }],
      },
      
      // Ombres douces Dune
      boxShadow: {
        'soft': '0 2px 8px rgba(44, 62, 80, 0.08)',
        'medium': '0 4px 16px rgba(44, 62, 80, 0.12)',
        'strong': '0 8px 32px rgba(44, 62, 80, 0.16)',
        'elevated': '0 6px 20px rgba(44, 62, 80, 0.10)',
        'float': '0 10px 30px rgba(44, 62, 80, 0.15)',
      },
      
      // Animations douces
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      
      // Transitions personnalisées
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'soft': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      
      // Espacements harmonieux
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Border radius doux
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      
      // Gradients Dune
      backgroundImage: {
        'sand-gradient': 'linear-gradient(135deg, #F5F3EF, #ECE8E1)',
        'warm-gradient': 'linear-gradient(135deg, #F8F8F4, #F5F3EF)',
        'accent-gradient': 'linear-gradient(135deg, #D3A625, #E6B82A)',
        'accent-hover': 'linear-gradient(135deg, #B8941F, #D3A625)',
      },
    },
  },
  plugins: [],
}
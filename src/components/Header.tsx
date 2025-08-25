import React, { useState, useEffect } from 'react';
import { 
  Menu,
  X,
  Home,
  Map,
  Plus,
  Users,
  User,
  MapPin,
  Heart,
  Star,
  Info,
  Calendar
} from 'lucide-react';

interface HeaderProps {
  placesCount: number;
  onContributeClick: () => void;
  onTestimonyClick?: () => void;
  onPrayerWallClick?: () => void;
  supabase: any;
  currentView?: 'home' | 'map' | 'list' | 'celebrations';
  onViewChange?: (view: 'home' | 'map' | 'list' | 'celebrations') => void;
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  placesCount, 
  onContributeClick,
  onTestimonyClick,
  onPrayerWallClick,
  supabase,
  currentView = 'home',
  onViewChange,
  isMobile = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const menuItems = [
    {
      icon: Home,
      title: 'Accueil',
      description: 'Retour à l\'accueil',
      action: () => onViewChange?.('home'),
    },
    {
      icon: Map,
      title: 'Carte',
      description: 'Explorez les lieux de culte',
      action: () => onViewChange?.('map'),
    },
    {
      icon: Plus,
      title: 'Ajouter',
      description: 'Enrichissez la communauté',
      action: onContributeClick,
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Connectez-vous avec d\'autres',
      action: () => console.log('Communauté'),
    },
    {
      icon: User,
      title: 'Profil',
      description: 'Votre espace personnel',
      action: () => console.log('Profil'),
    },
    {
      icon: Heart,
      title: 'Témoignages',
      description: 'Histoires inspirantes de foi',
      action: onTestimonyClick,
    },
    {
      icon: Star,
      title: 'Mur de prières',
      description: 'Partagez vos intentions',
      action: onPrayerWallClick,
    },
    {
      icon: Info,
      title: 'À propos',
      description: 'Notre mission et équipe',
      action: () => console.log('À propos'),
    }
  ];

  return (
    <>
      {/* Header principal selon specs Culteo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-culteo-blanc-coquille">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Menu hamburger à gauche + Logo Culteo */}
            <div className="flex items-center space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors duration-200"
              >
                <Menu 
                  className="w-6 h-6 text-culteo-vert-esperance" 
                  strokeWidth={1.5}
                  style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                />
              </button>
              
              {/* Logo + Texte Culteo */}
              <div className="flex items-center space-x-2">
                {/* Essayer plusieurs chemins pour le logo */}
                <img 
                  src="/logo-culteo.png"
                  alt="Culteo" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    console.warn('❌ Logo Culteo non trouvé via /logo-culteo.png');
                    // Essayer un chemin alternatif
                    const img = e.target as HTMLImageElement;
                    if (img.src !== window.location.origin + '/public/logo-culteo.png') {
                      img.src = '/public/logo-culteo.png';
                    } else {
                      // Si ça ne marche toujours pas, utiliser un icône de fallback
                      img.style.display = 'none';
                      // Ajouter un emoji/icône de fallback
                      const parent = img.parentElement;
                      if (parent && !parent.querySelector('.logo-fallback')) {
                        const fallback = document.createElement('div');
                        fallback.className = 'logo-fallback w-8 h-8 bg-culteo-vert-esperance rounded-lg flex items-center justify-center text-white font-bold';
                        fallback.textContent = 'C';
                        parent.insertBefore(fallback, img);
                      }
                    }
                  }}
                  onLoad={() => {
                    console.log('✅ Logo Culteo chargé avec succès');
                  }}
                />
                <span className="font-poppins font-bold text-culteo-gris-basalte text-lg">
                  Culteo
                </span>
              </div>
            </div>

            {/* Espace pour équilibrer la disposition */}
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* Menu overlay selon style Culteo */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop subtil */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          
          {/* Menu panel épuré */}
          <div 
            className="absolute top-20 left-6 w-80 bg-culteo-blanc-pur rounded-culteo shadow-culteo-float border border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du menu */}
            <div className="p-6 bg-culteo-blanc-coquille border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-poppins font-semibold text-culteo-gris-basalte">Navigation</h2>
                  <p className="text-sm font-lato text-culteo-gris-basalte/70">Explorez Culteo</p>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors duration-200"
                >
                  <X 
                    className="w-5 h-5 text-culteo-gris-basalte" 
                    strokeWidth={1.5}
                    style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                  />
                </button>
              </div>
            </div>

            {/* Items du menu */}
            <div className="p-2 max-h-96 overflow-y-auto scrollbar-culteo">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    setIsMenuOpen(false);
                  }}
                  className="w-full p-4 rounded-culteo-sm hover:bg-culteo-blanc-coquille transition-colors duration-200 text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-culteo-sm bg-culteo-blanc-coquille flex items-center justify-center group-hover:bg-white transition-colors duration-200">
                      <item.icon 
                        className="w-5 h-5 text-culteo-vert-esperance" 
                        strokeWidth={1.5}
                        style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-poppins font-semibold text-culteo-gris-basalte group-hover:text-culteo-vert-esperance transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm font-lato text-culteo-gris-basalte/70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer du menu */}
            <div className="p-4 bg-culteo-blanc-coquille border-t border-gray-100 text-center">
              <p className="text-xs font-lato text-culteo-gris-basalte/50">
                {placesCount} lieux de culte • Culteo v1.0
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
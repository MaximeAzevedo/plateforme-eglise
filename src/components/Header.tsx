import React, { useState, useEffect } from 'react';
import { 
  MapPin,
  Heart,
  Star,
  Crown,
  Menu,
  X,
  Plus,
  Shield,
  ChevronDown
} from 'lucide-react';
import TestimonyGallery from './TestimonyGallery';
import PrayerWall from './PrayerWall';

interface HeaderProps {
  placesCount: number;
  onContributeClick: () => void;
  onTestimonyClick?: () => void;
  onPrayerWallClick?: () => void;
  supabase: any;
}

const Header: React.FC<HeaderProps> = ({ 
  placesCount, 
  onContributeClick,
  onTestimonyClick,
  onPrayerWallClick,
  supabase
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTestimonyGallery, setShowTestimonyGallery] = useState(false);
  const [showPrayerWall, setShowPrayerWall] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      // Empêcher le scroll du body quand le menu est ouvert
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleTestimonyClick = () => {
    setShowTestimonyGallery(true);
    onTestimonyClick?.();
  };

  const handlePrayerWallClick = () => {
    setShowPrayerWall(true);
    onPrayerWallClick?.();
  };

  const scrollToSearch = () => {
    const searchSection = document.getElementById('search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuItems = [
    {
      icon: MapPin,
      label: 'Trouver ma communauté',
      action: scrollToSearch,
      description: 'Découvrez les lieux de culte près de vous',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Star,
      label: 'Témoignages',
      action: handleTestimonyClick,
      description: 'Partagez et lisez des témoignages inspirants',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Heart,
      label: 'Mur de prières',
      action: handlePrayerWallClick,
      description: 'Demandes de prières et intercession',
      color: 'from-red-500 to-rose-600'
    },
    {
      icon: Shield,
      label: 'Administration',
      action: () => window.location.href = '#admin',
      description: 'Gestion et modération',
      color: 'from-gray-500 to-gray-600'
    }
  ];

  return (
    <>
      {/* Header flottant optimisé mobile */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/98 backdrop-blur-xl border-b border-gray-200/70 shadow-xl' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo optimisé mobile */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse-divine">
                <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <h1 className={`text-lg sm:text-xl font-bold transition-colors ${
                  isScrolled 
                    ? 'text-gray-900' 
                    : 'text-white drop-shadow-lg'
                }`}>
                  <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                    GOD
                  </span>
                  <span className={isScrolled ? 'text-gray-400' : 'text-white/80'}> × </span>
                  <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                    CONNECT
                  </span>
                </h1>
                {/* Compteur de lieux pour mobile */}
                <div className={`text-xs sm:hidden ${isScrolled ? 'text-gray-500' : 'text-white/70'}`}>
                  {placesCount.toLocaleString()} lieux
                </div>
              </div>
            </div>

            {/* Navigation desktop inchangée */}
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={scrollToSearch}
                className={`font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>Trouver ma communauté</span>
              </button>

              <button
                onClick={handleTestimonyClick}
                className={`font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                <Star className="h-4 w-4" />
                <span>Témoignages</span>
              </button>

              <button
                onClick={handlePrayerWallClick}
                className={`font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                <Heart className="h-4 w-4" />
                <span>Mur de prières</span>
              </button>

              <a
                href="#admin"
                className={`font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </a>

              <button
                onClick={onContributeClick}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span>Contribuer</span>
              </button>
            </nav>

            {/* Boutons mobile optimisés */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Bouton Contribuer mobile */}
              <button
                onClick={onContributeClick}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <Plus className="h-5 w-5" />
              </button>

              {/* Bouton menu mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay pour le menu mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Menu mobile moderne en bottom sheet */}
      <div className={`mobile-menu-container fixed bottom-0 left-0 right-0 z-50 md:hidden transition-all duration-500 transform ${
        isMobileMenuOpen 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-full opacity-0 pointer-events-none'
      }`}>
        <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-200">
          {/* Handle pour indiquer qu'on peut swiper */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Header du menu */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Navigation</h3>
                <p className="text-sm text-gray-500">Explorez GOD × CONNECT</p>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Navigation items */}
          <div className="px-4 py-4 space-y-2 max-h-96 overflow-y-auto">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 flex items-center space-x-4 group active:scale-98"
                style={{ minHeight: '72px' }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900 text-base">{item.label}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{item.description}</div>
                </div>
                <ChevronDown className="h-5 w-5 text-gray-400 transform -rotate-90" />
              </button>
            ))}
          </div>

          {/* Footer du menu avec stats */}
          <div className="px-6 py-4 bg-gray-50 rounded-t-2xl border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-600">
                <span className="font-semibold text-amber-600">{placesCount.toLocaleString()}</span> lieux de culte
              </div>
              <div className="text-gray-500">
                v1.0 • Made with ❤️ for God
              </div>
            </div>
          </div>

          {/* Safe area pour iPhone avec encoche */}
          <div className="h-safe-area-inset-bottom bg-gray-50"></div>
        </div>
      </div>

      {/* Modales inchangées */}
      {showTestimonyGallery && (
        <TestimonyGallery 
          isOpen={showTestimonyGallery}
          onClose={() => setShowTestimonyGallery(false)}
          supabase={supabase}
        />
      )}
      
      {showPrayerWall && (
        <PrayerWall 
          isOpen={showPrayerWall}
          onClose={() => setShowPrayerWall(false)}
          supabase={supabase}
        />
      )}
    </>
  );
};

export default Header;
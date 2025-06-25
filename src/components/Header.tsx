import React, { useState, useEffect } from 'react';
import { 
  MapPin,
  Heart,
  Star,
  Crown,
  Menu,
  X,
  Plus
} from 'lucide-react';
import TestimonyGallery from './TestimonyGallery';
import PrayerWall from './PrayerWall';

interface HeaderProps {
  placesCount: number;
  onContributeClick: () => void;
  onTestimonyClick?: () => void;
  onPrayerWallClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  placesCount, 
  onContributeClick,
  onTestimonyClick,
  onPrayerWallClick
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

  return (
    <>
      {/* Header flottant */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold transition-colors ${
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
              </div>
            </div>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={scrollToSearch}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>Trouver ma communauté</span>
              </button>

              <button
                onClick={handleTestimonyClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-amber-600 hover:bg-gray-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                <Star className="h-4 w-4" />
                <span>Témoignages</span>
              </button>

              <button
                onClick={handlePrayerWallClick}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
              >
                <Heart className="h-4 w-4" />
                <span>Mur de Prière</span>
              </button>

              <button
                onClick={onContributeClick}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span>Contribuer</span>
              </button>
            </nav>

            {/* Bouton menu mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Menu mobile */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    scrollToSearch();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isScrolled
                      ? 'text-gray-700 hover:bg-gray-50'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  <span>Trouver ma communauté</span>
                </button>

                <button
                  onClick={() => {
                    handleTestimonyClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isScrolled
                      ? 'text-gray-700 hover:bg-gray-50'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <Star className="h-4 w-4" />
                  <span>Témoignages</span>
                </button>

                <button
                  onClick={() => {
                    handlePrayerWallClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isScrolled
                      ? 'text-gray-700 hover:bg-gray-50'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  <span>Mur de Prière</span>
                </button>

                <button
                  onClick={() => {
                    onContributeClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                >
                  <Plus className="h-4 w-4" />
                  <span>Contribuer</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modales */}
      {showTestimonyGallery && (
        <TestimonyGallery 
          isOpen={showTestimonyGallery}
          onClose={() => setShowTestimonyGallery(false)} 
        />
      )}
      
      {showPrayerWall && (
        <PrayerWall 
          isOpen={showPrayerWall}
          onClose={() => setShowPrayerWall(false)} 
        />
      )}
    </>
  );
};

export default Header;
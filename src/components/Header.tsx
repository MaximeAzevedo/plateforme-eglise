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
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import TestimonyGallery from './TestimonyGallery';
import PrayerWall from './PrayerWall';

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Gérer le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const menuItems = [
    { 
      name: 'Témoignages', 
      icon: Heart, 
      action: () => setShowTestimonyGallery(true),
      description: 'Découvrez des histoires inspirantes'
    },
    { 
      name: 'Mur de prières', 
      icon: Star, 
      action: () => setShowPrayerWall(true),
      description: 'Partagez vos intentions de prière'
    },
    { 
      name: 'Ajouter un lieu', 
      icon: Plus, 
      action: onContributeClick,
      description: 'Enrichissez notre communauté'
    },
    { 
      name: 'Administration', 
      icon: Shield, 
      action: () => window.location.hash = '#admin',
      description: 'Gestion et modération'
    }
  ];

  // Titre dynamique selon la vue sur mobile
  const getViewTitle = () => {
    switch (currentView) {
      case 'map': return 'Carte interactive';
      case 'celebrations': return 'Prières';
      case 'list': return 'Liste des lieux';
      default: return 'GOD × CONNECT';
    }
  };

  return (
    <>
      <header 
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
          ${isScrolled || isMobileMenuOpen ? 'bg-white shadow-xl border-b border-gray-100' : 'bg-white/95 backdrop-blur-md'}
          ${isMobile && currentView === 'map' ? 'bg-white/95 backdrop-blur-md shadow-lg' : ''}
        `}
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            
            {/* Logo et navigation gauche */}
            <div className="flex items-center space-x-3">
              {/* Bouton retour sur mobile dans la vue carte */}
              {isMobile && currentView === 'map' && onViewChange && (
                <button
                  onClick={() => onViewChange('home')}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-700" />
                </button>
              )}

              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {isMobile ? getViewTitle() : 'GOD × CONNECT'}
                  </h1>
                  {!isMobile && (
                    <p className="text-xs text-gray-500 leading-tight">
                      <span className="font-semibold text-amber-600">{placesCount}</span> lieux
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation desktop */}
            {!isMobile && (
              <nav className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => setShowTestimonyGallery(true)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-amber-600 transition-colors font-medium"
                >
                  <Heart className="w-4 h-4" />
                  <span>Témoignages</span>
                </button>
                <button
                  onClick={() => setShowPrayerWall(true)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-amber-600 transition-colors font-medium"
                >
                  <Star className="w-4 h-4" />
                  <span>Prières</span>
                </button>
                <button
                  onClick={onContributeClick}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Contribuer
                </button>
              </nav>
            )}

            {/* Navigation mobile */}
            {isMobile && (
              <div className="flex items-center space-x-2">
                {/* Compteur de lieux sur mobile dans la vue carte */}
                {currentView === 'map' && (
                  <div className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-xs font-medium">
                    {placesCount} lieux
                  </div>
                )}
                
                {/* Menu burger */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5 text-gray-700" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Menu mobile overlay */}
        {isMobile && isMobileMenuOpen && (
          <>
            {/* Overlay sombre */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Bottom sheet moderne */}
            <div className="mobile-menu-container fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-out">
              <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-200 max-h-[80vh] overflow-y-auto">
                {/* Poignée de drag */}
                <div className="flex justify-center pt-4 pb-2">
                  <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                </div>

                {/* Header du menu */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Navigation</h3>
                      <p className="text-gray-600 text-sm">Explorez GOD × CONNECT</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Crown className="w-4 h-4 text-amber-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation items */}
                <div className="px-6 py-4 space-y-3">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item.action();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
                      style={{ 
                        minHeight: '64px',
                        minWidth: '64px'
                      }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-900 text-lg">{item.name}</p>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400 transform -rotate-90" />
                    </button>
                  ))}
                </div>

                {/* Footer du menu */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl">
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
          </>
        )}
      </header>

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
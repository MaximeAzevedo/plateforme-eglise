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
  Users,
  Info,
  Settings,
  Map,
  MessageSquare,
  Sparkles
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Empêche le scroll de la page
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
      icon: Map,
      title: 'Carte interactive',
      description: 'Explorez les lieux de culte',
      action: () => onViewChange?.('map'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Heart,
      title: 'Témoignages',
      description: 'Histoires inspirantes de foi',
      action: onTestimonyClick,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Star,
      title: 'Mur de prières',
      description: 'Partagez vos intentions',
      action: onPrayerWallClick,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Plus,
      title: 'Contribuer',
      description: 'Enrichissez la communauté',
      action: onContributeClick,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Connectez-vous avec d\'autres',
      action: () => console.log('Communauté'),
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      icon: Info,
      title: 'À propos',
      description: 'Notre mission et équipe',
      action: () => console.log('À propos'),
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <>
      {/* Header principal */}
      <header className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white/90 backdrop-blur-sm'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo et titre */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GOD × CONNECT</h1>
                <p className="text-xs text-gray-500">{placesCount} lieux de culte</p>
              </div>
            </div>

            {/* Menu burger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className={`
                p-3 rounded-xl transition-all duration-200 hover:scale-105
                ${isMenuOpen 
                  ? 'bg-amber-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menu overlay moderne */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop avec blur */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          
          {/* Menu panel */}
          <div 
            className="absolute top-20 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du menu */}
            <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Navigation</h2>
                  <p className="text-sm text-gray-600">Explorez GOD × CONNECT</p>
                </div>
              </div>
            </div>

            {/* Items du menu */}
            <div className="p-2 max-h-96 overflow-y-auto">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    setIsMenuOpen(false);
                  }}
                  className="w-full p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer du menu */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-500">v1.0 • Made with ❤️ for God</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modales existantes */}
      {/* TestimonyGallery and PrayerWall are now managed by App.tsx */}
    </>
  );
};

export default Header;
import React from 'react';
import { Church, Plus, BarChart3, Users, MapPin } from 'lucide-react';

interface HeaderProps {
  placesCount: number;
  onContributeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ placesCount, onContributeClick }) => {
  return (
    <header className="header-vers-lui sticky top-0 z-50 bg-white border-b border-border shadow-soft">
      <div className="container-dune">
        <div className="flex items-center justify-between py-4">
          {/* Logo et Identité Mon Église */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* Icône avec style doré */}
              <div className="p-2 bg-accent-gradient rounded-xl shadow-soft">
                <Church className="h-6 w-6 text-white" />
              </div>
              
              {/* Nom et slogan */}
              <div className="flex flex-col">
                <h1 className="logo-vers-lui font-heading text-2xl font-bold text-title leading-none">
                  Mon Église
                </h1>
                <p className="slogan-vers-lui font-body text-sm text-title opacity-90 italic">
                  Le lieu de votre rencontre.
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques en temps réel */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-text">
              <div className="p-1.5 bg-sand-light rounded-lg">
                <MapPin className="h-4 w-4 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-text opacity-75">Lieux référencés</span>
                <span className="text-lg font-bold text-title font-heading">{placesCount}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-text">
              <div className="p-1.5 bg-sand-light rounded-lg">
                <Users className="h-4 w-4 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-text opacity-75">Communauté</span>
                <span className="text-lg font-bold text-title font-heading">2.4k+</span>
              </div>
            </div>
          </div>

          {/* Bouton d'action principal */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onContributeClick}
              className="btn-dune-primary flex items-center space-x-2 px-4 py-2 text-white font-medium text-sm rounded-lg transition-all duration-300 transform hover:scale-105 shadow-soft hover:shadow-medium"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Référencer</span>
              <span className="sm:hidden">+</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
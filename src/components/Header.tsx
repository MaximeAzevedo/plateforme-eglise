import React, { useState } from 'react';
import { Cross, PlusCircle, Sparkles } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import ContributeForm from './ContributeForm';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Header: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <header className="header-gradient backdrop-blur-xl border-b border-white/20 shadow-elevated sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 animate-fade-in">
              {/* Logo avec effet glow */}
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-cyber-500 to-electric-500 rounded-2xl shadow-glow rotate-3 hover:rotate-6 transition-transform duration-300">
                  <Cross className="text-white" size={32} />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles size={16} className="text-neon-400 animate-pulse" />
                </div>
              </div>
              
              {/* Titre et sous-titre modernisés */}
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-cyber-600 via-electric-500 to-cyber-600 bg-clip-text text-transparent tracking-tight">
                  Lieux de Culte
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-dark-500 font-medium">
                    Découvrez les églises près de chez vous
                  </p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-mint-100 to-electric-100 text-mint-700 border border-mint-200">
                    ✨ Nouvelle expérience
                  </span>
                </div>
              </div>
            </div>
            
            {/* Bouton CTA modernisé */}
            <button
              onClick={() => setIsFormOpen(true)}
              className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyber-500 to-electric-500 text-white rounded-2xl hover:from-cyber-600 hover:to-electric-600 transition-all duration-300 shadow-glow hover:shadow-glow-lg transform hover:scale-105 active:scale-95 font-semibold text-lg"
            >
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              
              {/* Icône avec animation */}
              <PlusCircle size={24} className="transition-transform duration-300 group-hover:rotate-90" />
              
              {/* Texte */}
              <span className="relative z-10">Ajouter un lieu</span>
              
              {/* Badge "Nouveau" */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-neon-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
            </button>
          </div>
          
          {/* Barre de progression ou indicateur de statut */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-dark-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-mint-500 rounded-full animate-pulse"></div>
                <span>Base de données mise à jour</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <span>🗺️</span>
                <span>Couverture nationale</span>
              </div>
            </div>
            
            {/* Statistiques en temps réel */}
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <div className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                <span className="text-dark-600">🏛️ </span>
                <span className="font-semibold text-cyber-600">1,500+</span>
                <span className="text-dark-500 ml-1">lieux référencés</span>
              </div>
              <div className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                <span className="text-dark-600">👥 </span>
                <span className="font-semibold text-electric-600">50+</span>
                <span className="text-dark-500 ml-1">contributeurs</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <ContributeForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        supabase={supabase}
      />
    </>
  );
};

export default Header;
import React from 'react';
import { MapPin, Search, Heart, Star, ChevronDown } from 'lucide-react';

const Hero = () => {
  const scrollToSearch = () => {
    const searchSection = document.getElementById('search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Background avec parallax mobile-optimisé */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-indigo-900/90"></div>
      
      {/* Particules animées légères pour mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-yellow-300/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Contenu principal mobile-first */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge d'introduction mobile */}
        <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white/90 text-sm sm:text-base font-medium mb-6 sm:mb-8 animate-fade-in">
          <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-300" />
          <span>Trouvez votre communauté spirituelle</span>
        </div>

        {/* Titre principal optimisé mobile */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight animate-slide-up">
          <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent">
            GOD
          </span>
          <span className="text-white/80 mx-2 sm:mx-4">×</span>
          <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
            CONNECT
          </span>
        </h1>

        {/* Sous-titre mobile-friendly */}
        <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Découvrez les lieux de culte près de chez vous et connectez-vous avec une{' '}
          <span className="text-white font-semibold">communauté qui partage votre foi</span>
        </p>

        {/* Statistiques mobile-optimisées */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 md:gap-12 mb-10 sm:mb-12 animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center space-x-3 text-white/90">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">1500+</div>
              <div className="text-xs sm:text-sm text-white/70">Lieux de culte</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-white/90">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">500+</div>
              <div className="text-xs sm:text-sm text-white/70">Prières partagées</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-white/90">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">200+</div>
              <div className="text-xs sm:text-sm text-white/70">Témoignages</div>
            </div>
          </div>
        </div>

        {/* Bouton d'action principal mobile-optimisé */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16 animate-bounce-gentle" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={scrollToSearch}
            className="group w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl shadow-2xl hover:shadow-divine transition-all duration-300 flex items-center justify-center gap-4 hover:scale-105 active:scale-95 border border-white/20"
            style={{ minHeight: '64px', minWidth: '280px' }}
          >
            <Search className="h-6 w-6 sm:h-7 sm:w-7 group-hover:scale-110 transition-transform" />
            <span>Commencer ma recherche</span>
          </button>
        </div>

        {/* Indicateur de scroll mobile */}
        <div className="animate-bounce" style={{ animationDelay: '1s' }}>
          <button
            onClick={scrollToSearch}
            className="group flex flex-col items-center text-white/60 hover:text-white/90 transition-colors duration-300"
          >
            <span className="text-sm sm:text-base mb-2 font-medium">Découvrir</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white/30 rounded-full flex items-center justify-center group-hover:border-white/60 transition-colors">
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Gradient overlay mobile */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
    </section>
  );
};

export default Hero; 
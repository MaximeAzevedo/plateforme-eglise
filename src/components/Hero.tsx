import React from 'react';
import {
  ArrowRight,
  MapPin,
  Heart,
  Star,
  Users,
  Search,
  Globe,
  Sparkles
} from 'lucide-react';

interface HeroProps {
  onExploreClick?: () => void;
  onTestimonyClick?: () => void;
  onPrayerClick?: () => void;
  onMapClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onTestimonyClick,
  onPrayerClick,
  onMapClick
}) => {
  const features = [
    {
      icon: MapPin,
      title: 'Carte interactive',
      description: 'Découvrez des lieux de culte près de chez vous avec notre carte interactive.',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      action: onMapClick,
      stats: '40+ lieux'
    },
    {
      icon: Heart,
      title: 'Témoignages',
      description: 'Lisez et partagez des histoires inspirantes de foi et de transformation.',
      gradient: 'from-red-500 to-pink-600',
      bgGradient: 'from-red-50 to-pink-100',
      action: onTestimonyClick,
      stats: 'Histoires vraies'
    },
    {
      icon: Star,
      title: 'Mur de prières',
      description: 'Rejoignez une communauté bienveillante pour partager vos intentions.',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      action: onPrayerClick,
      stats: 'Communauté active'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-amber-50">
      {/* Particles animées en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative pt-24 pb-12 sm:pt-32 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero principal */}
          <div className="text-center mb-16">
            {/* Badge d'introduction */}
            <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-sm border border-amber-200 rounded-full px-4 py-2 mb-8 shadow-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Communauté vibrante</span>
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Trouvez votre
              <span className="block bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                communauté spirituelle
              </span>
            </h1>

            {/* Sous-titre */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Rejoignez des milliers de personnes qui ont trouvé leur communauté grâce à
              <span className="font-semibold text-amber-600"> GOD × CONNECT</span>
            </p>

            {/* CTA principal */}
            <button
              onClick={onExploreClick}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <Search className="w-6 h-6" />
              <span>Commencer ma recherche</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Cards des fonctionnalités principales */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={feature.action}
              >
                <div className={`
                  relative bg-gradient-to-br ${feature.bgGradient} rounded-3xl p-8
                  border border-white/50 shadow-lg hover:shadow-2xl
                  transition-all duration-500 hover:scale-105 hover:-translate-y-2
                  backdrop-blur-sm
                `}>
                  {/* Icône avec gradient */}
                  <div className={`
                    w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl
                    flex items-center justify-center mb-6 shadow-lg
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Contenu */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {feature.title}
                      </h3>
                      <span className="text-sm font-medium text-gray-500 bg-white/50 px-3 py-1 rounded-full">
                        {feature.stats}
                      </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Flèche d'action */}
                    <div className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors">
                      <span className="text-sm font-medium mr-2">Explorer</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Effet de brillance au hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Section statistiques */}
          <div className="text-center hidden md:block">
            <div className="inline-flex items-center justify-center space-x-8 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl px-8 py-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">40+</div>
                <div className="text-sm text-gray-600">Lieux de culte</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">1K+</div>
                <div className="text-sm text-gray-600">Membres actifs</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-600">Témoignages</div>
              </div>
            </div>
          </div>

          {/* Indicateur de scroll */}
          <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center space-y-2 text-gray-400">
              <span className="text-sm font-medium">Découvrir</span>
              <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-300 rounded-full mt-2 animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dégradé de transition vers le contenu suivant */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero; 
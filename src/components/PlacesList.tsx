import React, { useState } from 'react';
import { WorshipPlace, Denomination } from '../types';
import { MapPin, Clock, Phone, Globe, Church, ExternalLink, Users, Star, Navigation, Calendar, Sparkles } from 'lucide-react';

interface PlacesListProps {
  places: WorshipPlace[];
}

const denominationLabels: Record<Denomination, string> = {
  'Catholic': '⛪ Église Catholique',
  'Protestant': '✝️ Église Protestante',
  'Orthodox': '☦️ Église Orthodoxe',
  'Evangelical': '🕊️ Église Évangélique',
  'Neo-Apostolic': '🔔 Église Néo apostolique',
  'Pentecostal': '🔥 Église Pentecôtiste',
  'Baptist': '💧 Église Baptiste',
  'Other': '🏛️ Autre Confession'
};

const denominationColors: Record<Denomination, string> = {
  'Catholic': 'from-cyber-100 to-electric-100 text-cyber-700 border-cyber-200',
  'Protestant': 'from-mint-100 to-electric-100 text-mint-700 border-mint-200',
  'Orthodox': 'from-cyber-100 to-neon-100 text-cyber-700 border-cyber-200',
  'Evangelical': 'from-neon-100 to-electric-100 text-neon-700 border-neon-200',
  'Neo-Apostolic': 'from-hot-100 to-neon-100 text-hot-700 border-hot-200',
  'Pentecostal': 'from-cyber-100 to-hot-100 text-cyber-700 border-cyber-200',
  'Baptist': 'from-electric-100 to-mint-100 text-electric-700 border-electric-200',
  'Other': 'from-gray-100 to-gray-200 text-gray-700 border-gray-300'
};

const denominationEmojis: Record<Denomination, string> = {
  'Catholic': '⛪',
  'Protestant': '✝️',
  'Orthodox': '☦️',
  'Evangelical': '🕊️',
  'Neo-Apostolic': '🔔',
  'Pentecostal': '🔥',
  'Baptist': '💧',
  'Other': '🏛️'
};

const PlacesList: React.FC<PlacesListProps> = ({ places }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getRandomTip = () => {
    const tips = [
      "💡 Saviez-vous que vous pouvez cliquer sur une église pour la voir sur la carte ?",
      "🎯 Utilisez les filtres pour trouver exactement ce que vous cherchez !",
      "📍 Activez la géolocalisation pour voir les lieux les plus proches de vous.",
      "⭐ Chaque confession a sa propre couleur et emoji pour vous aider à les distinguer.",
      "🌐 Cliquez sur les liens des sites web pour en savoir plus sur chaque lieu."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  return (
    <div className="space-y-8">
      {/* Header moderne avec statistiques */}
      <div className="card-premium animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-cyber-500 to-electric-500 rounded-2xl shadow-glow">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyber-600 to-electric-600 bg-clip-text text-transparent">
                {places.length} {places.length === 1 ? 'Lieu découvert' : 'Lieux découverts'} 🎉
              </h2>
              <p className="text-dark-600 font-medium mt-1">
                Explorez les lieux de culte autour de vous
              </p>
            </div>
          </div>
          
          {/* Tip éducatif */}
          <div className="bg-gradient-to-r from-neon-50 to-electric-50 border border-neon-200 rounded-2xl p-4 max-w-md">
            <p className="text-sm text-neon-800 font-medium">
              {getRandomTip()}
            </p>
          </div>
        </div>
      </div>

      {/* Grille des cartes */}
      {places.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 stagger-animation">
          {places.map((place, index) => (
            <div 
              key={place.id}
              style={{ animationDelay: `${index * 0.05}s` }}
              className="group relative cursor-pointer transition-all duration-300 hover:-translate-y-1"
              onMouseEnter={() => setHoveredCard(place.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card principale compacte */}
              <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300">
                
                {/* Badge flottant compact */}
                <div className="absolute -top-1 -right-1 z-20">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyber-500 to-electric-500 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">{denominationEmojis[place.denomination]}</span>
                  </div>
                </div>

                {/* Header compact */}
                <div className="p-3 bg-gradient-to-r from-gray-50/80 to-white border-b border-gray-100">
                  <div className="flex items-start gap-2">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-500 to-electric-500 flex items-center justify-center shadow-sm">
                      <Church className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1 truncate">
                        {place.name}
                      </h3>
                      <div className={`inline-flex items-center text-xs px-2 py-1 rounded-lg font-medium bg-gradient-to-r ${denominationColors[place.denomination]}`}>
                        {denominationLabels[place.denomination]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenu compact */}
                <div className="p-3 space-y-2">
                  {/* Informations essentielles */}
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <div className="shrink-0 w-5 h-5 bg-cyber-100 rounded-md flex items-center justify-center mt-0.5">
                        <MapPin className="w-3 h-3 text-cyber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 font-medium leading-tight">
                          {place.address}
                        </p>
                        <p className="text-xs text-gray-500">
                          {place.postalCode} {place.city}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="shrink-0 w-5 h-5 bg-electric-100 rounded-md flex items-center justify-center mt-0.5">
                        <Clock className="w-3 h-3 text-electric-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 font-medium truncate">
                          {place.serviceTimes}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <div className="shrink-0 w-5 h-5 bg-mint-100 rounded-md flex items-center justify-center mt-0.5">
                        <Phone className="w-3 h-3 text-mint-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 font-medium truncate">
                          {place.contactInfo}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions compactes */}
                  <div className="pt-2 border-t border-gray-100 space-y-1.5">
                    {place.website && (
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-cyber-50 hover:bg-cyber-100 rounded-lg transition-colors duration-200 group/link"
                      >
                        <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center shadow-sm">
                          <Globe className="w-3 h-3 text-cyber-600" />
                        </div>
                        <span className="text-xs text-cyber-700 font-medium flex-1">Site web</span>
                        <ExternalLink className="w-3 h-3 text-cyber-500 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </a>
                    )}
                    
                    <button className="w-full flex items-center gap-2 p-2 bg-electric-50 hover:bg-electric-100 rounded-lg transition-colors duration-200 group/btn">
                      <div className="w-5 h-5 bg-white rounded-md flex items-center justify-center shadow-sm">
                        <Navigation className="w-3 h-3 text-electric-600" />
                      </div>
                      <span className="text-xs text-electric-700 font-medium flex-1">Voir sur la carte</span>
                      <Star className="w-3 h-3 text-electric-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>

                {/* Effet de bordure subtil sur hover */}
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-cyber-200/50 transition-colors duration-300 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* État vide modernisé */
        <div className="card-premium text-center py-16 animate-fade-in">
          <div className="space-y-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Church className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-neon-400 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-lg">🔍</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-dark-800">
                Aucun lieu trouvé 🤔
              </h3>
              <p className="text-dark-600 max-w-md mx-auto leading-relaxed">
                Pas de panique ! Essayez de modifier vos critères de recherche ou découvrez comment ajouter un nouveau lieu.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button className="px-6 py-3 bg-gradient-to-r from-cyber-500 to-electric-500 text-white rounded-2xl hover:from-cyber-600 hover:to-electric-600 transition-all duration-300 shadow-glow hover:shadow-glow-lg transform hover:scale-105 font-semibold flex items-center gap-2">
                <Sparkles size={18} />
                Modifier la recherche
              </button>
              <button className="px-6 py-3 bg-white border-2 border-gray-200 text-dark-700 rounded-2xl hover:border-cyber-300 transition-all duration-300 shadow-elevated hover:shadow-float font-semibold flex items-center gap-2">
                <Church size={18} />
                Ajouter un lieu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacesList;
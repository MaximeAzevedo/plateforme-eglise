import React, { useState } from 'react';
import { WorshipPlace, Denomination } from '../types';
import { MapPin, Clock, Phone, Globe, Church, ExternalLink, Users, Star, Navigation, Calendar, Sparkles, PlusCircle } from 'lucide-react';

interface PlacesListProps {
  places: WorshipPlace[];
}

const denominationLabels: Record<Denomination, string> = {
  'Catholic': 'Confession : Catholique',
  'Protestant': 'Confession : Protestante',
  'Orthodox': 'Confession : Orthodoxe',
  'Evangelical': 'Confession : Évangélique',
  'Pentecostal': 'Confession : Pentecôtiste',
  'Baptist': 'Confession : Baptiste',
  'Neo-Apostolic': 'Confession : Néo-apostolique',
  'Other': 'Confession : Autre'
};

// Configuration Dune pour les confessions
const denominationConfig: Record<Denomination, { emoji: string; color: string }> = {
  'Catholic': { emoji: '⛪', color: 'bg-accent' },      // Or doux = Catholique
  'Protestant': { emoji: '✝️', color: 'bg-sand-medium' },   // Sable moyen = Protestante  
  'Orthodox': { emoji: '☦️', color: 'bg-title' },     // Bleu ardoise = Orthodoxe
  'Evangelical': { emoji: '🕊️', color: 'bg-warning' },  // Orange = Évangélique
  'Pentecostal': { emoji: '🔥', color: 'bg-error' },     // Rouge = Pentecôtiste
  'Baptist': { emoji: '💧', color: 'bg-info' },        // Bleu info = Baptiste
  'Neo-Apostolic': { emoji: '🕊️', color: 'bg-text' }, // Gris anthracite = Néo-apostolique
  'Other': { emoji: '🏛️', color: 'bg-success' }         // Vert = Autre / Indépendante
};

const PlacesList: React.FC<PlacesListProps> = ({ places }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getRandomTip = () => {
    const tips = [
      "🕐 Vérifiez les horaires avant de vous déplacer",
      "📱 Consultez le site web pour plus d'informations",
      "🚗 Pensez aux options de stationnement",
      "👥 Les groupes de prière sont souvent ouverts aux nouveaux",
      "💒 Chaque lieu a sa propre ambiance spirituelle"
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques Dune */}
      <div className="card-dune">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent-gradient rounded-xl shadow-soft">
              <Church className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-title font-heading text-xs font-semibold">
              {places.length} Lieux découverts
            </h2>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-xs text-text">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="font-body">Données mises à jour</span>
            </div>
          </div>
        </div>
        
        <div className="bg-sand-light border-l-4 border-accent p-3 rounded-lg">
          <p className="text-xs text-text font-body font-medium">
            💡 {getRandomTip()}
          </p>
        </div>
      </div>

      {places.length > 0 ? (
        /* Grille de cartes avec style Dune */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place, index) => (
            <div 
              key={place.id || index}
              className="group relative"
              onMouseEnter={() => setHoveredCard(place.id || index.toString())}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="place-card-dune animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                {/* Header de la carte */}
                <div className="p-3 bg-sand-gradient border-b border-border">
                  <div className="flex items-start gap-2">
                    <div className="shrink-0 w-6 h-6 rounded-lg bg-accent-gradient flex items-center justify-center shadow-soft">
                      <Church className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-title font-heading text-xs font-semibold leading-tight mb-1 truncate">
                        {place.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{denominationConfig[place.denomination]?.emoji || '🏛️'}</span>
                        <div className="badge-dune">
                          <div className={`w-1.5 h-1.5 rounded-full ${denominationConfig[place.denomination]?.color || 'bg-gray'}`}></div>
                          <span className="text-xs font-body font-medium">
                            {denominationLabels[place.denomination]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenu principal */}
                <div className="p-2 space-y-2">
                  {/* Informations principales */}
                  <div className="space-y-1">
                    {/* Adresse */}
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-3 w-3 text-accent mt-0.5 shrink-0" />
                      <div className="text-xs text-text font-body">
                        <div className="text-xs text-text font-body font-medium">{place.address}</div>
                        <div className="text-text opacity-80">{place.postalCode} {place.city}</div>
                      </div>
                    </div>

                    {/* Horaires (si disponibles) */}
                    {place.serviceTimes && (
                      <div className="flex items-start space-x-2">
                        <Clock className="h-3 w-3 text-accent mt-0.5 shrink-0" />
                        <div className="text-xs text-text font-body">
                          <div className="text-xs text-text font-body font-medium">Prochaine célébration</div>
                          <div className="text-text opacity-80">{place.serviceTimes}</div>
                        </div>
                      </div>
                    )}

                    {/* Contact info si disponible */}
                    {place.contactInfo && (
                      <div className="flex items-start space-x-2">
                        <Phone className="h-3 w-3 text-accent mt-0.5 shrink-0" />
                        <div className="text-xs text-text font-body">
                          <div className="text-xs text-text font-body font-medium">Contact</div>
                          <a 
                            href={`tel:${place.contactInfo}`}
                            className="text-accent hover:text-title transition-colors font-medium"
                          >
                            {place.contactInfo}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions optimisées - une seule section */}
                <div className="p-2 border-t border-border">
                  <div className="flex gap-1">
                    {/* Site web - bouton principal si disponible */}
                    {place.website && (
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 p-1.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 group/link font-body font-medium"
                      >
                        <Globe className="w-3 h-3" />
                        <span className="text-xs">Site web</span>
                        <ExternalLink className="w-2 h-2 opacity-70 group-hover/link:opacity-100 transition-opacity" />
                      </a>
                    )}
                    
                    {/* Bouton voir sur carte */}
                    <button className="flex-1 flex items-center justify-center gap-1 p-1.5 bg-sand-light hover:bg-sand border border-border rounded-lg transition-all duration-200 group/btn">
                      <Navigation className="w-3 h-3 text-accent" />
                      <span className="text-xs text-title font-body font-medium">Localiser</span>
                      <Star className="w-2 h-2 text-accent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>

                {/* Effet de bordure subtil sur hover */}
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-accent/30 transition-colors duration-300 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* État vide avec design Dune */
        <div className="card-dune text-center py-16">
          <div className="space-y-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto bg-sand-gradient rounded-full flex items-center justify-center">
                <Church className="w-16 h-16 text-accent" />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-lg">🔍</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-title font-heading text-base font-semibold">
                Aucun lieu trouvé 🤔
              </h3>
              <p className="text-text max-w-md mx-auto leading-relaxed text-xs font-body">
                Pas de panique ! Essayez de modifier vos critères de recherche ou découvrez comment ajouter un nouveau lieu.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <button className="btn-dune-primary flex items-center gap-2">
                <Sparkles size={18} />
                Modifier la recherche
              </button>
              <button className="group flex items-center space-x-2 text-accent hover:text-title font-medium transition-all duration-200 hover:scale-105">
                <PlusCircle size={18} className="transition-transform group-hover:rotate-90" />
                <span>Référencer une Église</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacesList;
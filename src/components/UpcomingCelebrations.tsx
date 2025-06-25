import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { getUpcomingCelebrations, formatCelebrationTime, calculateDistance } from '../utils/scheduleParser';
import type { DateTimeFilter } from '../types';

interface UpcomingCelebration {
  id: string;
  placeName: string;
  placeCity: string;
  denomination: string;
  type: string;
  date: Date;
  startTime: string;
  endTime: string;
  distance?: number;
  position?: [number, number];
}

interface UpcomingCelebrationsProps {
  places: any[];
  mapCenter?: [number, number];
  mapBounds?: [[number, number], [number, number]];
  onPlaceClick?: (position: [number, number], placeName: string) => void;
  timeFilter?: DateTimeFilter;
}

// Configuration des couleurs Dune pour les confessions
const denominationColors: Record<string, string> = {
  Catholic: 'bg-accent/10 text-accent border-accent/20',
  Protestant: 'bg-sand-medium/30 text-title border-sand-medium',
  Orthodox: 'bg-title/10 text-title border-title/20',
  Evangelical: 'bg-warning/10 text-warning border-warning/20',
  'Neo-Apostolic': 'bg-text/10 text-text border-text/20',
  Pentecostal: 'bg-error/10 text-error border-error/20',
  Baptist: 'bg-info/10 text-info border-info/20',
  Other: 'bg-success/10 text-success border-success/20'
};

const denominationLabels: Record<string, string> = {
  Catholic: 'Confession : Catholique',
  Protestant: 'Confession : Protestante',
  Orthodox: 'Confession : Orthodoxe',
  Evangelical: 'Confession : Évangélique',
  Pentecostal: 'Confession : Pentecôtiste',
  Baptist: 'Confession : Baptiste',
  'Neo-Apostolic': 'Confession : Néo-apostolique',
  Other: 'Confession : Autre'
};

export default function UpcomingCelebrations({ 
  places, 
  mapCenter,
  mapBounds,
  onPlaceClick,
  timeFilter
}: UpcomingCelebrationsProps) {
  const [celebrations, setCelebrations] = useState<UpcomingCelebration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Mettre à jour l'heure toutes les minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Mise à jour toutes les minutes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const calculateCelebrations = () => {
      setIsLoading(true);
      
      // Filter places within map bounds if available
      let filteredPlaces = places;
      
      if (mapBounds) {
        filteredPlaces = places.filter(place => {
          const [lat, lng] = place.position;
          const [[southWest0, southWest1], [northEast0, northEast1]] = mapBounds;
          return lat >= southWest0 && lat <= northEast0 && 
                 lng >= southWest1 && lng <= northEast1;
        });
      }

      // Get upcoming celebrations
      const upcomingCelebrations = getUpcomingCelebrations(filteredPlaces, 7, timeFilter);
      
      // Add position information and calculate distances
      upcomingCelebrations.forEach(celebration => {
        const place = places.find(p => p.name === celebration.placeName);
        if (place && place.position) {
          celebration.position = place.position;
          if (mapCenter) {
            const [placeLat, placeLng] = place.position;
            celebration.distance = calculateDistance(
              mapCenter[0], mapCenter[1],
              placeLat, placeLng
            );
          }
        }
      });
      
      // Sort by distance, then by time
      if (mapCenter) {
        upcomingCelebrations.sort((a, b) => {
          if (a.distance && b.distance) {
            const distanceDiff = a.distance - b.distance;
            if (Math.abs(distanceDiff) > 0.5) { // 500m threshold
              return distanceDiff;
            }
          }
          // Si les distances sont similaires, trier par temps puis par nom pour stabilité
          const timeDiff = a.date.getTime() - b.date.getTime();
          if (timeDiff !== 0) return timeDiff;
          return a.placeName.localeCompare(b.placeName);
        });
      } else {
        // Sans mapCenter, trier par temps puis par nom pour stabilité
        upcomingCelebrations.sort((a, b) => {
          const timeDiff = a.date.getTime() - b.date.getTime();
          if (timeDiff !== 0) return timeDiff;
          return a.placeName.localeCompare(b.placeName);
        });
      }
      
      // Limit to 3 most relevant celebrations
      setCelebrations(upcomingCelebrations.slice(0, 3));
      setIsLoading(false);
    };

    calculateCelebrations();
  }, [places, mapCenter, mapBounds, timeFilter]);

  const formatDistance = (distance?: number): string => {
    if (!distance) return '';
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const getTimeIcon = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours <= 2) {
      return <Clock className="h-4 w-4 text-red-500" />;
    } else if (diffHours <= 24) {
      return <Clock className="h-4 w-4 text-orange-500" />;
    } else {
      return <Calendar className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleCelebrationClick = (celebration: UpcomingCelebration) => {
    if (celebration.position && onPlaceClick) {
      onPlaceClick(celebration.position, celebration.placeName);
    }
  };

  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  if (isLoading) {
    return (
      <div className="celebrations-sidebar p-6">
        <h3 className="text-title font-heading text-xs font-semibold mb-4">
          ⛪ Prochaines Célébrations
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 bg-sand rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-sand-light rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (celebrations.length === 0) {
    return (
      <div className="celebrations-sidebar p-6">
        <h3 className="text-title font-heading text-xs font-semibold mb-4">
          ⛪ Prochaines Célébrations
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-sand-gradient rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-accent" />
          </div>
          <p className="text-text text-xs font-body font-medium">
            Aucune célébration programmée dans les prochains jours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header moderne */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Prochaines célébrations
        </h3>
        <p className="text-sm text-gray-600">
          Dans votre zone de recherche
        </p>
      </div>

      {/* Liste des célébrations */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
        {celebrations.length > 0 ? (
          celebrations.map((celebration, index) => (
            <div
              key={`${celebration.id}-${celebration.type}-${index}`}
              className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 hover:shadow-lg hover:border-amber-200 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
              onClick={() => {
                if (celebration.position && onPlaceClick) {
                  onPlaceClick(celebration.position, celebration.placeName);
                }
              }}
            >
              {/* En-tête avec heure */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {celebration.startTime} - {celebration.endTime}
                    </div>
                    <div className="text-xs text-gray-500">
                      {celebration.date.toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
                {celebration.distance && (
                  <div className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-full">
                    {formatDistance(celebration.distance)}
                  </div>
                )}
              </div>

              {/* Type de célébration */}
              <div className="mb-3">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-700">
                    {celebration.type}
                  </span>
                </div>
              </div>

              {/* Lieu */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-amber-700 transition-colors">
                  {celebration.placeName}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{celebration.placeCity}</span>
                </div>
              </div>

              {/* Indicateur cliquable */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-500 font-medium">
                  Cliquez pour localiser
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mx-auto flex items-center justify-center">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">
                Aucune célébration trouvée
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Aucun événement prévu dans cette zone. Essayez d'élargir votre recherche ou modifier vos filtres.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Note informative */}
      <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs">💡</span>
          </div>
          <p className="text-sm text-amber-800 font-medium">
            Cliquez sur une célébration pour localiser l'église sur la carte
          </p>
        </div>
      </div>
    </div>
  );
} 
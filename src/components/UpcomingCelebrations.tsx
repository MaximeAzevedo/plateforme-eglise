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
    <div className="celebrations-sidebar p-6">
      {/* Header avec horloge en temps réel */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-title font-heading text-xs font-semibold">
          ⛪ Prochaines Célébrations
        </h3>
        <div className="text-xs text-text bg-sand-light px-2 py-1 rounded-full font-body font-medium">
          {currentDateTime.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* Liste des célébrations */}
      <div className="space-y-2">
        {celebrations.slice(0, 3).map((celebration, index) => (
          <div 
            key={`${celebration.id}-${celebration.type}-${celebration.startTime}`}
            className="group p-3 bg-sand-light hover:bg-sand border border-border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-soft"
            onClick={() => handleCelebrationClick(celebration)}
          >
            {/* Header avec type et badge confession */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-title font-heading font-semibold text-xs leading-tight mb-1 truncate">
                  {celebration.placeName}
                </h4>
                <p className="text-accent font-body font-medium text-xs">
                  {celebration.type}
                </p>
              </div>
              <div className={`px-2 py-0.5 rounded-full text-xs font-body font-medium border ${denominationColors[celebration.denomination] || denominationColors.Other}`}>
                {denominationLabels[celebration.denomination] || 'Autre'}
              </div>
            </div>

            {/* Timing et détails */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2 text-text">
                <Clock className="w-3 h-3 text-accent" />
                <span className="font-body font-medium">
                  {formatCelebrationTime(celebration.date)}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-text">
                <MapPin className="w-3 h-3 text-accent" />
                <span className="truncate font-body font-medium">{celebration.placeCity}</span>
              </div>

              {/* Distance si disponible */}
              {celebration.distance && (
                <div className="text-text/80 text-xs font-body font-medium">
                  📍 {formatDistance(celebration.distance)}
                </div>
              )}
            </div>

            {/* Indicateur de temps restant */}
            <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs text-text/70 font-body font-medium">
                {celebration.startTime} - {celebration.endTime}
              </span>
              <div className="w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer avec lien vers plus */}
      {celebrations.length > 3 && (
        <div className="mt-3 pt-3 border-t border-border">
          <button className="w-full text-center text-xs text-accent hover:text-title font-body font-medium transition-colors">
            Voir toutes les célébrations ({celebrations.length})
          </button>
        </div>
      )}

      {/* Tip du jour */}
      <div className="mt-4 p-2 bg-sand-gradient border-l-4 border-accent rounded-lg">
        <p className="text-xs text-text font-body font-medium">
          💡 Tip : Cliquez sur une célébration pour localiser l'église sur la carte
        </p>
      </div>
    </div>
  );
} 
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

const denominationColors: Record<string, string> = {
  Catholic: 'bg-blue-100 text-blue-800',
  Protestant: 'bg-green-100 text-green-800',
  Orthodox: 'bg-purple-100 text-purple-800',
  Evangelical: 'bg-orange-100 text-orange-800',
  'Neo-Apostolic': 'bg-amber-100 text-amber-800',
  Pentecostal: 'bg-violet-100 text-violet-800',
  Baptist: 'bg-teal-100 text-teal-800',
  Other: 'bg-gray-100 text-gray-800'
};

const denominationLabels: Record<string, string> = {
  Catholic: 'Catholique',
  Protestant: 'Protestant',
  Orthodox: 'Orthodoxe',
  Evangelical: 'Évangélique',
  'Neo-Apostolic': 'Néo apostolique',
  Pentecostal: 'Pentecôtiste',
  Baptist: 'Baptiste',
  Other: 'Autre'
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
      
      // Limit to 5 most relevant celebrations
      setCelebrations(upcomingCelebrations.slice(0, 5));
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Prochaines célébrations
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (celebrations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Prochaines célébrations
        </h3>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Aucune célébration programmée dans cette zone
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Zoomez ou déplacez la carte pour voir d'autres célébrations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 font-display">
          <Calendar className="h-6 w-6 text-blue-luminous-600" />
          Prochaines célébrations
        </h2>
        <div className="text-xs text-slate-500 font-body">
          près de vous
        </div>
      </div>

      <div className="space-y-3">
        {celebrations.map((celebration, index) => (
          <div 
            key={`${celebration.placeName}-${celebration.type}-${celebration.startTime}-${index}`}
            onClick={() => handleCelebrationClick(celebration)}
            className="border border-gray-200 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getTimeIcon(celebration.date)}
                  <span className="font-medium text-gray-900 text-sm">
                    {formatCelebrationTime(celebration.date)}
                  </span>
                  {celebration.distance && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {formatDistance(celebration.distance)}
                    </span>
                  )}
                </div>
                
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-800 line-clamp-1">
                    {celebration.type}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {celebration.placeName}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 truncate">
                    {celebration.placeCity}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${denominationColors[celebration.denomination] || denominationColors.Other}`}>
                    {denominationLabels[celebration.denomination] || 'Autre'}
                  </span>
                </div>
              </div>
              
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Cliquez sur une célébration pour centrer la carte
        </p>
      </div>
    </div>
  );
} 
import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Clock,
  MapPin,
  Church,
  Users,
  X,
  Filter,
  Check,
  Circle,
  BookOpen,
  Heart,
  Sparkles,
  Shield,
  GraduationCap,
  Baby,
  Music,
  Mic,
  Coffee,
  Sun,
  Sunrise,
  Sunset,
  MoreHorizontal,
  UserCheck,
  Zap,
  Star,
  MessageCircle
} from 'lucide-react';
import { 
  CelebrationType, 
  EventFilter, 
  WorshipPlace 
} from '../types';
import { 
  celebrationTypeLabels, 
  getAvailableEventTypes
} from '../utils/filterUtils';

interface AdvancedFiltersProps {
  places: WorshipPlace[];
  eventFilter: EventFilter;
  onEventFilterChange: (filter: EventFilter) => void;
  isVisible: boolean;
  isMapOverlay?: boolean;
}

const celebrationTypes: CelebrationType[] = [
  'Célébration',
  'Prière',
  'Confession',
  'Adoration',
  'Catéchisme',
  'Groupe de prière',
  'Évangélisation',
  'Service communautaire',
  'Autre'
];

const eventTypes = [
  'Célébration principale',
  'Célébration en semaine',
  'Prière du matin',
  'Prière du soir',
  'Confession',
  'Adoration',
  'Catéchisme',
  'Groupe de prière',
  'Bible study',
  'Évangélisation',
  'Service communautaire',
  'Autre'
];

// Icônes et couleurs pour les types d'événements - Nouvelle charte Ora
const eventTypeConfig: Record<string, { icon: any, color: string }> = {
  'Célébration': { icon: Church, color: 'text-blue-600' },
  'Prière': { icon: Heart, color: 'text-purple-600' },
  'Confession': { icon: Shield, color: 'text-green-600' },
  'Adoration': { icon: Star, color: 'text-yellow-600' },
  'Catéchisme': { icon: BookOpen, color: 'text-indigo-600' },
  'Groupe de prière': { icon: Users, color: 'text-purple-500' },
  'Évangélisation': { icon: MessageCircle, color: 'text-orange-600' },
  'Service communautaire': { icon: Heart, color: 'text-pink-600' },
  'Autre': { icon: Calendar, color: 'text-gray-600' },
  
  'Célébration principale': { icon: Church, color: 'text-blue-600' },
  'Célébration en semaine': { icon: Church, color: 'text-blue-500' },
  'Prière du matin': { icon: Sunrise, color: 'text-yellow-500' },
  'Prière du soir': { icon: Sunset, color: 'text-orange-500' },
  'Bible study': { icon: BookOpen, color: 'text-green-600' }
};

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  places,
  eventFilter,
  onEventFilterChange,
  isVisible,
  isMapOverlay = false
}) => {
  const [availableTypes, setAvailableTypes] = useState<CelebrationType[]>([]);
  const [showEventTypes, setShowEventTypes] = useState(true); // Ouvert par défaut

  useEffect(() => {
    setAvailableTypes(getAvailableEventTypes(places));
  }, [places]);

  const handleEventTypeToggle = (type: CelebrationType) => {
    const currentTypes = eventFilter.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    onEventFilterChange({
      ...eventFilter,
      types: newTypes.length > 0 ? newTypes : undefined
    });
  };

  const clearAllFilters = () => {
    onEventFilterChange({
      ...eventFilter,
      types: undefined
    });
  };

  const hasActiveFilters = () => {
    return (eventFilter.types && eventFilter.types.length > 0);
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-3">
      {/* Header avec bouton effacer */}
      {hasActiveFilters() && (
        <div className="flex justify-end">
          <button
            onClick={clearAllFilters}
            className={`${isMapOverlay ? 'text-xs' : 'text-sm'} text-amber-600 hover:text-amber-700 font-medium`}
          >
            Effacer tout
          </button>
        </div>
      )}

      {/* Filtres par type d'événement */}
      <div className="space-y-2">
        <button
          onClick={() => setShowEventTypes(!showEventTypes)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className={`${isMapOverlay ? 'text-sm' : 'text-base'} font-semibold text-gray-900 flex items-center gap-2`}>
            <Calendar className={`${isMapOverlay ? 'h-4 w-4' : 'h-5 w-5'} text-amber-500`} />
            Types d'événements
            {eventFilter.types && eventFilter.types.length > 0 && (
              <span className={`bg-amber-100 text-amber-800 ${isMapOverlay ? 'text-xs' : 'text-sm'} px-2 py-0.5 rounded-full font-medium`}>
                {eventFilter.types.length}
              </span>
            )}
          </span>
          {showEventTypes ? 
            <ChevronUp className={`${isMapOverlay ? 'h-4 w-4' : 'h-5 w-5'} text-gray-500`} /> : 
            <ChevronDown className={`${isMapOverlay ? 'h-4 w-4' : 'h-5 w-5'} text-gray-500`} />
          }
        </button>

        {showEventTypes && (
          <div className={`grid gap-2 ${isMapOverlay ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {availableTypes.map(type => {
              const config = eventTypeConfig[type];
              if (!config) {
                console.warn(`Configuration manquante pour le type: ${type}`);
                return null;
              }
              const { icon: IconComponent, color } = config;
              return (
                <label 
                  key={type} 
                  className={`flex items-center gap-2 cursor-pointer ${isMapOverlay ? 'p-2' : 'p-3'} rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-amber-300`}
                  style={{ minHeight: isMapOverlay ? '40px' : '48px' }}
                >
                  <input
                    type="checkbox"
                    checked={eventFilter.types?.includes(type) || false}
                    onChange={() => handleEventTypeToggle(type)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <IconComponent className={`${isMapOverlay ? 'h-4 w-4' : 'h-5 w-5'} text-amber-500`} />
                  <span className={`${isMapOverlay ? 'text-xs' : 'text-sm'} text-gray-700 flex-1 font-medium`}>
                    {celebrationTypeLabels[type]}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Résumé des filtres actifs */}
      {hasActiveFilters() && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <h4 className={`${isMapOverlay ? 'text-xs' : 'text-sm'} font-semibold text-amber-800 mb-1`}>Filtres actifs :</h4>
          <div className={`space-y-1 ${isMapOverlay ? 'text-xs' : 'text-sm'} text-gray-600`}>
            {eventFilter.types && eventFilter.types.length > 0 && (
              <div>
                <strong className="text-gray-900">Types :</strong> {eventFilter.types.map(t => celebrationTypeLabels[t]).join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters; 
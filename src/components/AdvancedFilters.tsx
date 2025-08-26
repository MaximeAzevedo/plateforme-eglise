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
  celebrationTypeLabels
} from '../utils/filterUtils';

interface AdvancedFiltersProps {
  places: WorshipPlace[];
  eventFilter: EventFilter;
  onEventFilterChange: (filter: EventFilter) => void;
  isVisible: boolean;
  isMapOverlay?: boolean;
}

const eventTypes = [
  'Culte/Messe',
  'Prière', 
  'Étude biblique',
  'Adoration',
  'Groupe',
  'Autre'
];

// Icônes et couleurs pour les types d'événements - Configuration simplifiée
const eventTypeConfig: Record<string, { icon: any, color: string }> = {
  // Types essentiels seulement
  'Culte/Messe': { icon: Church, color: 'text-culteo-vert-esperance' },
  'Prière': { icon: Heart, color: 'text-culteo-vert-esperance' },
  'Étude biblique': { icon: BookOpen, color: 'text-culteo-vert-esperance' },
  'Adoration': { icon: Star, color: 'text-culteo-vert-esperance' },
  'Groupe': { icon: Users, color: 'text-culteo-vert-esperance' },
  'Autre': { icon: MoreHorizontal, color: 'text-gray-500' }
};

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  places,
  eventFilter,
  onEventFilterChange,
  isVisible,
  isMapOverlay = false
}) => {
  const [showEventTypes, setShowEventTypes] = useState(true); // Ouvert par défaut

  const handleEventTypeToggle = (type: string) => {
    const currentTypes = eventFilter.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    onEventFilterChange({
      ...eventFilter,
      enabled: true,
      types: newTypes.length > 0 ? newTypes : []
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
            className={`${isMapOverlay ? 'text-xs' : 'text-sm'} text-culteo-vert-esperance hover:text-culteo-vert-esperance/80 font-medium`}
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
            <Calendar className={`${isMapOverlay ? 'h-4 w-4' : 'h-5 w-5'} text-culteo-vert-esperance`} />
            Types d'événements
            {eventFilter.types && eventFilter.types.length > 0 && (
              <span className={`bg-culteo-vert-esperance/10 text-culteo-vert-esperance ${isMapOverlay ? 'text-xs' : 'text-sm'} px-2 py-0.5 rounded-full font-medium`}>
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
          <div className={`grid gap-3 ${isMapOverlay ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {eventTypes.map(type => {
              const config = eventTypeConfig[type];
              const isSelected = eventFilter.types?.includes(type) || false;
              
              // Si pas de configuration, utiliser des valeurs par défaut
              const IconComponent = config?.icon || MoreHorizontal;
              const iconColor = config?.color || 'text-gray-500';
              
              return (
                <label
                  key={type}
                  className={`
                    relative flex items-center gap-3 cursor-pointer rounded-xl border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-culteo-vert-esperance bg-culteo-vert-esperance/5 text-culteo-vert-esperance shadow-md scale-105' 
                      : 'border-gray-200 bg-white hover:border-culteo-vert-esperance/20 hover:bg-culteo-vert-esperance/5 hover:scale-102'
                    }
                    ${isMapOverlay ? 'p-3' : 'p-4'}
                  `}
                  style={{ minHeight: isMapOverlay ? '60px' : '70px' }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      const newTypes = e.target.checked 
                        ? [...(eventFilter.types || []), type]
                        : (eventFilter.types || []).filter(t => t !== type);
                      onEventFilterChange({
                        ...eventFilter,
                        enabled: true,
                        types: newTypes.length > 0 ? newTypes : []
                      });
                    }}
                    className="sr-only"
                  />
                  
                  {/* Icône */}
                  <div
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      ${isSelected 
                        ? 'bg-culteo-vert-esperance text-white' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    <IconComponent className={`${isMapOverlay ? 'w-4 h-4' : 'w-5 h-5'}`} />
                  </div>
                  
                  {/* Texte */}
                  <div className="flex-1">
                    <div className={`${isMapOverlay ? 'text-xs' : 'text-sm'} font-medium`}>
                      {celebrationTypeLabels[type] || type}
                    </div>
                  </div>
                  
                  {/* Indicateur de sélection */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-culteo-vert-esperance rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Résumé des filtres actifs */}
      {(eventFilter.types && eventFilter.types.length > 0) && (
        <div className="bg-culteo-vert-esperance/5 border border-culteo-vert-esperance/20 rounded-lg p-3">
          <h4 className={`${isMapOverlay ? 'text-xs' : 'text-sm'} font-semibold text-culteo-vert-esperance mb-1`}>Filtres actifs :</h4>
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
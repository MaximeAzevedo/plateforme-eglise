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
  isVisible
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
    <div className="space-y-4">
      {/* Header avec bouton effacer */}
      {hasActiveFilters() && (
        <div className="flex justify-end">
          <button
            onClick={clearAllFilters}
            className="text-xs text-accent hover:text-title transition-colors font-body font-medium"
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
          <span className="font-body font-medium text-title flex items-center gap-2 text-xs">
            <Calendar className="h-3 w-3" />
            Types d'événements
            {eventFilter.types && eventFilter.types.length > 0 && (
              <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded-full font-body font-medium">
                {eventFilter.types.length}
              </span>
            )}
          </span>
          {showEventTypes ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {showEventTypes && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {availableTypes.map(type => {
              const config = eventTypeConfig[type];
              if (!config) {
                console.warn(`Configuration manquante pour le type: ${type}`);
                return null;
              }
              const { icon: IconComponent, color } = config;
              return (
                <label key={type} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-sand-light transition-colors border border-transparent hover:border-border">
                  <input
                    type="checkbox"
                    checked={eventFilter.types?.includes(type) || false}
                    onChange={() => handleEventTypeToggle(type)}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <IconComponent className={`h-3 w-3 text-accent`} />
                  <span className="text-xs text-text flex-1 font-body font-medium">
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
        <div className="bg-sand-light border border-accent/20 rounded-lg p-2">
          <h4 className="text-xs font-body font-medium text-accent mb-1">Filtres actifs :</h4>
          <div className="space-y-1 text-xs text-text">
            {eventFilter.types && eventFilter.types.length > 0 && (
              <div className="font-body">
                <strong className="text-title">Types :</strong> {eventFilter.types.map(t => celebrationTypeLabels[t]).join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters; 
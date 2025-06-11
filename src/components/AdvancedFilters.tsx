import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Church,
  Users,
  BookOpen,
  Sparkles,
  Heart,
  Shield,
  Circle,
  Baby,
  Music,
  Mic,
  GraduationCap,
  Coffee,
  Sun,
  Sunrise,
  MoreHorizontal,
  UserCheck,
  Zap
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
  // Nouveaux types principaux
  'Messe',
  'Culte',
  'Groupe de prière', 
  'Étude biblique',
  'Adoration',
  'Confession',
  'Réunion de jeunes',
  'Autre',
  // Types existants pour compatibilité
  'Messe/Culte principal',
  'Messe en semaine',
  'Retraite spirituelle',
  'Prière du chapelet',
  'Groupe de jeunes',
  'Baptême',
  'Mariage',
  'Concert chrétien',
  'Conférence'
];

// Mapping des icônes avec couleurs spécifiques pour chaque type d'événement
const celebrationIcons: Record<CelebrationType, { icon: React.ComponentType<any>, color: string }> = {
  // Nouveaux types principaux
  'Messe': { icon: Church, color: 'text-blue-luminous-600' },
  'Culte': { icon: Church, color: 'text-blue-luminous-600' },
  'Groupe de prière': { icon: Users, color: 'text-violet-pastel-600' },
  'Étude biblique': { icon: BookOpen, color: 'text-yellow-orange-pastel-600' },
  'Adoration': { icon: Sparkles, color: 'text-violet-pastel-500' },
  'Confession': { icon: Shield, color: 'text-blue-luminous-700' },
  'Réunion de jeunes': { icon: Zap, color: 'text-yellow-orange-pastel-500' },
  'Autre': { icon: MoreHorizontal, color: 'text-slate-500' },
  // Types existants pour compatibilité
  'Messe/Culte principal': { icon: Church, color: 'text-blue-luminous-600' },
  'Messe en semaine': { icon: Church, color: 'text-blue-luminous-500' },
  'Retraite spirituelle': { icon: Heart, color: 'text-violet-pastel-700' },
  'Prière du chapelet': { icon: Circle, color: 'text-violet-pastel-600' },
  'Groupe de jeunes': { icon: Zap, color: 'text-yellow-orange-pastel-500' },
  'Baptême': { icon: Baby, color: 'text-blue-luminous-500' },
  'Mariage': { icon: Heart, color: 'text-yellow-orange-pastel-600' },
  'Concert chrétien': { icon: Music, color: 'text-yellow-orange-pastel-700' },
  'Conférence': { icon: Mic, color: 'text-blue-luminous-600' },
  'Catéchisme': { icon: GraduationCap, color: 'text-yellow-orange-pastel-600' },
  'Jeûne': { icon: Coffee, color: 'text-violet-pastel-600' },
  'Vêpres': { icon: Sun, color: 'text-yellow-orange-pastel-500' },
  'Laudes': { icon: Sunrise, color: 'text-yellow-orange-pastel-600' }
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
            className="text-sm text-blue-luminous-600 hover:text-blue-luminous-800 transition-colors font-medium"
          >
            Effacer tout
          </button>
        </div>
      )}

      {/* Filtres par type d'événement */}
      <div className="space-y-3">
        <button
          onClick={() => setShowEventTypes(!showEventTypes)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-semibold text-slate-700 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Types d'événements
            {eventFilter.types && eventFilter.types.length > 0 && (
              <span className="bg-violet-pastel-100 text-violet-pastel-800 text-xs px-2 py-1 rounded-full font-medium">
                {eventFilter.types.length}
              </span>
            )}
          </span>
          {showEventTypes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showEventTypes && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableTypes.map(type => {
              const { icon: IconComponent, color } = celebrationIcons[type];
              return (
                <label key={type} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-blue-gray-light-50 transition-colors border border-transparent hover:border-blue-gray-light-200">
                  <input
                    type="checkbox"
                    checked={eventFilter.types?.includes(type) || false}
                    onChange={() => handleEventTypeToggle(type)}
                    className="rounded border-blue-gray-light-300 text-blue-luminous-600 focus:ring-blue-luminous-500"
                  />
                  <IconComponent className={`h-5 w-5 ${color}`} />
                  <span className="text-sm text-slate-700 flex-1 font-medium">
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
        <div className="bg-violet-pastel-50 border border-violet-pastel-200 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-violet-pastel-800 mb-2">Filtres actifs :</h4>
          <div className="space-y-1 text-sm text-violet-pastel-700">
            {eventFilter.types && eventFilter.types.length > 0 && (
              <div>
                <strong>Types :</strong> {eventFilter.types.map(t => celebrationTypeLabels[t]).join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters; 
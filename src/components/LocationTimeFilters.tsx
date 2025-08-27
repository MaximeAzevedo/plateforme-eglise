import React, { useRef } from 'react';
import { Calendar } from 'lucide-react';
import { 
  DateFilter, 
  EventFilter, 
  WorshipPlace 
} from '../types';
import { 
  dateFilterLabels
} from '../utils/filterUtils';

interface LocationTimeFiltersProps {
  places: WorshipPlace[];
  eventFilter: EventFilter;
  onEventFilterChange: (filter: EventFilter) => void;
  currentLocation?: [number, number];
}

const LocationTimeFilters: React.FC<LocationTimeFiltersProps> = ({
  eventFilter,
  onEventFilterChange,
  currentLocation
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateFilterChange = (dateFilter: DateFilter) => {
    onEventFilterChange({
      ...eventFilter,
      dateTimeFilter: {
        ...eventFilter.dateTimeFilter,
        dateFilter: dateFilter
      }
    });
  };

  const handleCustomDateChange = (customDate: string) => {
    onEventFilterChange({
      ...eventFilter,
      dateTimeFilter: {
        ...eventFilter.dateTimeFilter,
        customDate: customDate,
        dateFilter: customDate ? 'custom' : undefined
      }
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {/* Filtres temporels */}
      <div className="space-y-3">
        <h4 className="text-base font-semibold text-gray-900 flex items-center">
          <Calendar className="w-5 h-5 text-culteo-vert-esperance mr-2" />
          Quand souhaitez-vous aller ?
        </h4>
        
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          {/* Aujourd'hui */}
          <label
            className={`
              relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center
              ${eventFilter.dateTimeFilter?.dateFilter === 'today' 
                ? 'border-culteo-vert-esperance bg-culteo-vert-esperance/5 text-culteo-vert-esperance shadow-md scale-105' 
                : 'border-gray-200 bg-white hover:border-culteo-vert-esperance/20 hover:bg-culteo-vert-esperance/5 hover:scale-102'
              }
            `}
            style={{ minHeight: '50px' }}
            onClick={() => handleDateFilterChange('today')}
          >
            <span className="text-sm font-medium">📅 Aujourd'hui</span>
            {eventFilter.dateTimeFilter?.dateFilter === 'today' && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-culteo-vert-esperance rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            )}
          </label>

          {/* Choisir date - Input stylisé directement */}
          <div className="relative">
            <input
              ref={dateInputRef}
              type="date"
              value={eventFilter.dateTimeFilter?.customDate || ''}
              onChange={(e) => handleCustomDateChange(e.target.value)}
              onFocus={() => handleDateFilterChange('custom')}
              className={`
                w-full p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center font-medium text-sm
                ${eventFilter.dateTimeFilter?.dateFilter === 'custom' 
                  ? 'border-culteo-vert-esperance bg-culteo-vert-esperance/5 text-culteo-vert-esperance shadow-md scale-105' 
                  : 'border-gray-200 bg-white hover:border-culteo-vert-esperance/20 hover:bg-culteo-vert-esperance/5 hover:scale-102 text-gray-700'
                }
                
                /* Styles pour cacher le calendrier par défaut et afficher notre texte */
                [&::-webkit-calendar-picker-indicator]:opacity-0
                [&::-webkit-calendar-picker-indicator]:absolute
                [&::-webkit-calendar-picker-indicator]:w-full
                [&::-webkit-calendar-picker-indicator]:h-full
                [&::-webkit-calendar-picker-indicator]:cursor-pointer
                
                /* Cacher la valeur de date par défaut pour montrer notre placeholder */
                color-scheme-light
              `}
              style={{ minHeight: '50px' }}
            />
            
            {/* Overlay pour afficher "🗓️ Choisir date" quand pas de date sélectionnée */}
            {!eventFilter.dateTimeFilter?.customDate && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-sm font-medium">🗓️ Choisir date</span>
              </div>
            )}
            
            {/* Indicateur de filtre actif */}
            {eventFilter.dateTimeFilter?.dateFilter === 'custom' && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-culteo-vert-esperance rounded-full flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            )}
          </div>
        </div>



        {/* Affichage du filtre actif */}
        {eventFilter.dateTimeFilter?.dateFilter && (
          <div className="bg-culteo-vert-esperance/5 border border-culteo-vert-esperance/20 rounded-xl p-3">
            <h5 className="text-sm font-medium text-culteo-vert-esperance mb-1">Filtre actif :</h5>
            <div className="text-sm text-culteo-vert-esperance">
              <strong>Période :</strong> {dateFilterLabels[eventFilter.dateTimeFilter.dateFilter]}
              {eventFilter.dateTimeFilter.customDate && ` (${eventFilter.dateTimeFilter.customDate})`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationTimeFilters; 
import React from 'react';
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
  // Clic sur "Aujourd'hui" - SIMPLE
  const handleTodayClick = () => {
    onEventFilterChange({
      ...eventFilter,
      dateTimeFilter: {
        ...eventFilter.dateTimeFilter,
        dateFilter: 'today',
        customDate: undefined // Nettoie l'ancienne date
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
        
        <div className="space-y-3">
          {/* Bouton Aujourd'hui - SIMPLE */}
          <button
            type="button"
            onClick={handleTodayClick}
            className={`
              w-full relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center
              ${eventFilter.dateTimeFilter?.dateFilter === 'today' 
                ? 'border-culteo-vert-esperance bg-culteo-vert-esperance/5 text-culteo-vert-esperance shadow-md' 
                : 'border-gray-200 bg-white hover:border-culteo-vert-esperance/20 hover:bg-culteo-vert-esperance/5'
              }
            `}
            style={{ minHeight: '50px' }}
          >
            <span className="text-sm font-medium">📅 Aujourd'hui</span>
          </button>

          {/* Input Date avec placeholder "Choisir date" */}
          <div className="relative">
            <input
              type="date"
              value={eventFilter.dateTimeFilter?.customDate || ''}
              onChange={(e) => {
                const selectedDate = e.target.value;
                onEventFilterChange({
                  ...eventFilter,
                  dateTimeFilter: {
                    ...eventFilter.dateTimeFilter,
                    customDate: selectedDate,
                    dateFilter: selectedDate ? 'custom' : undefined
                  }
                });
              }}
              className={`
                w-full p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center font-medium text-sm
                ${eventFilter.dateTimeFilter?.dateFilter === 'custom' 
                  ? 'border-culteo-vert-esperance bg-culteo-vert-esperance/5 text-culteo-vert-esperance shadow-md' 
                  : 'border-gray-200 bg-white hover:border-culteo-vert-esperance/20 hover:bg-culteo-vert-esperance/5'
                }
              `}
              style={{ 
                minHeight: '50px',
                width: '100%',
                boxSizing: 'border-box',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none'
              }}
            />
            
            {/* Overlay "Choisir date" quand vide */}
            {!eventFilter.dateTimeFilter?.customDate && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-sm font-medium text-gray-700">🗓️ Choisir date</span>
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
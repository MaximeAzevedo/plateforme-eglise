import React, { useState } from 'react';
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
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      {/* Section Quand ? */}
      <div className="space-y-3">
        <h4 className="text-base font-semibold text-gray-900 flex items-center">
          <Calendar className="w-5 h-5 text-amber-500 mr-2" />
          Quand ?
        </h4>

        {/* Grille 2x2 des filtres de date */}
        <div className="grid grid-cols-2 gap-3">
          {/* Ligne 1: Aujourd'hui | Ce soir */}
          <button
            onClick={() => handleDateFilterChange('today')}
            className={`
              relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center
              ${eventFilter.dateTimeFilter?.dateFilter === 'today'
                ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-md scale-105'
                : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/50 hover:scale-102'
              }
            `}
            style={{ minHeight: '50px' }}
          >
            <span className="text-sm font-medium">Aujourd'hui</span>
            {eventFilter.dateTimeFilter?.dateFilter === 'today' && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            )}
          </button>

          <button
            onClick={() => handleDateFilterChange('tonight')}
            className={`
              relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center
              ${eventFilter.dateTimeFilter?.dateFilter === 'tonight'
                ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-md scale-105'
                : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/50 hover:scale-102'
              }
            `}
            style={{ minHeight: '50px' }}
          >
            <span className="text-sm font-medium">Ce soir</span>
            {eventFilter.dateTimeFilter?.dateFilter === 'tonight' && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            )}
          </button>

          {/* Ligne 2: Ce week-end | Cette semaine */}
          <button
            onClick={() => handleDateFilterChange('weekend')}
            className={`
              relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center
              ${eventFilter.dateTimeFilter?.dateFilter === 'weekend'
                ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-md scale-105'
                : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/50 hover:scale-102'
              }
            `}
            style={{ minHeight: '50px' }}
          >
            <span className="text-sm font-medium">Ce week-end</span>
            {eventFilter.dateTimeFilter?.dateFilter === 'weekend' && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            )}
          </button>

          <button
            onClick={() => handleDateFilterChange('week')}
            className={`
              relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center
              ${eventFilter.dateTimeFilter?.dateFilter === 'week'
                ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-md scale-105'
                : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/50 hover:scale-102'
              }
            `}
            style={{ minHeight: '50px' }}
          >
            <span className="text-sm font-medium">Cette semaine</span>
            {eventFilter.dateTimeFilter?.dateFilter === 'week' && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            )}
          </button>
        </div>

        {/* Bouton Date spécifique */}
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className={`
            w-full relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center flex items-center justify-center space-x-2
            ${eventFilter.dateTimeFilter?.dateFilter === 'custom'
              ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-md scale-105'
              : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/50 hover:scale-102'
            }
          `}
          style={{ minHeight: '50px' }}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Date spécifique</span>
          {eventFilter.dateTimeFilter?.dateFilter === 'custom' && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          )}
        </button>

        {/* Date picker qui apparaît quand on clique */}
        {showDatePicker && (
          <div className="mt-3">
            <input
              type="date"
              min={today}
              value={eventFilter.dateTimeFilter?.customDate || ''}
              onChange={(e) => handleCustomDateChange(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-amber-400 bg-amber-50 text-amber-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Résumé des filtres actifs */}
      {eventFilter.dateTimeFilter?.dateFilter && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <h5 className="text-sm font-medium text-amber-800 mb-1">Filtre actif :</h5>
          <div className="text-sm text-amber-700">
            <strong>Période :</strong> {dateFilterLabels[eventFilter.dateTimeFilter.dateFilter]}
            {eventFilter.dateTimeFilter.customDate && ` (${eventFilter.dateTimeFilter.customDate})`}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationTimeFilters; 
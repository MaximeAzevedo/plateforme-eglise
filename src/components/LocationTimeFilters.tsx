import React, { useState, useEffect } from 'react';
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

        {/* Filtres de date - Style moderne */}
        <div className="grid grid-cols-2 gap-3">
          {(['today', 'weekend', 'week'] as DateFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => handleDateFilterChange(filter)}
              className={`
                relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center
                ${eventFilter.dateTimeFilter?.dateFilter === filter
                  ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-md scale-105'
                  : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/50 hover:scale-102'
                }
              `}
              style={{ minHeight: '50px' }}
            >
              <span className="text-sm font-medium">
                {dateFilterLabels[filter]}
              </span>
              {eventFilter.dateTimeFilter?.dateFilter === filter && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Sélecteur de date personnalisée */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Date spécifique</label>
          <input
            type="date"
            min={today}
            value={eventFilter.dateTimeFilter?.customDate || ''}
            onChange={(e) => handleCustomDateChange(e.target.value)}
            className={`
              w-full p-3 rounded-xl border-2 transition-all duration-200
              ${eventFilter.dateTimeFilter?.customDate
                ? 'border-amber-400 bg-amber-50 text-amber-900'
                : 'border-gray-200 bg-white hover:border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100'
              }
            `}
          />
        </div>
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
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
  places,
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

  const handleCustomDateChange = (date: string) => {
    onEventFilterChange({
      ...eventFilter,
      dateTimeFilter: {
        ...eventFilter.dateTimeFilter,
        dateFilter: 'custom',
        customDate: date
      }
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Filtres temporels */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Quand ?
        </h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(dateFilterLabels) as DateFilter[]).filter(filter => filter !== 'custom').map(filter => (
            <button
              key={filter}
              onClick={() => handleDateFilterChange(filter)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                eventFilter.dateTimeFilter?.dateFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {dateFilterLabels[filter]}
            </button>
          ))}
        </div>

        {/* Sélecteur de date personnalisée */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            min={today}
            value={eventFilter.dateTimeFilter?.customDate || ''}
            onChange={(e) => handleCustomDateChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-sm text-gray-600">Date spécifique</span>
        </div>
      </div>

      {/* Résumé des filtres actifs */}
      {eventFilter.dateTimeFilter?.dateFilter && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h5 className="text-sm font-medium text-green-800 mb-2">Filtre actif :</h5>
          <div className="text-sm text-green-700">
            <strong>Période :</strong> {dateFilterLabels[eventFilter.dateTimeFilter.dateFilter]}
            {eventFilter.dateTimeFilter.customDate && ` (${eventFilter.dateTimeFilter.customDate})`}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationTimeFilters; 
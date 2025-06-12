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
    <div className="space-y-4">
      {/* Filtres temporels */}
      <div className="space-y-2">
        <h4 className="text-xs font-body font-medium text-title flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          Quand ?
        </h4>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
          {(Object.keys(dateFilterLabels) as DateFilter[]).filter(filter => filter !== 'custom').map(filter => (
            <button
              key={filter}
              onClick={() => handleDateFilterChange(filter)}
              className={`px-2 py-1 rounded-lg text-xs transition-colors font-body font-medium ${
                eventFilter.dateTimeFilter?.dateFilter === filter
                  ? 'bg-accent text-white'
                  : 'bg-sand-light text-text hover:bg-sand'
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
            className="px-2 py-1 border border-border rounded-lg text-xs focus:ring-2 focus:ring-accent focus:border-accent font-body"
          />
          <span className="text-xs text-text font-body">Date spécifique</span>
        </div>
      </div>

      {/* Résumé des filtres actifs */}
      {eventFilter.dateTimeFilter?.dateFilter && (
        <div className="bg-sand-light border border-accent/20 rounded-lg p-2">
          <h5 className="text-xs font-body font-medium text-accent mb-1">Filtre actif :</h5>
          <div className="text-xs text-text font-body">
            <strong className="text-title">Période :</strong> {dateFilterLabels[eventFilter.dateTimeFilter.dateFilter]}
            {eventFilter.dateTimeFilter.customDate && ` (${eventFilter.dateTimeFilter.customDate})`}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationTimeFilters; 
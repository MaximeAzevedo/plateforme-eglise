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

          {/* Choisir date */}
          <label
            className={`
              relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center
              ${eventFilter.dateTimeFilter?.dateFilter === 'custom' 
                ? 'border-culteo-vert-esperance bg-culteo-vert-esperance/5 text-culteo-vert-esperance shadow-md scale-105' 
                : 'border-gray-200 bg-white hover:border-culteo-vert-esperance/20 hover:bg-culteo-vert-esperance/5 hover:scale-102'
              }
            `}
            style={{ minHeight: '50px' }}
            onClick={() => {
              // Activer automatiquement le filtre custom et ouvrir le date picker
              handleDateFilterChange('custom');
              setShowDatePicker(true);
            }}
          >
            <span className="text-sm font-medium">🗓️ Choisir date</span>
            {eventFilter.dateTimeFilter?.dateFilter === 'custom' && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-culteo-vert-esperance rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            )}
          </label>
        </div>

        {/* Input de date personnalisée */}
        {showDatePicker && (
          <input
            type="date"
            value={eventFilter.dateTimeFilter?.customDate || ''}
            onChange={(e) => handleCustomDateChange(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-culteo-vert-esperance bg-culteo-vert-esperance/5 text-culteo-vert-esperance focus:border-culteo-vert-esperance focus:ring-2 focus:ring-culteo-vert-esperance/10 transition-all duration-200"
          />
        )}

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
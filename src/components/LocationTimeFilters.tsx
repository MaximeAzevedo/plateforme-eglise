import React, { useRef, useState } from 'react';
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
  const [isSelectingDate, setIsSelectingDate] = useState(false);

  // Clic sur "Aujourd'hui" - nettoie tout et met en mode today
  const handleTodayClick = () => {
    onEventFilterChange({
      ...eventFilter,
      dateTimeFilter: {
        ...eventFilter.dateTimeFilter,
        dateFilter: 'today',
        customDate: undefined // ✅ Nettoie l'ancienne date
      }
    });
    setIsSelectingDate(false); // Sortir du mode sélection
  };

  // Clic sur "Choisir date" - active le mode sélection
  const handleChooseDateClick = () => {
    setIsSelectingDate(true);
    // Focus automatique sur l'input pour ouvrir le calendrier
    setTimeout(() => {
      if (dateInputRef.current) {
        dateInputRef.current.focus();
      }
    }, 100);
  };

  // Sélection d'une date dans le calendrier
  const handleCustomDateChange = (customDate: string) => {
    onEventFilterChange({
      ...eventFilter,
      dateTimeFilter: {
        ...eventFilter.dateTimeFilter,
        customDate: customDate,
        dateFilter: customDate ? 'custom' : undefined
      }
    });
    
    // Sortir du mode sélection après avoir choisi une date
    if (customDate) {
      setIsSelectingDate(false);
    }
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
          {/* Bouton Aujourd'hui */}
          <button
            type="button"
            onClick={handleTodayClick}
            className={`
              relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center
              ${eventFilter.dateTimeFilter?.dateFilter === 'today' 
                ? 'border-culteo-vert-esperance bg-culteo-vert-esperance/5 text-culteo-vert-esperance shadow-md scale-105' 
                : 'border-gray-200 bg-white hover:border-culteo-vert-esperance/20 hover:bg-culteo-vert-esperance/5 hover:scale-102'
              }
            `}
            style={{ minHeight: '50px' }}
          >
            <span className="text-sm font-medium">📅 Aujourd'hui</span>
            {eventFilter.dateTimeFilter?.dateFilter === 'today' && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-culteo-vert-esperance rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            )}
          </button>

          {/* Choisir date - Logique conditionnelle simple */}
          {isSelectingDate ? (
            /* Mode sélection : input date pur */
            <input
              ref={dateInputRef}
              type="date"
              value={eventFilter.dateTimeFilter?.customDate || ''}
              onChange={(e) => handleCustomDateChange(e.target.value)}
              onBlur={() => {
                // Si on sort de l'input sans choisir de date, revenir au mode bouton
                if (!eventFilter.dateTimeFilter?.customDate) {
                  setIsSelectingDate(false);
                }
              }}
              className={`
                w-full p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center font-medium text-sm
                border-culteo-vert-esperance bg-culteo-vert-esperance/5 text-culteo-vert-esperance shadow-md scale-105
              `}
              style={{ minHeight: '50px' }}
            />
          ) : (
            /* Mode bouton : bouton "Choisir date" */
            <button
              type="button"
              onClick={handleChooseDateClick}
              className={`
                relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center
                ${eventFilter.dateTimeFilter?.dateFilter === 'custom' 
                  ? 'border-culteo-vert-esperance bg-culteo-vert-esperance/5 text-culteo-vert-esperance shadow-md scale-105' 
                  : 'border-gray-200 bg-white hover:border-culteo-vert-esperance/20 hover:bg-culteo-vert-esperance/5 hover:scale-102'
                }
              `}
              style={{ minHeight: '50px' }}
            >
              <span className="text-sm font-medium">
                {eventFilter.dateTimeFilter?.customDate 
                  ? `📅 ${eventFilter.dateTimeFilter.customDate}` 
                  : '🗓️ Choisir date'
                }
              </span>
              {eventFilter.dateTimeFilter?.dateFilter === 'custom' && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-culteo-vert-esperance rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          )}
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
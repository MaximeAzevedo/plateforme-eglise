import React, { useState } from 'react';
import { Search as SearchIcon, Filter, ChevronDown, ChevronUp, Sparkles, MapPin, Zap, X, SlidersHorizontal } from 'lucide-react';
import { Denomination, EventFilter, WorshipPlace } from '../types';
import { denominationLabels } from '../utils/filterUtils';
import GeolocationButton from './GeolocationButton';
import AdvancedFilters from './AdvancedFilters';
import LocationTimeFilters from './LocationTimeFilters';

interface SearchProps {
  places: WorshipPlace[];
  onSearch: (query: string) => void;
  onDenominationFilter: (denominations: Denomination[] | null) => void;
  onEventFilter: (filter: EventFilter) => void;
  selectedDenominations: Denomination[] | null;
  eventFilter: EventFilter;
  onLocationFound?: (position: [number, number]) => void;
  currentLocation?: [number, number];
  isMapOverlay?: boolean;
}

const denominations: Denomination[] = ['Catholic', 'Protestant', 'Orthodox', 'Evangelical', 'Neo-Apostolic', 'Pentecostal', 'Baptist', 'Other'];

const Search: React.FC<SearchProps> = ({ 
  places,
  onSearch, 
  onDenominationFilter, 
  onEventFilter,
  selectedDenominations,
  eventFilter,
  onLocationFound,
  currentLocation,
  isMapOverlay = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleLocationFound = (position: [number, number]) => {
    if (onLocationFound) {
      onLocationFound(position);
      setLocationMessage("🎯 Position trouvée ! La carte a été centrée sur votre localisation.");
      setTimeout(() => setLocationMessage(null), 5000);
    }
  };

  const handleLocationError = (error: string) => {
    setLocationMessage(`⚠️ ${error}`);
    setTimeout(() => setLocationMessage(null), 5000);
  };

  const handleQuickLocation = () => {
    if (navigator.geolocation) {
      setLocationMessage("📍 Recherche de votre position...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const position: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          handleLocationFound(position);
        },
        (error) => {
          handleLocationError("Impossible d'accéder à votre localisation");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      handleLocationError("Géolocalisation non supportée par votre navigateur");
    }
  };

  const handleDenominationToggle = (denomination: Denomination) => {
    const current = selectedDenominations || [];
    
    if (current.includes(denomination)) {
      const newSelection = current.filter(d => d !== denomination);
      onDenominationFilter(newSelection.length > 0 ? newSelection : null);
    } else {
      onDenominationFilter([...current, denomination]);
    }
  };

  const handleSelectAll = () => {
    onDenominationFilter(null);
  };

  const hasActiveEventFilters = () => {
    return (eventFilter.types && eventFilter.types.length > 0) ||
           (eventFilter.dateTimeFilter?.dateFilter);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedDenominations && selectedDenominations.length > 0) count++;
    if (eventFilter.types && eventFilter.types.length > 0) count++;
    if (eventFilter.dateTimeFilter?.dateFilter) count++;
    return count;
  };

  const isAllSelected = !selectedDenominations || selectedDenominations.length === 0;

  return (
    <div className={`space-y-4 ${isMapOverlay ? 'w-full' : ''}`}>
      {/* Message de localisation */}
      {locationMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm animate-slide-in">
          {locationMessage}
        </div>
      )}

      {/* Conteneur de recherche principal */}
      <div className={`relative ${isMapOverlay ? 'rounded-xl' : 'bg-white rounded-2xl shadow-lg border border-gray-100'} transition-all duration-300 ${
        isSearchFocused ? 'ring-2 ring-amber-500/20 shadow-xl' : ''
      }`}>
        
        {/* Barre de recherche */}
        <div className={`${isMapOverlay ? 'p-3' : 'p-6'}`}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={isMapOverlay ? "Rechercher..." : "Rechercher par nom, ville ou adresse..."}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`
                w-full pl-12 pr-20 py-3 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500
                transition-all duration-200 bg-gray-50 hover:bg-white
                ${isMapOverlay ? 'text-sm' : 'text-base'}
              `}
              style={{ fontSize: '16px' }}
            />
            
            {/* Actions à droite */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-2">
              {/* Bouton Géolocalisation */}
              <GeolocationButton 
                onLocationFound={handleLocationFound}
                onError={handleLocationError}
              />
              
              {/* Bouton Filtres avec texte */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  group inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200 text-xs font-medium
                  ${showFilters 
                    ? 'bg-culteo-vert-esperance/10 text-culteo-vert-esperance' 
                    : 'bg-gray-50 text-gray-600 hover:bg-culteo-vert-esperance/10 hover:text-culteo-vert-esperance'
                  }
                `}
                title="Filtrer les résultats"
              >
                <SlidersHorizontal className="h-3 w-3 transition-transform duration-200" />
                <span>Filtres</span>
                {getActiveFiltersCount() > 0 && (
                  <div className="w-2 h-2 bg-culteo-vert-esperance rounded-full"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Section des filtres */}
        {showFilters && (
          <>
            {/* Overlay pour fermer les filtres */}
            <div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
              onClick={() => setShowFilters(false)}
            />
            
            {/* Popup des filtres depuis le haut */}
            <div className="fixed top-0 left-0 right-0 z-[70] bg-white shadow-2xl rounded-b-3xl max-h-[70vh] overflow-hidden">
              
              {/* Header avec bouton fermer */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-bold text-gray-900">Filtres</h3>
                  <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                    {places.length}
                  </div>
                </div>
                
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Bouton reset */}
              <div className="px-4 py-2 border-b border-gray-100">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    onSearch('');
                    onDenominationFilter(null);
                    onEventFilter({ enabled: false, types: [] });
                  }}
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors text-sm px-3 py-1.5 font-medium"
                >
                  ↻ Réinitialiser tous les filtres
                </button>
              </div>

              {/* Contenu scrollable */}
              <div className="overflow-y-auto max-h-[50vh] p-4 space-y-6">
                
                {/* Filtres par confession */}
                <div className="space-y-3">
                  <h4 className="text-base font-semibold text-gray-900 flex items-center">
                    <Sparkles className="w-5 h-5 text-amber-500 mr-2" />
                    Confessions religieuses
                  </h4>
                  
                  <div className="grid gap-3 grid-cols-2">
                    {denominations.map((denomination) => (
                      <label
                        key={denomination}
                        className={`
                          relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center
                          ${selectedDenominations?.includes(denomination)
                            ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-md scale-105'
                            : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/50 hover:scale-102'
                          }
                        `}
                        style={{ minHeight: '50px' }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDenominations?.includes(denomination) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newSelection = selectedDenominations ? [...selectedDenominations, denomination] : [denomination];
                              onDenominationFilter(newSelection);
                            } else {
                              const newSelection = selectedDenominations?.filter(d => d !== denomination) || [];
                              onDenominationFilter(newSelection.length > 0 ? newSelection : null);
                            }
                          }}
                          className="sr-only"
                        />
                        <div className="text-sm font-medium">
                          {denominationLabels[denomination]}
                        </div>
                        {selectedDenominations?.includes(denomination) && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Composants de filtres avancés */}
                <AdvancedFilters 
                  places={places}
                  eventFilter={eventFilter}
                  onEventFilterChange={onEventFilter}
                  isVisible={true}
                  isMapOverlay={true}
                />
                
                <LocationTimeFilters 
                  places={places}
                  eventFilter={eventFilter}
                  onEventFilterChange={onEventFilter}
                  currentLocation={currentLocation}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
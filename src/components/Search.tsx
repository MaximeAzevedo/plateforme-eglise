import React, { useState } from 'react';
import { Search as SearchIcon, Filter, ChevronDown, ChevronUp, Sparkles, MapPin, Zap } from 'lucide-react';
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
  currentLocation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
      {/* Header principal avec recherche épuré */}
      <div className="p-6 space-y-6">
        {/* Titre de section sobre */}
        <div className="text-center">
          <h2 className="text-gray-800 font-body text-lg font-medium">
            Commencez votre recherche
          </h2>
        </div>

        <form
          className="flex flex-col lg:flex-row gap-3 items-center justify-center"
          onSubmit={e => { e.preventDefault(); onSearch(searchQuery); }}
        >
          <div className="flex-1 w-full relative">
            <input
              type="text"
              placeholder="Entrez une ville, une adresse, un code postal..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm font-body transition-all duration-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 shadow-sm placeholder:text-gray-500 ${isSearchFocused ? 'ring-2 ring-yellow-100 border-yellow-400' : ''}`}
            />
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg font-body font-medium text-sm bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200"
          >
            Rechercher
          </button>
          <button
            type="button"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  pos => onLocationFound && onLocationFound([pos.coords.latitude, pos.coords.longitude])
                );
              }
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-lg font-body text-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-yellow-300 transition-all duration-200 shadow-sm"
          >
            <MapPin className="h-4 w-4" />
            <span>Près de moi</span>
          </button>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg shadow-sm transition-all duration-200 font-medium text-sm ${
              hasActiveEventFilters() || !isAllSelected
                ? 'bg-yellow-50 border border-yellow-200 text-yellow-800 hover:bg-yellow-100'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>
              Filtres
              {getActiveFiltersCount() > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-yellow-600 text-white text-xs font-medium rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
            </span>
            <div>
              {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>
        </form>

        {/* Message de géolocalisation sobre */}
        {locationMessage && (
          <div className={`p-3 rounded-lg border ${
            locationMessage.includes('trouvée') 
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin size={16} />
              <span>{locationMessage}</span>
            </div>
          </div>
        )}
      </div>

      {/* Section des filtres avec design épuré */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-100 p-6 space-y-6">
          {/* Filtres par confession avec touches dorées subtiles */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={handleSelectAll}
                className={`px-4 py-2 rounded-md text-sm font-medium font-body transition-all duration-200
                  ${isAllSelected
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm border border-yellow-500'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-yellow-300 shadow-sm'}
                `}
              >
                Toutes
              </button>
              {denominations.map((denom, index) => (
                <button
                  key={denom}
                  onClick={() => handleDenominationToggle(denom)}
                  className={`px-4 py-2 rounded-md text-sm font-medium font-body transition-all duration-200
                    ${selectedDenominations?.includes(denom)
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm border border-yellow-500'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-yellow-300 shadow-sm'}
                  `}
                >
                  {denominationLabels[denom]}
                </button>
              ))}
            </div>
          </div>

          {/* Grille des filtres avancés avec accents dorés */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Filtres par type d'événement */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Sparkles className="text-yellow-600" size={16} />
                </div>
                <h4 className="text-base font-medium text-gray-800 font-body">
                  Types d'événements
                </h4>
              </div>
              <AdvancedFilters
                places={places}
                eventFilter={eventFilter}
                onEventFilterChange={onEventFilter}
                isVisible={true}
              />
            </div>

            {/* Filtres par localisation et heure */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <MapPin className="text-yellow-600" size={16} />
                </div>
                <h4 className="text-base font-medium text-gray-800 font-body">
                  Localisation & Horaires
                </h4>
              </div>
              <LocationTimeFilters
                places={places}
                eventFilter={eventFilter}
                onEventFilterChange={onEventFilter}
                currentLocation={currentLocation}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
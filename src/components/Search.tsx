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
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl overflow-hidden">
      {/* Section de recherche principale */}
      <div className="p-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Entrez une ville, une adresse, un code postal..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full px-6 py-4 pr-12 rounded-2xl border-2 border-gray-200 bg-white/70 backdrop-blur-sm text-gray-800 font-medium placeholder:text-gray-500 transition-all duration-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:bg-white ${
                  isSearchFocused ? 'scale-[1.02] shadow-lg' : 'hover:border-gray-300'
                }`}
              />
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    pos => onLocationFound && onLocationFound([pos.coords.latitude, pos.coords.longitude])
                  );
                }
              }}
              className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <MapPin className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Près de moi</span>
            </button>
            
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`group flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                hasActiveEventFilters() || !isAllSelected
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105'
                  : 'bg-white/80 border-2 border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              <Filter className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>
                Filtres
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-white/30 rounded-full text-xs font-bold">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </span>
              {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Message de géolocalisation */}
        {locationMessage && (
          <div className={`mt-4 p-4 rounded-2xl border-2 ${
            locationMessage.includes('trouvée') 
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center space-x-3">
              <MapPin size={18} />
              <span className="font-medium">{locationMessage}</span>
            </div>
          </div>
        )}
      </div>

      {/* Section des filtres avancés */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-200/50 bg-gray-50/50 backdrop-blur-sm">
          <div className="p-8 space-y-8">
            {/* Filtres par confession */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                Confessions religieuses
              </h4>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSelectAll}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    isAllSelected
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  Toutes
                </button>
                {denominations.map(denomination => (
                  <button
                    key={denomination}
                    onClick={() => handleDenominationToggle(denomination)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      selectedDenominations?.includes(denomination)
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    {denominationLabels[denomination]}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtres avancés */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Filtres par type d'événement */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">
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
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">
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
        </div>
      )}
    </div>
  );
};

export default Search;
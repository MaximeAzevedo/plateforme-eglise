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
    <div className="card-premium mb-8 animate-fade-in">
      {/* Header principal avec recherche modernisé */}
      <div className="space-y-6">
        {/* Titre de section avec emoji */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-cyber-500 to-electric-500 rounded-xl">
            <SearchIcon className="text-white" size={20} />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyber-600 to-electric-600 bg-clip-text text-transparent">
            Recherche Intelligente
          </h2>
          <Sparkles size={18} className="text-neon-400 animate-pulse" />
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barre de recherche avec effet glassmorphism */}
          <div className="flex-1 relative group">
            <div className={`absolute inset-0 bg-gradient-to-r from-cyber-400 to-electric-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${isSearchFocused ? 'opacity-30' : ''}`}></div>
            <div className="relative flex">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <SearchIcon className={`h-5 w-5 transition-colors duration-300 ${isSearchFocused ? 'text-cyber-500' : 'text-gray-400'}`} />
              </div>
              <input
                type="text"
                placeholder="🔍 Trouvez votre lieu de culte idéal..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="flex-1 pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-l-2xl focus:border-cyber-400 focus:ring-4 focus:ring-cyber-100 transition-all duration-300 text-body placeholder-gray-500 font-medium"
              />
              <button
                onClick={() => onSearch(searchQuery)}
                className="group/btn px-8 py-4 bg-gradient-to-r from-cyber-500 to-electric-500 hover:from-cyber-600 hover:to-electric-600 text-white font-semibold rounded-r-2xl transition-all duration-300 shadow-glow hover:shadow-glow-lg flex items-center gap-3 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <Zap className="h-5 w-5 transition-transform duration-300 group-hover/btn:scale-110" />
                <span className="hidden sm:inline relative z-10">Rechercher</span>
              </button>
            </div>
          </div>

          {/* Boutons d'action modernisés */}
          <div className="flex gap-3">
            <GeolocationButton
              onLocationFound={handleLocationFound}
              onError={handleLocationError}
            />
            
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`group flex items-center gap-3 px-6 py-4 rounded-2xl shadow-elevated transition-all duration-300 hover:shadow-float font-medium ${
                hasActiveEventFilters() || !isAllSelected
                  ? 'bg-gradient-to-r from-neon-100 to-electric-100 border-2 border-neon-300 text-neon-700 hover:from-neon-200 hover:to-electric-200'
                  : 'bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-dark-700 hover:border-cyber-300 hover:bg-white'
              }`}
            >
              <Filter className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-sm font-semibold">
                Filtres
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-gradient-to-r from-hot-500 to-neon-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </span>
              <div className="transition-transform duration-300">
                {showAdvancedFilters ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </button>
          </div>
        </div>

        {/* Message de géolocalisation avec style moderne */}
        {locationMessage && (
          <div className={`p-4 rounded-2xl border backdrop-blur-sm animate-slide-down ${
            locationMessage.includes('trouvée') 
              ? 'bg-mint-50/80 border-mint-200 text-mint-800'
              : 'bg-neon-50/80 border-neon-200 text-neon-800'
          }`}>
            <div className="flex items-center space-x-2">
              <MapPin size={16} />
              <span className="font-medium">{locationMessage}</span>
            </div>
          </div>
        )}
      </div>

      {/* Section des filtres avec animation */}
      {showAdvancedFilters && (
        <div className="mt-8 space-y-8 animate-slide-down">
          {/* Divider moderne */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="text-sm font-medium text-gray-500 bg-white px-4 py-1 rounded-full border border-gray-200">
              Filtres Avancés
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Filtres par confession avec design moderne */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-dark-800">
                ⛪ Confessions
              </h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {isAllSelected ? 'Toutes' : `${selectedDenominations?.length} sélectionnée(s)`}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3 stagger-animation">
              <button
                onClick={handleSelectAll}
                className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isAllSelected
                    ? 'bg-gradient-to-r from-cyber-500 to-electric-500 text-white shadow-glow'
                    : 'bg-white/80 backdrop-blur-sm text-dark-700 border-2 border-gray-200 hover:border-cyber-300 shadow-elevated hover:shadow-float'
                }`}
              >
                ✨ Toutes
              </button>
              {denominations.map((denom, index) => (
                <button
                  key={denom}
                  onClick={() => handleDenominationToggle(denom)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedDenominations?.includes(denom)
                      ? 'bg-gradient-to-r from-cyber-500 to-electric-500 text-white shadow-glow'
                      : 'bg-white/80 backdrop-blur-sm text-dark-700 border-2 border-gray-200 hover:border-cyber-300 shadow-elevated hover:shadow-float'
                  }`}
                >
                  {denominationLabels[denom]}
                </button>
              ))}
            </div>
          </div>

          {/* Grille des filtres avancés avec cards modernes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Filtres par type d'événement */}
            <div className="card bg-white/90 backdrop-blur-sm border border-white/30">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-1 bg-gradient-to-br from-electric-500 to-cyber-500 rounded-lg">
                  <Sparkles className="text-white" size={16} />
                </div>
                <h4 className="text-lg font-bold text-dark-800">
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
            <div className="card bg-white/90 backdrop-blur-sm border border-white/30">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-1 bg-gradient-to-br from-mint-500 to-electric-500 rounded-lg">
                  <MapPin className="text-white" size={16} />
                </div>
                <h4 className="text-lg font-bold text-dark-800">
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
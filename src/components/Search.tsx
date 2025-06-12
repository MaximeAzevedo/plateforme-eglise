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
    <div className="card-dune mb-8">
      {/* Header principal avec recherche modernisé */}
      <div className="space-y-6">
        {/* Titre de section avec emoji */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent-gradient rounded-lg shadow-soft">
            <SearchIcon className="text-white" size={18} />
          </div>
          <h2 className="text-title font-heading text-xs font-semibold">
            Trouvez un lieu pour passer un temps avec Dieu
          </h2>
          <Sparkles size={16} className="text-accent animate-pulse-soft" />
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barre de recherche avec effet glassmorphism */}
          <div className="flex-1 relative group">
            <div className={`absolute inset-0 bg-accent-gradient rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${isSearchFocused ? 'opacity-20' : ''}`}></div>
            <div className="relative flex">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <SearchIcon className={`h-4 w-4 transition-colors duration-300 ${isSearchFocused ? 'text-accent' : 'text-gray'}`} />
              </div>
              <input
                type="text"
                placeholder="🔍 Trouvez votre lieu de culte idéal..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="search-input-dune flex-1 pl-11 pr-4 py-3 rounded-l-2xl font-body text-xs placeholder-gray"
              />
              <button
                onClick={() => onSearch(searchQuery)}
                className="search-btn-dune group/btn flex items-center gap-2 relative overflow-hidden px-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <Zap className="h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110" />
                <span className="hidden sm:inline relative z-10 text-xs font-body font-medium">Rechercher</span>
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
              className={`group flex items-center gap-2 px-3 py-3 rounded-xl transition-all duration-300 font-body font-medium ${
                hasActiveEventFilters() || !isAllSelected
                  ? 'bg-warm-gradient border-2 border-accent text-title hover:bg-sand-gradient'
                  : 'btn-dune-secondary hover:border-accent'
              }`}
            >
              <Filter className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-xs font-body font-medium">
                Filtres
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-4 h-4 bg-accent text-white text-xs font-bold rounded-full shadow-soft animate-pulse-soft">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </span>
              <div className="transition-transform duration-300">
                {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </button>
          </div>
        </div>

        {/* Message de géolocalisation avec style moderne */}
        {locationMessage && (
          <div className={`p-4 rounded-2xl border backdrop-blur-sm ${
            locationMessage.includes('trouvée') 
              ? 'message-success border-success/20'
              : 'message-warning border-warning/20'
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
        <div className="mt-8 space-y-8">
          {/* Divider moderne */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            <span className="text-xs font-body font-medium text-text bg-sand-light px-3 py-1 rounded-full border border-border">
              Filtres Avancés
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>

          {/* Filtres par confession avec design moderne */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-title font-heading text-xs font-semibold">
                ⛪ Confessions
              </h3>
              <span className="text-xs text-text bg-sand-light px-2 py-1 rounded-full font-body font-medium">
                {isAllSelected ? 'Toutes' : `${selectedDenominations?.length} sélectionnée(s)`}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSelectAll}
                className={`px-3 py-2 rounded-lg text-xs font-body font-medium transition-all duration-300 transform hover:scale-105 ${
                  isAllSelected
                    ? 'btn-dune-primary'
                    : 'btn-dune-secondary hover:border-accent'
                }`}
              >
                ✨ Toutes
              </button>
              {denominations.map((denom, index) => (
                <button
                  key={denom}
                  onClick={() => handleDenominationToggle(denom)}
                  className={`px-3 py-2 rounded-lg text-xs font-body font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedDenominations?.includes(denom)
                      ? 'btn-dune-primary'
                      : 'btn-dune-secondary hover:border-accent'
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
            <div className="card-dune">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-1 bg-success/20 rounded-lg">
                  <Sparkles className="text-success" size={14} />
                </div>
                <h4 className="text-title font-heading text-xs font-semibold">
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
            <div className="card-dune">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-1 bg-accent/20 rounded-lg">
                  <MapPin className="text-accent" size={14} />
                </div>
                <h4 className="text-title font-heading text-xs font-semibold">
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
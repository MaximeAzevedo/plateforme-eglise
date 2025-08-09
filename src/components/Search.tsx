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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
    <>
      {/* Interface de recherche mobile-first */}
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-3xl shadow-2xl overflow-hidden">
        {/* Section de recherche principale optimisée mobile */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Barre de recherche mobile-first */}
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Ville, adresse, code postal..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full px-5 py-4 sm:px-6 pr-14 rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm text-gray-800 font-medium placeholder:text-gray-500 transition-all duration-300 focus:border-amber-400 focus:ring-4 focus:ring-amber-100/50 focus:bg-white text-base ${
                  isSearchFocused ? 'scale-[1.01] shadow-xl' : 'hover:border-gray-300'
                }`}
                style={{ fontSize: '16px' }} // Évite le zoom sur iOS
              />
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
            </div>

            {/* Boutons d'action mobile optimisés */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Bouton géolocalisation */}
              <button
                type="button"
                onClick={handleQuickLocation}
                className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ minHeight: '56px' }}
              >
                <MapPin className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-base sm:text-sm">Près de moi</span>
                <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full"></div>
                <span className="hidden sm:inline text-sm opacity-80">GPS</span>
              </button>
              
              {/* Bouton filtres mobile */}
              <button
                onClick={() => {
                  setShowAdvancedFilters(!showAdvancedFilters);
                  setShowMobileFilters(!showMobileFilters);
                }}
                className={`group flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                  hasActiveEventFilters() || !isAllSelected
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-white/90 border-2 border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                }`}
                style={{ minHeight: '56px' }}
              >
                <SlidersHorizontal className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="text-base sm:text-sm">
                  Filtres
                  {getActiveFiltersCount() > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-white/30 rounded-full text-xs font-bold">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </span>
                {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Message de géolocalisation mobile-friendly */}
          {locationMessage && (
            <div className={`mt-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
              locationMessage.includes('trouvée') 
                ? 'bg-green-50 border-green-200 text-green-800'
                : locationMessage.includes('Recherche')
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {locationMessage.includes('Recherche') ? (
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <MapPin size={20} />
                  )}
                </div>
                <span className="font-medium text-sm leading-relaxed">{locationMessage}</span>
              </div>
            </div>
          )}
        </div>

        {/* Section des filtres avancés mobile-optimisée */}
        {showAdvancedFilters && (
          <div className="border-t border-gray-200/50 bg-gradient-to-b from-gray-50/80 to-white/80 backdrop-blur-sm">
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Filtres par confession - Layout mobile */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span>Confessions</span>
                  {/* Bouton réinitialiser sur mobile */}
                  {!isAllSelected && (
                    <button
                      onClick={handleSelectAll}
                      className="ml-auto text-sm text-amber-600 hover:text-amber-700 font-medium underline"
                    >
                      Réinitialiser
                    </button>
                  )}
                </h4>
                
                {/* Grid responsive pour les confessions */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <button
                    onClick={handleSelectAll}
                    className={`col-span-2 sm:col-span-1 p-3 rounded-xl font-medium transition-all duration-300 text-sm ${
                      isAllSelected
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                    style={{ minHeight: '52px' }}
                  >
                    Toutes
                  </button>
                  {denominations.map(denomination => (
                    <button
                      key={denomination}
                      onClick={() => handleDenominationToggle(denomination)}
                      className={`p-3 rounded-xl font-medium transition-all duration-300 text-xs sm:text-sm hover:scale-105 active:scale-95 ${
                        selectedDenominations?.includes(denomination)
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                          : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                      }`}
                      style={{ minHeight: '52px' }}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <span className="font-semibold leading-tight text-center">
                          {denominationLabels[denomination].replace('Confession : ', '')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtres avancés - Stack mobile */}
              <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
                {/* Filtres par type d'événement */}
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900">
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
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="text-base font-bold text-gray-900">
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

              {/* Bouton fermer filtres sur mobile */}
              <div className="sm:hidden pt-4 border-t border-gray-200/50">
                <button
                  onClick={() => {
                    setShowAdvancedFilters(false);
                    setShowMobileFilters(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-2xl font-semibold shadow-lg transition-all duration-300 active:scale-95"
                >
                  <X className="h-5 w-5" />
                  <span>Fermer les filtres</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay mobile pour filtres */}
      {showMobileFilters && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 sm:hidden"
          onClick={() => {
            setShowAdvancedFilters(false);
            setShowMobileFilters(false);
          }}
        />
      )}
    </>
  );
};

export default Search;
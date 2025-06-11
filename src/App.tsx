import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { WorshipPlace, Denomination, EventFilter, CelebrationType } from './types';
import { filterPlacesByEvents } from './utils/filterUtils';
import { parseScheduleString } from './utils/scheduleParser';
import Header from './components/Header';
import Search from './components/Search';
import MapView from './components/MapView';
import PlacesList from './components/PlacesList';
import UpcomingCelebrations from './components/UpcomingCelebrations';
import Footer from './components/Footer';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function mapDenomination(denomination: string): Denomination {
  const denominationMap: Record<string, Denomination> = {
    'Catholique': 'Catholic',
    'Protestant': 'Protestant',
    'Orthodoxe': 'Orthodox',
    'Évangélique': 'Evangelical',
    'Pentecôtiste': 'Pentecostal',
    'Baptiste': 'Baptist',
    'Néo apostolique': 'Neo-Apostolic',
    'Néo-apostolique': 'Neo-Apostolic'
  };
  return denominationMap[denomination] || 'Other';
}

function isValidCoordinate(coord: any): boolean {
  const num = parseFloat(coord);
  return !isNaN(num) && isFinite(num);
}

function transformSupabaseData(data: any[]): WorshipPlace[] {
  return data
    .filter(place => {
      // Filter out places with invalid coordinates
      const hasValidCoordinates = isValidCoordinate(place.Latitude) && isValidCoordinate(place.Longitude);
      if (!hasValidCoordinates) {
        console.warn(`Place with ID ${place.id} skipped due to invalid coordinates:`, {
          latitude: place.Latitude,
          longitude: place.Longitude
        });
      }
      return hasValidCoordinates;
    })
    .map(place => {
      // Traitement des horaires JSON
      let serviceTimes = 'Horaires non disponibles';
      try {
        if (place['Heures des cultes et prières']) {
          const schedules = typeof place['Heures des cultes et prières'] === 'string' 
            ? JSON.parse(place['Heures des cultes et prières'])
            : place['Heures des cultes et prières'];
          
          if (Array.isArray(schedules) && schedules.length > 0) {
            serviceTimes = schedules.map(schedule => 
              `${schedule.type} - ${schedule.day} ${schedule.startTime}-${schedule.endTime}`
            ).join('; ');
          }
        }
      } catch (error) {
        console.warn('Erreur parsing horaires pour', place.Nom, error);
        serviceTimes = place['Horaires d\'ouverture (général)'] || 'Horaires non disponibles';
      }

      return {
        id: place.id,
        name: place.Nom || place.Dénomination,
        denomination: mapDenomination(place.Dénomination),
        address: place.Rue,
        postalCode: place['Code Postal']?.toString(),
        city: place.Ville,
        serviceTimes: serviceTimes,
        contactInfo: 'Contact non disponible',
        website: place['Site Web'] || undefined,
        position: [parseFloat(place.Latitude), parseFloat(place.Longitude)]
      };
    });
}

function App() {
  const [places, setPlaces] = useState<WorshipPlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<WorshipPlace[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDenominations, setSelectedDenominations] = useState<Denomination[] | null>(null);
  const [eventFilter, setEventFilter] = useState<EventFilter>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([49.1193, 6.1757]);
  const [mapBounds, setMapBounds] = useState<[[number, number], [number, number]] | undefined>();
  const [shouldCenterMap, setShouldCenterMap] = useState<[number, number] | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 Tentative de connexion à Supabase...');
        console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
        console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Présente' : 'Manquante');
        
        // Test avec fetch direct en cas de problème avec le client Supabase
        try {
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/BDD?select=*`, {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Fetch direct réussi:', data?.length, 'éléments');
            
            const transformedData = transformSupabaseData(data);
            setPlaces(transformedData);
            setFilteredPlaces(transformedData);
            setIsLoading(false);
            return;
          }
        } catch (fetchError) {
          console.log('❌ Fetch direct échoué, essai avec client Supabase...');
        }
        
        const { data, error } = await supabase
          .from('BDD')
          .select('*');

        console.log('📊 Réponse Supabase:', { data, error });

        if (error) {
          console.error('❌ Erreur Supabase:', error);
          throw error;
        }

        console.log('✅ Données reçues:', data?.length, 'éléments');
        const transformedData = transformSupabaseData(data);
        
        if (transformedData.length === 0) {
          setError('Aucun lieu de culte avec des coordonnées valides n\'a été trouvé');
          return;
        }

        setPlaces(transformedData);
        setFilteredPlaces(transformedData);
      } catch (err) {
        console.error('💥 Erreur complète:', err);
        setError('Une erreur est survenue lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = places;
    
    // Filtrage par dénominations (sélection multiple)
    if (selectedDenominations && selectedDenominations.length > 0) {
      result = result.filter(place => selectedDenominations.includes(place.denomination));
    }
    
    // Filtrage par recherche textuelle (uniquement adresses, noms, villes)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(place => 
        place.name.toLowerCase().includes(query) || 
        place.city.toLowerCase().includes(query) ||
        place.address.toLowerCase().includes(query)
      );
    }
    
    // Filtrage par événements (types uniquement pour l'instant)
    if (eventFilter.types && eventFilter.types.length > 0) {
      result = result.filter(place => {
        const schedules = parseScheduleString(place.serviceTimes);
        return schedules.some(schedule => 
          eventFilter.types!.includes(schedule.type as CelebrationType)
        );
      });
    }
    
    setFilteredPlaces(result);
  }, [searchQuery, selectedDenominations, eventFilter, places]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleDenominationFilter = (denominations: Denomination[] | null) => {
    setSelectedDenominations(denominations);
  };

  const handleEventFilter = (filter: EventFilter) => {
    setEventFilter(filter);
  };

  const handleMapMove = (center: [number, number], bounds: [[number, number], [number, number]]) => {
    setMapCenter(center);
    setMapBounds(bounds);
    // Reset the shouldCenterMap when user moves the map manually
    setShouldCenterMap(null);
  };

  const handlePlaceClick = (position: [number, number], placeName: string) => {
    setShouldCenterMap(position);
    console.log(`Centrage sur: ${placeName}`);
  };

  const handleLocationFound = (position: [number, number]) => {
    setShouldCenterMap(position);
    setMapCenter(position);
    setCurrentLocation(position);
    console.log(`Géolocalisation: ${position[0]}, ${position[1]}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-primary via-white to-bg-secondary">
        <div className="text-center space-y-6 animate-fade-in">
          {/* Loading spinner moderne */}
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent bg-gradient-to-r from-cyber-500 to-electric-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-white animate-spin mx-auto"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-cyber-500 to-electric-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">⛪</span>
            </div>
          </div>
          
          {/* Texte de chargement */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyber-600 to-electric-600 bg-clip-text text-transparent">
              Chargement en cours...
            </h2>
            <p className="text-dark-600 font-medium">
              🔍 Récupération des lieux de culte
            </p>
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-cyber-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-electric-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-cyber-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-primary via-white to-bg-secondary">
        <div className="text-center space-y-6 animate-fade-in max-w-md mx-auto px-6">
          {/* Icône d'erreur */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-hot-500 to-neon-500 rounded-full flex items-center justify-center mx-auto shadow-glow">
              <span className="text-3xl">⚠️</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-dark-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">!</span>
            </div>
          </div>
          
          {/* Message d'erreur */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-dark-800">
              Oups ! Un problème est survenu
            </h2>
            <div className="bg-hot-50 border border-hot-200 rounded-2xl p-4">
              <p className="text-hot-800 font-medium text-sm">
                {error}
              </p>
            </div>
            
            {/* Suggestions d'action */}
            <div className="space-y-3">
              <p className="text-dark-600">
                💡 Que faire maintenant ?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-6 py-3 bg-gradient-to-r from-cyber-500 to-electric-500 text-white rounded-2xl hover:from-cyber-600 hover:to-electric-600 transition-all duration-300 shadow-glow hover:shadow-glow-lg transform hover:scale-105 font-semibold"
                >
                  🔄 Réessayer
                </button>
                <button 
                  onClick={() => window.history.back()} 
                  className="px-6 py-3 bg-white border-2 border-gray-200 text-dark-700 rounded-2xl hover:border-cyber-300 transition-all duration-300 shadow-elevated hover:shadow-float font-semibold"
                >
                  ← Retour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-6 py-8 space-y-8">
        <Search 
          places={places}
          onSearch={handleSearch} 
          onDenominationFilter={handleDenominationFilter}
          onEventFilter={handleEventFilter}
          selectedDenominations={selectedDenominations}
          eventFilter={eventFilter}
          onLocationFound={handleLocationFound}
          currentLocation={currentLocation}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Prochaines célébrations */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <UpcomingCelebrations 
              places={filteredPlaces}
              mapCenter={mapCenter}
              mapBounds={mapBounds}
              onPlaceClick={handlePlaceClick}
              timeFilter={eventFilter.dateTimeFilter}
            />
          </div>
          
          {/* Carte */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <MapView 
              places={filteredPlaces} 
              selectedDenomination={selectedDenominations?.[0] || null}
              onMapMove={handleMapMove}
              centerOnPosition={shouldCenterMap}
            />
          </div>
        </div>
        
        <PlacesList places={filteredPlaces} />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
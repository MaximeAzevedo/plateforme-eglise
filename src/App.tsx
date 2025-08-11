import React, { useState, useEffect } from 'react';
import { WorshipPlace, Denomination, EventFilter, CelebrationType } from './types';
import { filterPlacesByEvents } from './utils/filterUtils';
import { parseScheduleString } from './utils/scheduleParser';
import Header from './components/Header';
import Search from './components/Search';
import MapView from './components/MapView';
import WhoWeAreFor from './components/WhoWeAreFor';
import Contribution from './components/Contribution';
import UpcomingCelebrations from './components/UpcomingCelebrations';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ContributionHub from './components/ContributionHub';
import TestimonyGallery from './components/TestimonyGallery';
import PrayerWall from './components/PrayerWall';
import { AdminPage } from './components/admin/AdminPage';
import { supabase, supabaseConfig } from './lib/supabase';

// Simple router - vérifie le hash de l'URL
function getCurrentPage(): string {
  const hash = window.location.hash.slice(1); // Retire le #
  return hash || 'home';
}

function mapDenomination(denomination: string): Denomination {
  const denominationMap: Record<string, Denomination> = {
    'Confession : Catholique': 'Catholic',
    'Catholique': 'Catholic',
    'Confession : Protestante': 'Protestant', 
    'Protestant': 'Protestant',
    'Confession : Orthodoxe': 'Orthodox',
    'Orthodoxe': 'Orthodox',
    'Confession : Évangélique': 'Evangelical',
    'Évangélique': 'Evangelical',
    'Confession : Pentecôtiste': 'Pentecostal',
    'Pentecôtiste': 'Pentecostal',
    'Confession : Baptiste': 'Baptist',
    'Baptiste': 'Baptist',
    'Confession : Néo-apostolique': 'Neo-Apostolic',
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
  if (!data || data.length === 0) {
    return [];
  }
  
  return data
    .filter(place => {
      // Filter out places with invalid coordinates
      const hasValidCoordinates = isValidCoordinate(place.Latitude) && isValidCoordinate(place.Longitude);
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
          } else {
            console.warn(`⚠️ Horaires vides pour ${place.Nom}`);
          }
        } else {
          console.warn(`⚠️ Pas d'horaires JSON pour ${place.Nom}`);
        }
      } catch (error) {
        console.warn('Erreur parsing horaires pour', place.Nom, error);
        serviceTimes = place['Horaires d\'ouverture (général)'] || 'Horaires non disponibles';
      }

      const transformedPlace = {
        id: place.id,
        name: place.Nom || place.Dénomination,
        denomination: mapDenomination(place.Dénomination),
        address: place.Rue,
        postalCode: place['Code Postal']?.toString(),
        city: place.Ville,
        serviceTimes: serviceTimes,
        contactInfo: 'Contact non disponible',
        website: place['Site Web'] || undefined,
        position: [parseFloat(place.Latitude), parseFloat(place.Longitude)] as [number, number]
      };
      
      return transformedPlace;
    });
}

function App() {
  const [currentPage, setCurrentPage] = useState(getCurrentPage());
  const [worshipPlaces, setWorshipPlaces] = useState<WorshipPlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<WorshipPlace[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDenomination, setSelectedDenomination] = useState<Denomination | ''>('');
  const [eventFilter, setEventFilter] = useState<EventFilter>({ enabled: false, types: [] });
  const [selectedPlace, setSelectedPlace] = useState<WorshipPlace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.2276, 2.2137]);
  const [mapZoom, setMapZoom] = useState(6);
  const [shouldCenterMap, setShouldCenterMap] = useState(false);
  const [showContributeForm, setShowContributeForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 🎯 NOUVEAUX ÉTATS POUR LA VUE MOBILE
  const [viewMode, setViewMode] = useState<'home' | 'map' | 'list' | 'celebrations'>('home');
  const [showPlacePopup, setShowPlacePopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);
  const [showTestimonyGallery, setShowTestimonyGallery] = useState(false);
  const [showPrayerWall, setShowPrayerWall] = useState(false);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fonction pour calculer la distance entre deux points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Fonction pour obtenir les églises triées par proximité
  const getNearbyPlaces = (selectedPlace: WorshipPlace): WorshipPlace[] => {
    if (!selectedPlace) return filteredPlaces;
    
    return filteredPlaces
      .filter(place => place.id !== selectedPlace.id)
      .sort((a, b) => {
        const distanceA = calculateDistance(
          selectedPlace.position[0], selectedPlace.position[1],
          a.position[0], a.position[1]
        );
        const distanceB = calculateDistance(
          selectedPlace.position[0], selectedPlace.position[1],
          b.position[0], b.position[1]
        );
        return distanceA - distanceB;
      });
  };

  // Navigation entre églises
  const navigateToPlace = (direction: 'prev' | 'next') => {
    if (!selectedPlace) return;
    
    const currentIndex = filteredPlaces.findIndex(place => place.id === selectedPlace.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredPlaces.length;
    } else {
      newIndex = currentIndex - 1 < 0 ? filteredPlaces.length - 1 : currentIndex - 1;
    }
    
    setSelectedPlace(filteredPlaces[newIndex]);
    setCurrentPlaceIndex(newIndex);
  };

  // Vérification de la configuration Supabase (non-bloquante)
  useEffect(() => {
    console.log('🔧 État configuration Supabase:', supabaseConfig);
    if (!supabaseConfig.isConfigured) {
      console.warn('⚠️ Configuration Supabase incomplète', supabaseConfig);
    }
    if (!supabaseConfig.canAttemptConnection) {
      console.error('❌ Impossible de tenter une connexion Supabase');
    }
  }, []);

  // Écouter les changements d'URL
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getCurrentPage());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 === DÉBUT DEBUG VERCEL ===');
        console.log('🔍 Tentative de connexion à Supabase...');
        console.log('🔧 Configuration complète:', {
          ...supabaseConfig,
          nodeEnv: process.env.NODE_ENV,
          vitMode: import.meta.env.MODE,
          isDev: import.meta.env.DEV,
          isProd: import.meta.env.PROD,
          baseUrl: import.meta.env.BASE_URL
        });
        
        // Log très détaillé de l'environnement
        if (import.meta.env.PROD) {
          console.log('🚀 Environnement PRODUCTION détecté');
          console.log('🔧 URL Supabase présente:', !!import.meta.env.VITE_SUPABASE_URL);
          console.log('🔧 Key Supabase présente:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
        }
        
        // Vérification plus permissive en développement
        if (!supabaseConfig.canAttemptConnection) {
          console.warn('⚠️ Impossible de se connecter à Supabase, mode démo activé');
          console.log('🔧 Détails config:', supabaseConfig);
          setWorshipPlaces([]);
          setFilteredPlaces([]);
          setIsLoading(false);
          return;
        }
        
        if (!supabaseConfig.isConfigured) {
          console.warn('⚠️ Configuration Supabase incomplète mais tentative de connexion...');
        }
        
        console.log('🎯 Tentative de requête Supabase...');
        const { data, error } = await supabase
          .from('BDD')
          .select('*');

        console.log('📊 === RÉSULTAT SUPABASE ===');
        console.log('📊 Données reçues:', data?.length || 0, 'éléments');
        console.log('📊 Erreur:', error);
        console.log('📊 Premier élément:', data?.[0]);

        if (error) {
          console.error('❌ Erreur Supabase détaillée:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }

        console.log('🔧 Transformation des données...');
        const transformedData = transformSupabaseData(data);
        console.log('✅ Données transformées:', transformedData.length, 'lieux valides');
        
        if (transformedData.length === 0) {
          console.warn('⚠️ Aucun lieu de culte avec des coordonnées valides');
          setError('Aucun lieu de culte avec des coordonnées valides n\'a été trouvé');
          return;
        }

        setWorshipPlaces(transformedData);
        setFilteredPlaces(transformedData);
        console.log('🎉 === CHARGEMENT RÉUSSI ===');
      } catch (err) {
        console.error('💥 === ERREUR COMPLÈTE ===');
        console.error('�� Type:', typeof err);
        console.error('💥 Message:', err.message);
        console.error('💥 Stack:', err.stack);
        console.error('💥 Objet complet:', err);
        setError('Une erreur est survenue lors du chargement des données');
      } finally {
        setIsLoading(false);
        console.log('🏁 === FIN DEBUG VERCEL ===');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = worshipPlaces;
    
    // Filtrage par dénominations (sélection multiple)
    if (selectedDenomination && selectedDenomination !== '') {
      result = result.filter(place => place.denomination === selectedDenomination);
    }
    
    // Filtrage par recherche textuelle (uniquement adresses, noms, villes)
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
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
  }, [searchTerm, selectedDenomination, eventFilter, worshipPlaces]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };
  
  const handleDenominationFilter = (denomination: Denomination | '') => {
    setSelectedDenomination(denomination);
  };

  const handleEventFilter = (filter: EventFilter) => {
    setEventFilter(filter);
  };

  const handleMapMove = (center: [number, number], bounds: [[number, number], [number, number]]) => {
    setMapCenter(center);
    // setMapBounds(bounds); // This line was removed from the new_code, so it's removed here.
    // Reset the shouldCenterMap when user moves the map manually
    setShouldCenterMap(false);
  };

  const handlePlaceClick = (position: [number, number], placeName: string) => {
    setShouldCenterMap(true);
    console.log(`Centrage sur: ${placeName}`);
  };

  const handleLocationFound = (position: [number, number]) => {
    setShouldCenterMap(true);
    setMapCenter(position);
    // setCurrentLocation(position); // This line was removed from the new_code, so it's removed here.
    console.log(`Géolocalisation: ${position[0]}, ${position[1]}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Chargement de GOD × CONNECT...</p>
        </div>
      </div>
    );
  }

  // Affichage d'erreur de configuration
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900">
        <div className="text-center text-white max-w-lg mx-auto p-8">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Erreur de Configuration</h1>
          <p className="text-lg mb-6 opacity-90">{error}</p>
          <div className="bg-white/10 rounded-lg p-4 text-sm text-left">
            <p className="font-semibold mb-2">Pour les développeurs :</p>
            <ul className="space-y-1 opacity-90">
              <li>• Vérifiez les variables d'environnement Vercel</li>
              <li>• VITE_SUPABASE_URL doit être définie</li>
              <li>• VITE_SUPABASE_ANON_KEY doit être définie</li>
              <li>• Redéployez après modification</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-white text-red-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  // Rendu conditionnel selon la page
  if (currentPage === 'admin') {
    return <AdminPage />;
  }

  // Page de debug pour tester les variables d'environnement Vercel
  if (currentPage === 'debug') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">🔧 Debug Vercel - Variables d'environnement</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations générales */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📊 Informations générales</h2>
              <pre className="text-sm bg-gray-700 p-4 rounded overflow-auto">
{JSON.stringify({
  nodeEnv: typeof process !== 'undefined' ? process.env.NODE_ENV : 'undefined',
  vitMode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  isSSR: import.meta.env.SSR,
  baseUrl: import.meta.env.BASE_URL,
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent.substring(0, 100) + '...'
}, null, 2)}
              </pre>
            </div>

            {/* Variables Supabase */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🔑 Variables Supabase</h2>
              <pre className="text-sm bg-gray-700 p-4 rounded overflow-auto">
{JSON.stringify({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 
    `${import.meta.env.VITE_SUPABASE_URL.substring(0, 30)}...` : 
    '❌ NON DÉFINIE',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 
    `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 30)}...` : 
    '❌ NON DÉFINIE',
  configState: supabaseConfig
}, null, 2)}
              </pre>
            </div>

            {/* Test de connexion */}
            <div className="bg-gray-800 rounded-lg p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">🧪 Test de connexion Supabase</h2>
              <button 
                onClick={async () => {
                  const testDiv = document.getElementById('test-result');
                  if (!testDiv) return;
                  
                  testDiv.innerHTML = '⏳ Test en cours...';
                  
                  try {
                    console.log('🧪 Test de connexion Supabase depuis Vercel...');
                    
                    const { data, error } = await supabase
                      .from('BDD')
                      .select('count(*)', { count: 'exact', head: true });
                    
                    testDiv.innerHTML = `<pre class="text-green-400">${JSON.stringify({
                      success: true,
                      count: data?.length || 0,
                      error: error || null,
                      timestamp: new Date().toISOString()
                    }, null, 2)}</pre>`;
                  } catch (err) {
                    testDiv.innerHTML = `<pre class="text-red-400">${JSON.stringify({
                      success: false,
                      error: err.message,
                      stack: err.stack?.substring(0, 200) + '...',
                      timestamp: new Date().toISOString()
                    }, null, 2)}</pre>`;
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-4"
              >
                🧪 Tester la connexion Supabase
              </button>
              <div id="test-result" className="bg-gray-700 p-4 rounded">
                Cliquez sur le bouton pour tester
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">📋 Instructions</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Vérifiez que les variables Supabase sont bien définies ci-dessus</li>
                <li>Testez la connexion avec le bouton</li>
                <li>Si les variables sont ❌ NON DÉFINIE, vérifiez la configuration Vercel</li>
                <li>Si la connexion échoue, vérifiez les valeurs des variables</li>
              </ol>
              <div className="mt-4 text-sm opacity-75">
                Pour revenir à l'app: <a href="/" className="text-blue-400 underline">retour accueil</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Page principale
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - toujours visible mais adapté selon le mode */}
      <Header 
        placesCount={worshipPlaces.length}
        onContributeClick={() => setShowContributeForm(true)}
        onTestimonyClick={() => setShowTestimonyGallery(true)}
        onPrayerWallClick={() => setShowPrayerWall(true)}
        supabase={supabase}
        currentView={viewMode}
        onViewChange={setViewMode}
        isMobile={isMobile}
      />
      
      {/* EXPÉRIENCE MOBILE - CARTE PLEIN ÉCRAN */}
      {isMobile && viewMode === 'map' && (
        <div className="fixed inset-0 top-14 z-40 bg-white">
          {/* Overlay de recherche en haut */}
          <div className="absolute top-4 left-4 right-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100">
              <Search 
                places={worshipPlaces}
                onSearch={handleSearch} 
                onDenominationFilter={handleDenominationFilter}
                onEventFilter={handleEventFilter}
                selectedDenominations={selectedDenomination}
                eventFilter={eventFilter}
                onLocationFound={handleLocationFound}
                currentLocation={null}
                isMapOverlay={true}
              />
            </div>
          </div>

          {/* Carte plein écran */}
          <div className="h-full w-full">
            <MapView 
              places={filteredPlaces} 
              selectedDenomination={selectedDenomination}
              onMapMove={handleMapMove}
              centerOnPosition={shouldCenterMap}
              onPlaceClick={(place) => {
                setSelectedPlace(place);
                setShowPlacePopup(true);
              }}
              isFullScreen={true}
            />
          </div>

          {/* Popup en bas quand un lieu est sélectionné */}
          {showPlacePopup && selectedPlace && (
            <div className="absolute bottom-0 left-0 right-0 z-50">
              <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-200 p-4 transform transition-transform duration-300 ease-out">
                {/* Poignée de drag */}
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3"></div>
                
                {/* Navigation entre églises */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => navigateToPlace('prev')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={filteredPlaces.length <= 1}
                  >
                    ←
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {filteredPlaces.slice(0, Math.min(5, filteredPlaces.length)).map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === filteredPlaces.findIndex(place => place.id === selectedPlace.id)
                            ? 'bg-amber-500'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                    {filteredPlaces.length > 5 && (
                      <span className="text-xs text-gray-500 ml-2">
                        {filteredPlaces.findIndex(place => place.id === selectedPlace.id) + 1}/{filteredPlaces.length}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => navigateToPlace('next')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    disabled={filteredPlaces.length <= 1}
                  >
                    →
                  </button>
                </div>
                
                {/* Contenu du popup */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-2">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-gray-900 flex-1">
                          {selectedPlace.name}
                        </h3>
                        <div className="ml-2 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                          {selectedPlace.denomination}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {selectedPlace.address}, {selectedPlace.city}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPlacePopup(false)}
                      className="p-1.5 hover:bg-gray-100 rounded-full ml-2"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    <p><strong>Horaires :</strong> {selectedPlace.serviceTimes}</p>
                  </div>
                  
                  <div className="flex space-x-3 pt-1">
                    <button 
                      onClick={() => {
                        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.position[0]},${selectedPlace.position[1]}`;
                        window.open(googleMapsUrl, '_blank');
                      }}
                      className="flex-1 bg-amber-500 text-white py-2.5 rounded-xl font-medium hover:bg-amber-600 transition-colors"
                    >
                      📍 Itinéraire
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                      📞 Contacter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EXPÉRIENCE DESKTOP OU VUE HOME */}
      {(!isMobile || viewMode === 'home') && (
        <main className="flex-grow">
          <Hero 
            onExploreClick={() => {
              const searchSection = document.getElementById('search-section');
              if (searchSection) {
                searchSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onMapClick={() => {
              if (isMobile) {
                setViewMode('map');
              } else {
                const searchSection = document.getElementById('search-section');
                if (searchSection) {
                  searchSection.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
            onTestimonyClick={() => {
              setShowTestimonyGallery(true);
            }}
            onPrayerClick={() => {
              setShowPrayerWall(true);
            }}
          />
          
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              {/* Section de recherche moderne avec ID pour le scroll - DESKTOP SEULEMENT */}
              {!isMobile && (
                <section id="search-section" className="space-y-8">
                  {/* Titre de section moderne */}
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                      Découvrez votre communauté spirituelle
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full"></div>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                      Trouvez facilement les lieux de culte près de chez vous et connectez-vous avec une communauté qui partage votre foi.
                    </p>
                  </div>

                  {/* Zone de recherche épurée */}
                  <div className="max-w-5xl mx-auto">
                    <Search 
                      places={worshipPlaces}
                      onSearch={handleSearch} 
                      onDenominationFilter={handleDenominationFilter}
                      onEventFilter={handleEventFilter}
                      selectedDenominations={selectedDenomination}
                      eventFilter={eventFilter}
                      onLocationFound={handleLocationFound}
                      currentLocation={null}
                      isMapOverlay={false}
                    />
                  </div>
                </section>
              )}
            
            {/* Section carte et résultats moderne - SEULEMENT SUR DESKTOP */}
            {!isMobile && (
              <section className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Explorez la carte interactive
                  </h3>
                  <p className="text-gray-600">
                    {filteredPlaces.length} lieu{filteredPlaces.length > 1 ? 'x' : ''} de culte trouvé{filteredPlaces.length > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="flex flex-col lg:grid lg:grid-cols-4 gap-0">
                    {/* Carte principale - EN PREMIER sur mobile */}
                    <div className="order-1 lg:order-2 lg:col-span-3">
                      <div className="p-3 sm:p-6">
                        <MapView 
                          places={filteredPlaces} 
                          selectedDenomination={selectedDenomination}
                          onMapMove={handleMapMove}
                          centerOnPosition={shouldCenterMap}
                          onPlaceClick={(place) => {
                            setSelectedPlace(place);
                          }}
                          isFullScreen={false}
                        />
                      </div>
                    </div>
                    
                    {/* Sidebar - Prochaines célébrations - EN SECOND sur mobile */}
                    <div className="order-2 lg:order-1 lg:col-span-1 bg-gray-50/50 border-t lg:border-t-0 lg:border-r border-gray-100">
                      <div className="p-4 sm:p-6">
                        <div className="lg:hidden mb-4 text-center">
                          <h4 className="text-lg font-bold text-gray-900">Prochaines célébrations</h4>
                          <p className="text-sm text-gray-600">Scroll horizontal pour voir plus</p>
                        </div>
                        <UpcomingCelebrations 
                          places={filteredPlaces}
                          mapCenter={mapCenter}
                          mapBounds={null}
                          onPlaceClick={handlePlaceClick}
                          timeFilter={eventFilter.dateTimeFilter}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
            </div>
          </section>
          
          {!isMobile && <WhoWeAreFor />}
          
          {!isMobile && <Contribution onAddPlace={() => setShowContributeForm(true)} />}
        </main>
      )}
      
      {!isMobile && <Footer />}
      
      {/* Modal de contribution */}
      <ContributionHub 
        isOpen={showContributeForm}
        onClose={() => setShowContributeForm(false)}
        supabase={supabase}
      />

      {/* Modal de témoignages */}
      <TestimonyGallery 
        isOpen={showTestimonyGallery}
        onClose={() => setShowTestimonyGallery(false)}
        supabase={supabase}
      />

      {/* Mur des prières */}
      <PrayerWall 
        isOpen={showPrayerWall}
        onClose={() => setShowPrayerWall(false)}
        supabase={supabase}
      />
    </div>
  );
}

export default App;
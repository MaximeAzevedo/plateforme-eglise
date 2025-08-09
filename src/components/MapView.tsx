import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { WorshipPlace, Denomination } from '../types';
import { Globe, MapPin, Clock, ExternalLink, Star, Navigation, Church, Cross, Heart, Flame, Waves, Bird, Plus, Minus, Locate, RotateCcw } from 'lucide-react';
import { divIcon } from 'leaflet';

interface MapViewProps {
  places: WorshipPlace[];
  selectedDenomination: Denomination | null;
  onMapMove?: (center: [number, number], bounds: [[number, number], [number, number]]) => void;
  centerOnPosition?: [number, number] | null;
}

const MapEventHandler = ({ onMapMove }: { onMapMove?: (center: [number, number], bounds: [[number, number], [number, number]]) => void }) => {
  const map = useMapEvents({
    moveend: () => {
      if (onMapMove) {
        const center = map.getCenter();
        const bounds = map.getBounds();
        onMapMove(
          [center.lat, center.lng],
          [
            [bounds.getSouth(), bounds.getWest()],
            [bounds.getNorth(), bounds.getEast()]
          ]
        );
      }
    },
    zoomend: () => {
      if (onMapMove) {
        const center = map.getCenter();
        const bounds = map.getBounds();
        onMapMove(
          [center.lat, center.lng],
          [
            [bounds.getSouth(), bounds.getWest()],
            [bounds.getNorth(), bounds.getEast()]
          ]
        );
      }
    }
  });

  return null;
};

const ChangeMapView = ({ places }: { places: WorshipPlace[] }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (places.length > 0) {
      const latitudes = places.map(p => p.position[0]);
      const longitudes = places.map(p => p.position[1]);
      
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);
      
      map.fitBounds([
        [minLat, minLng],
        [maxLat, maxLng]
      ], { padding: [20, 20] }); // Padding pour mobile
    }
  }, [places, map]);
  
  return null;
};

const CenterMapOnClick = ({ center }: { center?: [number, number] | null }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (center) {
      map.setView(center, 15, { animate: true });
    }
  }, [center, map]);
  
  return null;
};

// Hook pour contrôler la carte depuis l'extérieur
const MapControlHandler = () => {
  const map = useMap();
  
  React.useEffect(() => {
    // Stocker l'instance de carte globalement pour les contrôles
    (window as any).mapInstance = map;
    
    return () => {
      (window as any).mapInstance = null;
    };
  }, [map]);
  
  return null;
};

const denominationLabels: Record<Denomination, string> = {
  'Catholic': 'Confession : Catholique',
  'Protestant': 'Confession : Protestante',
  'Orthodox': 'Confession : Orthodoxe',
  'Evangelical': 'Confession : Évangélique',
  'Pentecostal': 'Confession : Pentecôtiste',
  'Baptist': 'Confession : Baptiste',
  'Neo-Apostolic': 'Confession : Néo-apostolique',
  'Other': 'Confession : Autre'
};

// Configuration Dune pour les confessions
const denominationConfig: Record<Denomination, { emoji: string; color: string }> = {
  'Catholic': { emoji: '⛪', color: 'bg-accent' },      // Or doux = Catholique
  'Protestant': { emoji: '✝️', color: 'bg-sand-medium' },   // Sable moyen = Protestante  
  'Orthodox': { emoji: '☦️', color: 'bg-title' },     // Bleu ardoise = Orthodoxe
  'Evangelical': { emoji: '🕊️', color: 'bg-warning' },  // Orange = Évangélique
  'Pentecostal': { emoji: '🔥', color: 'bg-error' },     // Rouge = Pentecôtiste
  'Baptist': { emoji: '💧', color: 'bg-info' },        // Bleu info = Baptiste
  'Neo-Apostolic': { emoji: '🕊️', color: 'bg-text' }, // Gris anthracite = Néo-apostolique
  'Other': { emoji: '🏛️', color: 'bg-success' }         // Vert = Autre / Indépendante
};

const getMarkerColor = (denomination: Denomination): string => {
  const colors: Record<Denomination, string> = {
    'Catholic': '#D3A625',      // Or doux
    'Protestant': '#E3DDD4',    // Sable moyen
    'Evangelical': '#F39C12',   // Orange
    'Orthodox': '#2C3E50',      // Bleu ardoise
    'Neo-Apostolic': '#F39C12', // Orange
    'Pentecostal': '#E74C3C',   // Rouge
    'Baptist': '#3498DB',       // Bleu info
    'Other': '#27AE60'          // Vert
  };
  return colors[denomination];
};

const confessionIcons: Record<Denomination, string> = {
  Catholic: `<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2L2 7v7c0 5 4 9 10 9s10-4 10-9V7z'/><path d='M12 22V12'/><path d='M7 12h10'/></svg>`,
  Protestant: `<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><line x1='12' y1='2' x2='12' y2='22'/><line x1='2' y1='12' x2='22' y2='12'/></svg>`,
  Orthodox: `<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><polygon points='12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2'/></svg>`,
  Evangelical: `<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-8 0v2'/><circle cx='12' cy='7' r='4'/></svg>`,
  Pentecostal: `<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2v20M2 12h20'/></svg>`,
  Baptist: `<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 12c2-2 6-2 8 0s6 2 8 0'/></svg>`,
  'Neo-Apostolic': `<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/></svg>`,
  Other: `<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2L2 7v7c0 5 4 9 10 9s10-4 10-9V7z'/></svg>`
};

const createCustomIcon = (denomination: Denomination) => {
  const iconSvg = confessionIcons[denomination] || confessionIcons.Other;
  const color = getMarkerColor(denomination);
  
  // Marqueur plus grand pour mobile
  const html = `
    <div style="
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${color} 60%, ${color}CC 100%);
      border: 3px solid #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      backdrop-filter: blur(10px);
      transition: transform 0.2s ease;
    ">
      ${iconSvg}
    </div>
  `;
  return divIcon({
    html,
    className: 'custom-marker-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

const MapView: React.FC<MapViewProps> = ({ places, selectedDenomination, onMapMove, centerOnPosition }) => {
  const [isLocating, setIsLocating] = React.useState(false);

  const handleLocateUser = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const map = (window as any).mapInstance;
          if (map) {
            map.setView([position.coords.latitude, position.coords.longitude], 15, {
              animate: true
            });
          }
          setIsLocating(false);
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleResetView = () => {
    const map = (window as any).mapInstance;
    if (map && places.length > 0) {
      const latitudes = places.map(p => p.position[0]);
      const longitudes = places.map(p => p.position[1]);
      
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);
      
      map.fitBounds([
        [minLat, minLng],
        [maxLat, maxLng]
      ], { padding: [20, 20], animate: true });
    }
  };

  return (
    <div className="map-container h-[400px] sm:h-[500px] md:h-[600px] animate-fade-in relative overflow-hidden">
      <MapContainer 
        center={[49.1193, 6.1757]} 
        zoom={12} 
        scrollWheelZoom={true} 
        className="h-full rounded-2xl overflow-hidden"
        zoomControl={false}
        touchZoom={true}
        doubleClickZoom={true}
        dragging={true}
        tap={true}
        trackResize={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEventHandler onMapMove={onMapMove} />
        <CenterMapOnClick center={centerOnPosition} />
        <MapControlHandler />
        
        <MarkerClusterGroup
          chunkedLoading
          animate={true}
          spiderfyOnMaxZoom={true}
          maxClusterRadius={50} // Plus grand pour mobile
          showCoverageOnHover={false}
          iconCreateFunction={(cluster: any) => {
            const count = cluster.getChildCount();
            const size = count < 10 ? 50 : count < 100 ? 60 : 70; // Taille dynamique pour mobile
            return divIcon({
              html: `
                <div style="
                  width: ${size}px;
                  height: ${size}px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);
                  border: 4px solid #fff;
                  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4), 0 0 0 1px rgba(0,0,0,0.1);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  color: #fff;
                  font-size: ${count < 10 ? '1.2rem' : count < 100 ? '1.1rem' : '1rem'};
                  position: relative;
                  backdrop-filter: blur(10px);
                  transition: transform 0.2s ease;
                ">
                  ${count}
                </div>
              `,
              className: 'custom-cluster-icon',
              iconSize: [size, size],
              iconAnchor: [size/2, size/2]
            });
          }}
        >
          {places.map((place) => (
            <Marker 
              key={place.id} 
              position={place.position}
              icon={createCustomIcon(place.denomination)}
            >
              <Popup 
                className="map-popup mobile-popup" 
                closeButton={false} 
                maxWidth={350}
                minWidth={300}
                offset={[0, -10]}
              >
                <div className="bg-white/98 backdrop-blur-xl border border-gray-200/60 rounded-2xl p-5 sm:p-6 min-w-[280px] max-w-[350px] shadow-2xl">
                  {/* Header mobile-optimisé */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl leading-tight pr-2 flex-1">
                      {place.name}
                    </h3>
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  {/* Confession badge */}
                  <div className="mb-4">
                    <div className="inline-flex items-center bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full shadow-sm">
                      <span className="text-gray-800 font-bold text-sm">
                        {denominationLabels[place.denomination].replace('Confession : ', '')}
                      </span>
                    </div>
                  </div>

                  {/* Informations avec icônes modernisées mobile */}
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-700 leading-relaxed font-medium block">
                          {place.address}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {place.city}
                        </span>
                      </div>
                    </div>

                    {place.serviceTimes && (
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-gray-700 leading-relaxed font-medium text-sm block">
                            {place.serviceTimes}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions mobile-optimisées */}
                  <div className="mt-6 space-y-3">
                    {place.website && (
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                        style={{ minHeight: '52px' }}
                      >
                        <Globe className="h-5 w-5" />
                        <span>Voir le site web</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    
                    {/* Bouton directions mobile */}
                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${place.position[0]},${place.position[1]}`;
                        window.open(url, '_blank');
                      }}
                      className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                    >
                      <Navigation className="h-5 w-5" />
                      <span>Itinéraire</span>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        
        <ChangeMapView places={places} />
      </MapContainer>
      
      {/* Contrôles de carte mobile-optimisés */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Bouton localisation */}
        <button 
          className={`w-12 h-12 sm:w-14 sm:h-14 bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 ${
            isLocating ? 'bg-blue-50 border-blue-300' : 'hover:bg-white'
          }`}
          onClick={handleLocateUser}
          disabled={isLocating}
          style={{ minWidth: '48px', minHeight: '48px' }}
        >
          {isLocating ? (
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Locate className="h-5 w-5 text-gray-700" />
          )}
        </button>

        {/* Bouton zoom + */}
        <button 
          className="w-12 h-12 sm:w-14 sm:h-14 bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 hover:bg-white"
          onClick={() => {
            const map = (window as any).mapInstance;
            if (map) map.zoomIn();
          }}
          style={{ minWidth: '48px', minHeight: '48px' }}
        >
          <Plus className="h-6 w-6 text-gray-700" />
        </button>
        
        {/* Bouton zoom - */}
        <button 
          className="w-12 h-12 sm:w-14 sm:h-14 bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 hover:bg-white"
          onClick={() => {
            const map = (window as any).mapInstance;
            if (map) map.zoomOut();
          }}
          style={{ minWidth: '48px', minHeight: '48px' }}
        >
          <Minus className="h-6 w-6 text-gray-700" />
        </button>

        {/* Bouton reset vue */}
        <button 
          className="w-12 h-12 sm:w-14 sm:h-14 bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 hover:bg-white"
          onClick={handleResetView}
          style={{ minWidth: '48px', minHeight: '48px' }}
        >
          <RotateCcw className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Indicateur de zoom mobile */}
      <div className="absolute bottom-4 left-4 z-20 sm:hidden">
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-xl px-3 py-2 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-700">
              {places.length} lieu{places.length > 1 ? 'x' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
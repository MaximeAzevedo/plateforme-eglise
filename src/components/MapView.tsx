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
  onPlaceClick?: (place: WorshipPlace) => void;
  isFullScreen?: boolean;
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
  
  // Marqueur ultra-moderne avec effets visuels
  const html = `
    <div style="
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${color} 0%, ${color}CC 50%, ${color}88 100%);
      border: 3px solid #ffffff;
      box-shadow: 
        0 8px 25px rgba(0,0,0,0.15),
        0 4px 12px rgba(0,0,0,0.1),
        0 0 0 1px rgba(255,255,255,0.3),
        inset 0 1px 0 rgba(255,255,255,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      backdrop-filter: blur(12px);
      transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      transform: perspective(1000px) rotateX(0deg);
    " 
    class="marker-hover-effect">
      <div style="
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${color}40 0%, transparent 70%);
        z-index: -1;
        opacity: 0;
        transition: opacity 0.3s ease;
      "></div>
      ${iconSvg}
    </div>
  `;
  return divIcon({
    html,
    className: 'custom-marker-icon animate-marker-appear',
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });
};

const MapView: React.FC<MapViewProps> = ({ 
  places, 
  selectedDenomination, 
  onMapMove, 
  centerOnPosition,
  onPlaceClick,
  isFullScreen = false
}) => {
  const [isLocating, setIsLocating] = React.useState(false);

  // 🔍 DIAGNOSTIC CIBLÉ
  React.useEffect(() => {
    console.log('🔍 DIAGNOSTIC CARTE:');
    console.log('📊 Places reçues:', places?.length);
    if (places?.length > 0) {
      console.log('🎯 Première place:', {
        nom: places[0].name,
        position: places[0].position,
        lat: places[0].position[0],
        lng: places[0].position[1]
      });
      console.log('📐 Toutes les positions:', places.map(p => ({
        nom: p.name,
        lat: p.position[0], 
        lng: p.position[1]
      })));
    }
  }, [places]);

  // Configuration des icônes de confession
  const confessionIcons = {
    Catholic: '⛪',
    Protestant: '✝️', 
    Orthodox: '☦️',
    Evangelical: '📖',
    'Neo-Apostolic': '🕊️',
    Pentecostal: '🔥',
    Baptist: '💧',
    Other: '🙏'
  };

  // Fonction pour créer une icône personnalisée moderne
  const createCustomIcon = (denomination: Denomination, isFullScreen: boolean = false) => {
    const baseSize = isFullScreen ? 44 : 40;
    const iconEmoji = confessionIcons[denomination] || '🙏';
    
    return divIcon({
      html: `
        <div class="custom-marker-icon animate-marker-appear" style="
          width: ${baseSize}px;
          height: ${baseSize}px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${isFullScreen ? '18px' : '16px'};
          border: 3px solid white;
          box-shadow: 
            0 4px 20px rgba(245, 158, 11, 0.4),
            0 8px 32px rgba(245, 158, 11, 0.2),
            inset 0 2px 4px rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(12px);
          transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          transform: perspective(1000px) rotateX(0deg);
          cursor: pointer;
        ">
          <div style="
            width: 100%;
            height: 100%;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
          ">
            ${iconEmoji}
          </div>
        </div>
      `,
      className: '',
      iconSize: [baseSize, baseSize],
      iconAnchor: [baseSize / 2, baseSize],
      popupAnchor: [0, -baseSize]
    });
  };

  // Gestionnaire de géolocalisation
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Déclencher le recentrage via le composant parent
        if (onMapMove) {
          onMapMove([latitude, longitude], [
            [latitude - 0.1, longitude - 0.1],
            [latitude + 0.1, longitude + 0.1]
          ]);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error('Erreur de géolocalisation:', error);
        alert('Impossible d\'obtenir votre position');
        setIsLocating(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  // Gestionnaire de réinitialisation de vue
  const handleResetView = () => {
    if (onMapMove) {
      onMapMove([46.2276, 2.2137], [
        [41.0, -5.0],
        [51.0, 10.0]
      ]);
    }
  };

  return (
    <div className={`relative ${isFullScreen ? 'h-full w-full' : 'h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] w-full rounded-2xl shadow-xl border border-gray-200'} overflow-hidden`}>
      <MapContainer
        center={[46.2276, 2.2137]}
        zoom={6}
        scrollWheelZoom={true}
        touchZoom={true}
        doubleClickZoom={true}
        dragging={true}
        zoomControl={false}
        className={`map-container h-full w-full z-10 ${isFullScreen ? '' : 'rounded-2xl'}`}
        style={{ 
          minHeight: isFullScreen ? '100vh' : '350px',
          borderRadius: isFullScreen ? '0' : '1rem'
        }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={20}
        />

        <MapEventHandler onMapMove={onMapMove} />
        <ChangeMapView places={places} />

        {/* Marqueurs directs sans clustering pour le debug */}
        {places.map((place, index) => (
          <Marker
            key={`${place.id}-${index}`}
            position={place.position}
            icon={createCustomIcon(place.denomination, isFullScreen)}
            eventHandlers={{
              click: () => {
                if (onPlaceClick) {
                  onPlaceClick(place);
                } else {
                  // Comportement par défaut pour desktop
                  console.log('Lieu cliqué:', place.name);
                }
              }
            }}
          >
            {/* Popup seulement sur desktop */}
            {!isFullScreen && (
              <Popup 
                className="custom-popup"
                maxWidth={300}
                minWidth={280}
              >
                <div className="p-2 space-y-3 max-w-xs">
                  {/* En-tête avec nom et confession */}
                  <div className="border-b border-gray-100 pb-2">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
                      {place.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {place.denomination}
                      </span>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">
                        {place.address}<br />
                        {place.postalCode} {place.city}
                      </span>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-xs leading-relaxed">
                        {place.serviceTimes}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.position[0]},${place.position[1]}`;
                        window.open(googleMapsUrl, '_blank');
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Itinéraire</span>
                    </button>
                  </div>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>

      {/* Contrôles de zoom personnalisés - adaptés selon le mode */}
      <div className={`absolute ${isFullScreen ? 'top-20 right-4' : 'top-4 right-4'} z-[1000] flex flex-col space-y-2`}>
        <button
          onClick={() => {
            const mapInstance = (window as any).mapInstance;
            if (mapInstance) {
              mapInstance.zoomIn();
            }
          }}
          className="w-10 h-10 bg-white hover:bg-gray-50 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
        
        <button
          onClick={() => {
            const mapInstance = (window as any).mapInstance;
            if (mapInstance) {
              mapInstance.zoomOut();
            }
          }}
          className="w-10 h-10 bg-white hover:bg-gray-50 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105"
        >
          <Minus className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Contrôles supplémentaires en mode plein écran */}
      {isFullScreen && (
        <div className="absolute top-20 left-4 z-[1000] flex flex-col space-y-2">
          <button
            onClick={handleLocateUser}
            disabled={isLocating}
            className={`w-12 h-12 bg-white hover:bg-blue-50 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105 ${
              isLocating ? 'animate-pulse' : ''
            }`}
          >
            <Locate className={`w-5 h-5 ${isLocating ? 'text-blue-600' : 'text-gray-700'}`} />
          </button>
          
          <button
            onClick={handleResetView}
            className="w-12 h-12 bg-white hover:bg-gray-50 rounded-xl shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <RotateCcw className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      {/* Indicateur de zoom mobile */}
      {isFullScreen && (
        <div className="absolute bottom-4 right-4 z-[1000]">
          <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            Zoom pour explorer
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
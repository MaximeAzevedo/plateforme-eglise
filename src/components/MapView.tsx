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

// Pin personnalisé Culteo en forme de goutte
const createCulteoPinIcon = (denomination: Denomination, isSelected = false) => {
  const iconSvg = confessionIcons[denomination] || confessionIcons.Other;
  
  // Couleurs selon specs Culteo
  const backgroundColor = isSelected ? '#FFC107' : '#0A6847'; // Jaune Lumière ou Vert Espérance
  const iconColor = isSelected ? '#3D3D3D' : '#FFFFFF'; // Gris Basalte ou Blanc
  const scale = isSelected ? 1.2 : 1;
  
  // Pin en forme de goutte/repère géolocalisation
  const html = `
    <div style="
      width: ${36 * scale}px;
      height: ${36 * scale}px;
      position: relative;
      transform: scale(${scale});
      transition: all 0.3s ease;
    ">
      <!-- Forme de goutte -->
      <div style="
        width: 36px;
        height: 36px;
        background: ${backgroundColor};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #FFFFFF;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <!-- Icône centrée -->
        <div style="
          transform: rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${iconColor};
        ">
          ${iconSvg.replace(/currentColor|#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g, iconColor)}
        </div>
      </div>
    </div>
  `;
  
  return divIcon({
    html,
    className: 'culteo-pin-icon',
    iconSize: [36 * scale, 36 * scale],
    iconAnchor: [18 * scale, 36 * scale] // Point de la goutte
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
  const [selectedPlaceId, setSelectedPlaceId] = React.useState<string | null>(null);

  // 🔍 DIAGNOSTIC CIBLÉ
  React.useEffect(() => {
    console.log('🔍 DIAGNOSTIC CARTE:');
    console.log('📍 Nombre de lieux:', places.length);
    console.log('🎯 Filtre dénomination:', selectedDenomination);
    console.log('📐 Mode plein écran:', isFullScreen);
    
    if (places.length > 0) {
      console.log('📋 Premier lieu exemple:', {
        nom: places[0].name,
        position: places[0].position,
        dénomination: places[0].denomination
      });
    }
  }, [places, selectedDenomination, isFullScreen]);

  // Géolocalisation améliorée
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos: [number, number] = [position.coords.latitude, position.coords.longitude];
        console.log('📍 Position utilisateur:', userPos);
        
        // Centrer la carte sur la position de l'utilisateur
        const mapInstance = (window as any).mapInstance;
        if (mapInstance) {
          mapInstance.setView(userPos, 15, { animate: true });
        }
        
        setIsLocating(false);
      },
      (error) => {
        console.error('❌ Erreur géolocalisation:', error);
        setIsLocating(false);
        
        let message = 'Impossible d\'obtenir votre position.';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = 'Vous avez refusé l\'accès à votre position.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Votre position n\'est pas disponible.';
            break;
          case error.TIMEOUT:
            message = 'La demande de géolocalisation a expiré.';
            break;
        }
        alert(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Custom cluster icon selon specs Culteo
  const createClusterCustomIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    const html = `
      <div style="
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #0A6847;
        border: 3px solid #FFFFFF;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        font-size: 16px;
        color: #F9F9F9;
      ">
        ${count}
      </div>
    `;
    
    return divIcon({
      html,
      className: 'culteo-cluster-icon',
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      
      {/* Bouton de géolocalisation Culteo - déplacé en bas à droite */}
      <button
        onClick={getUserLocation}
        disabled={isLocating}
        className={`
          absolute bottom-4 right-4 z-[1000] p-3 bg-culteo-blanc-pur border border-gray-200 rounded-culteo
          shadow-culteo-medium hover:shadow-culteo-float transition-all duration-300
          ${isLocating ? 'animate-pulse' : 'hover:scale-105'}
        `}
        title="Me localiser"
      >
        <Locate 
          className={`w-5 h-5 text-culteo-vert-esperance ${isLocating ? 'animate-spin' : ''}`}
          strokeWidth={1.5}
        />
      </button>

      <MapContainer
        center={[46.2276, 2.2137]}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ 
          minHeight: isFullScreen ? '100vh' : '350px',
          borderRadius: isFullScreen ? '0' : '1rem'
        }}
      >
        {/* Style de carte minimaliste selon specs */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={20}
        />

        <MapEventHandler onMapMove={onMapMove} />
        <ChangeMapView places={places} />
        <CenterMapOnClick center={centerOnPosition} />
        <MapControlHandler />

        {/* Clustering avec style Culteo */}
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={40}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
        >
          {places.map((place, index) => (
            <Marker
              key={`${place.id}-${index}`}
              position={place.position}
              icon={createCulteoPinIcon(place.denomination, selectedPlaceId === place.id)}
              eventHandlers={{
                click: () => {
                  setSelectedPlaceId(place.id);
                  if (onPlaceClick) {
                    onPlaceClick(place);
                  } else {
                    console.log('Lieu cliqué:', place.name);
                  }
                }
              }}
            >
              {/* Pas de popup Leaflet - utilisation du PlaceBottomSheet */}
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapView;
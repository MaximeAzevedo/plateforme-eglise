import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { WorshipPlace, Denomination } from '../types';
import { Globe, MapPin, Clock, ExternalLink, Star, Navigation, Church, Cross, Heart, Flame, Waves, Bird, Plus, Minus } from 'lucide-react';
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
      ]);
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
  Catholic: `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2L2 7v7c0 5 4 9 10 9s10-4 10-9V7z'/><path d='M12 22V12'/><path d='M7 12h10'/></svg>`,
  Protestant: `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><line x1='12' y1='2' x2='12' y2='22'/><line x1='2' y1='12' x2='22' y2='12'/></svg>`,
  Orthodox: `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><polygon points='12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2'/></svg>`,
  Evangelical: `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 21v-2a4 4 0 0 0-8 0v2'/><circle cx='12' cy='7' r='4'/></svg>`,
  Pentecostal: `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2v20M2 12h20'/></svg>`,
  Baptist: `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 12c2-2 6-2 8 0s6 2 8 0'/></svg>`,
  'Neo-Apostolic': `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/></svg>`,
  Other: `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#fff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2L2 7v7c0 5 4 9 10 9s10-4 10-9V7z'/></svg>`
};

const createCustomIcon = (denomination: Denomination) => {
  const iconSvg = confessionIcons[denomination] || confessionIcons.Other;
  const html = `
    <div style="
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #D3A625 60%, #E6B82A 100%);
      border: 2.5px solid #fff;
      box-shadow: 0 2px 8px rgba(44,62,80,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    ">
      ${iconSvg}
    </div>
  `;
  return divIcon({
    html,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const MapView: React.FC<MapViewProps> = ({ places, selectedDenomination, onMapMove, centerOnPosition }) => {
  return (
    <div className="map-container h-[500px] md:h-[600px] animate-fade-in relative">
      <MapContainer 
        center={[49.1193, 6.1757]} 
        zoom={12} 
        scrollWheelZoom={true} 
        className="h-full rounded-2xl overflow-hidden"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEventHandler onMapMove={onMapMove} />
        <CenterMapOnClick center={centerOnPosition} />
        
        <MarkerClusterGroup
          chunkedLoading
          animate={true}
          spiderfyOnMaxZoom={true}
          maxClusterRadius={40}
          showCoverageOnHover={false}
          iconCreateFunction={(cluster: any) => {
            const count = cluster.getChildCount();
            return divIcon({
              html: `
                <div style="
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);
                  border: 3px solid #fff;
                  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4), 0 0 0 1px rgba(0,0,0,0.1);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  color: #fff;
                  font-size: 1.1rem;
                  position: relative;
                  backdrop-filter: blur(10px);
                ">
                  ${count}
                </div>
              `,
              className: 'custom-cluster-icon',
              iconSize: [40, 40],
              iconAnchor: [20, 20]
            });
          }}
        >
          {places.map((place) => (
            <Marker 
              key={place.id} 
              position={place.position}
              icon={createCustomIcon(place.denomination)}
            >
              <Popup className="map-popup" closeButton={false} maxWidth={320}>
                <div className="bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 min-w-[280px] max-w-[320px] shadow-2xl">
                  <h3 className="font-bold text-gray-900 text-xl leading-tight mb-4">
                    {place.name}
                  </h3>

                  {/* Informations avec icônes modernisées */}
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700 leading-relaxed font-medium">{place.address}, {place.city}</span>
                    </div>

                    {place.serviceTimes && (
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Clock className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700 leading-relaxed font-medium">{place.serviceTimes}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full shadow-sm">
                        <span className="text-gray-800 font-bold text-sm">
                          {denominationLabels[place.denomination]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions modernisées */}
                  {place.website && (
                    <div className="mt-6 pt-4 border-t border-gray-200/50">
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <Globe className="h-5 w-5" />
                        <span>Voir le site web</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        
        <ChangeMapView places={places} />
      </MapContainer>
      
      {/* Contrôles de zoom personnalisés modernisés */}
      <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
        <button 
          className="w-12 h-12 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 hover:bg-white"
          onClick={() => {
            const map = (window as any).mapInstance;
            if (map) map.zoomIn();
          }}
        >
          <Plus className="h-5 w-5 text-gray-700" />
        </button>
        <button 
          className="w-12 h-12 bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 hover:bg-white"
          onClick={() => {
            const map = (window as any).mapInstance;
            if (map) map.zoomOut();
          }}
        >
          <Minus className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default MapView;
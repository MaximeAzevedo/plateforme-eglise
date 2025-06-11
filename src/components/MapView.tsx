import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { WorshipPlace, Denomination } from '../types';
import { Globe, MapPin, Clock, ExternalLink, Star, Navigation } from 'lucide-react';
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
  'Catholic': '⛪ Catholique',
  'Protestant': '✝️ Protestant',
  'Orthodox': '☦️ Orthodoxe',
  'Evangelical': '🕊️ Évangélique',
  'Neo-Apostolic': '🔔 Néo apostolique',
  'Pentecostal': '🔥 Pentecôtiste',
  'Baptist': '💧 Baptiste',
  'Other': '🏛️ Autre'
};

const denominationEmojis: Record<Denomination, string> = {
  'Catholic': '⛪',
  'Protestant': '✝️',
  'Orthodox': '☦️',
  'Evangelical': '🕊️',
  'Neo-Apostolic': '🔔',
  'Pentecostal': '🔥',
  'Baptist': '💧',
  'Other': '🏛️'
};

const getMarkerColor = (denomination: Denomination): string => {
  const colors: Record<Denomination, string> = {
    'Catholic': '#6366F1',
    'Protestant': '#10B981',
    'Evangelical': '#EAB308',
    'Orthodox': '#EF4444',
    'Neo-Apostolic': '#F97316',
    'Pentecostal': '#8B5CF6',
    'Baptist': '#06B6D4',
    'Other': '#6B7280'
  };
  return colors[denomination];
};

const createCustomIcon = (denomination: Denomination) => {
  const color = getMarkerColor(denomination);
  const emoji = denominationEmojis[denomination];
  const html = `
    <div style="
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${color}, ${color}E6);
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      position: relative;
      animation: bounce 2s infinite;
    ">
      ${emoji}
    </div>
  `;

  return divIcon({
    html,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

const MapView: React.FC<MapViewProps> = ({ places, selectedDenomination, onMapMove, centerOnPosition }) => {
  return (
    <div className="map-container h-[500px] md:h-[600px] animate-fade-in">
      <MapContainer 
        center={[49.1193, 6.1757]} 
        zoom={12} 
        scrollWheelZoom={true} 
        className="h-full"
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
            return divIcon({
              html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
              className: 'custom-cluster-icon',
              iconSize: [40, 40]
            });
          }}
        >
          {places.map((place) => (
            <Marker 
              key={place.id} 
              position={place.position}
              icon={createCustomIcon(place.denomination)}
            >
              <Popup className="map-popup" closeButton={false} maxWidth={200}>
                <div className="p-2 min-w-[180px] bg-white rounded-lg shadow-sm">
                  {/* Header compact */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-cyber-500 to-electric-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">{denominationEmojis[place.denomination]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 leading-tight truncate">
                        {place.name}
                      </h3>
                      <span className="inline-flex items-center text-xs px-1.5 py-0.5 rounded-md font-medium bg-gray-100 text-gray-700">
                        {denominationLabels[place.denomination]}
                      </span>
                    </div>
                  </div>

                  {/* Informations ultra-compactes */}
                  <div className="space-y-1 mb-2">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 leading-tight">
                          {place.address}
                        </p>
                        <p className="text-xs text-gray-500">
                          {place.postalCode} {place.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <Clock className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 truncate">
                          {place.serviceTimes}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions mini */}
                  <div className="flex gap-1">
                    {place.website && (
                      <a 
                        href={place.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 p-1.5 bg-cyber-50 hover:bg-cyber-100 rounded-md transition-colors duration-200"
                      >
                        <Globe className="w-3 h-3 text-cyber-600" />
                        <span className="text-xs text-cyber-700 font-medium">Site</span>
                      </a>
                    )}
                    
                    <button className={`flex items-center justify-center gap-1 p-1.5 bg-electric-50 hover:bg-electric-100 rounded-md transition-colors duration-200 ${place.website ? 'flex-1' : 'w-full'}`}>
                      <Navigation className="w-3 h-3 text-electric-600" />
                      <span className="text-xs text-electric-700 font-medium">Itinéraire</span>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        
        <ChangeMapView places={places} />
      </MapContainer>
    </div>
  );
};

export default MapView;
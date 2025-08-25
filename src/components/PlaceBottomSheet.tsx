import React, { useRef, useState } from 'react';
import { MapPin, Clock, Navigation, X } from 'lucide-react';
import { Place, Denomination } from '../types';

interface PlaceBottomSheetProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  currentIndex?: number;
  totalPlaces?: number;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

// Labels des confessions selon constants
const denominationLabels: Record<Denomination, string> = {
  'Catholic': 'Catholique',
  'Protestant': 'Protestante', 
  'Orthodox': 'Orthodoxe',
  'Evangelical': 'Évangélique',
  'Pentecostal': 'Pentecôtiste',
  'Baptist': 'Baptiste',
  'Neo-Apostolic': 'Néo-apostolique',
  'Other': 'Autre'
};

const PlaceBottomSheet: React.FC<PlaceBottomSheetProps> = ({ 
  place, 
  isOpen, 
  onClose, 
  currentIndex = 0, 
  totalPlaces = 1, 
  onNavigate 
}) => {
  if (!place) return null;

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwipping, setIsSwipping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Distance minimale pour déclencher un swipe (en pixels)
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwipping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsSwipping(false);
    
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    console.log('🔄 Swipe détecté:', { distance, isLeftSwipe, isRightSwipe, currentIndex, totalPlaces });

    if (onNavigate) {
      if (isLeftSwipe && currentIndex < totalPlaces - 1) {
        console.log('➡️ Navigation suivante');
        onNavigate('next');
      }
      if (isRightSwipe && currentIndex > 0) {
        console.log('⬅️ Navigation précédente');
        onNavigate('prev');
      }
    }
  };

  const handleItinerary = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.position[0]},${place.position[1]}`;
    // Fix: Utiliser location.href au lieu de window.open pour éviter la page blanche
    window.location.href = googleMapsUrl;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Bottom Sheet */}
      <div 
        ref={containerRef}
        className={`
          fixed bottom-0 left-0 right-0 z-50 lg:hidden
          bg-culteo-blanc-pur rounded-t-culteo-lg shadow-culteo-float
          transform transition-all duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          ${isSwipping ? 'scale-105 shadow-culteo-medium' : ''}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle pour drag + header avec compteur et fermer */}
        <div className="relative px-4 py-3">
          {/* Handle de drag centré */}
          <div className="flex justify-center mb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Header: Compteur à gauche, indication au centre, fermer à droite */}
          <div className="flex items-center justify-between">
            {/* Compteur petit en haut à gauche */}
            {totalPlaces > 1 && (
              <span className="text-xs font-poppins font-medium text-culteo-gris-basalte/60 bg-culteo-blanc-coquille px-2 py-1 rounded-full">
                {currentIndex + 1} / {totalPlaces}
              </span>
            )}

            {/* Indication swipe au centre */}
            {totalPlaces > 1 && (
              <div className="text-xs font-lato text-culteo-gris-basalte/50">
                ← Glissez pour naviguer →
              </div>
            )}

            {/* Bouton fermer en haut à droite */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-culteo hover:bg-culteo-blanc-coquille transition-colors"
            >
              <X className="w-4 h-4 text-culteo-gris-basalte" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="px-6 pb-6 space-y-4">
          {/* Nom église et confession côte à côte avec même taille */}
          <div className="flex items-center gap-3">
            <h3 className="font-poppins font-semibold text-culteo-gris-basalte text-base leading-tight">
              {place.name}
            </h3>
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-culteo-vert-esperance/15 text-culteo-vert-esperance font-poppins font-semibold text-base">
              {denominationLabels[place.denomination]}
            </span>
          </div>

          {/* Événements mieux structurés */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-culteo-vert-esperance flex-shrink-0" strokeWidth={1.5} />
              <span className="font-poppins font-medium text-culteo-gris-basalte text-sm">Horaires des célébrations</span>
            </div>
            
            <div className="bg-culteo-blanc-coquille rounded-culteo p-3">
              <div className="font-lato text-culteo-gris-basalte text-sm leading-relaxed">
                {place.serviceTimes || 'Horaires non disponibles'}
              </div>
            </div>
          </div>

          {/* Adresse complète */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-culteo-vert-esperance mt-0.5 flex-shrink-0" strokeWidth={1.5} />
            <div className="font-lato text-culteo-gris-basalte text-sm">
              {place.address ? `${place.address}, ${place.city}` : place.city}
            </div>
          </div>

          {/* Bouton itinéraire compact */}
          <button
            onClick={handleItinerary}
            className="inline-flex items-center justify-center gap-2 bg-culteo-vert-esperance text-white px-4 py-2 rounded-culteo font-poppins font-medium hover:bg-primary-600 transition-colors text-sm"
          >
            <Navigation className="w-4 h-4" strokeWidth={1.5} />
            Itinéraire
          </button>
        </div>
      </div>
    </>
  );
};

export default PlaceBottomSheet; 
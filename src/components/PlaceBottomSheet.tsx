import React, { useRef, useState } from 'react';
import { MapPin, Clock, Navigation, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Distance minimale pour déclencher un swipe (en pixels)
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (onNavigate) {
      if (isLeftSwipe && currentIndex < totalPlaces - 1) {
        onNavigate('next');
      }
      if (isRightSwipe && currentIndex > 0) {
        onNavigate('prev');
      }
    }
  };

  const handleItinerary = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.position[0]},${place.position[1]}`;
    window.open(googleMapsUrl, '_blank');
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
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle pour drag */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Navigation horizontale et compteur */}
        {totalPlaces > 1 && (
          <div className="flex items-center justify-between px-6 pb-2">
            {/* Flèche gauche */}
            <button
              onClick={() => onNavigate?.('prev')}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full ${
                currentIndex === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-culteo-vert-esperance hover:bg-culteo-blanc-coquille'
              } transition-colors`}
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Compteur X/Y */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(totalPlaces, 5) }, (_, i) => {
                  const dotIndex = Math.floor(currentIndex / Math.ceil(totalPlaces / 5)) * Math.ceil(totalPlaces / 5) + i;
                  return (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        dotIndex === currentIndex ? 'bg-culteo-vert-esperance' : 'bg-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-sm font-lato text-culteo-gris-basalte/70">
                {currentIndex + 1}/{totalPlaces}
              </span>
            </div>

            {/* Flèche droite */}
            <button
              onClick={() => onNavigate?.('next')}
              disabled={currentIndex === totalPlaces - 1}
              className={`p-2 rounded-full ${
                currentIndex === totalPlaces - 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-culteo-vert-esperance hover:bg-culteo-blanc-coquille'
              } transition-colors`}
            >
              <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* Contenu simplifié selon demandes */}
        <div className="px-6 pb-6 space-y-3">
          {/* Header compact avec titre et bouton fermer */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Dénomination en petit tag */}
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-culteo-vert-esperance/15 text-culteo-vert-esperance font-poppins font-semibold text-xs mb-1">
                {denominationLabels[place.denomination]}
              </span>
              
              {/* Nom de l'église */}
              <h3 className="font-poppins font-bold text-culteo-gris-basalte text-lg leading-tight">
                {place.name}
              </h3>
            </div>
            
            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-culteo hover:bg-culteo-blanc-coquille transition-colors"
            >
              <X className="w-4 h-4 text-culteo-gris-basalte" strokeWidth={1.5} />
            </button>
          </div>

          {/* Horaires de célébration simplifiés */}
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-culteo-vert-esperance mt-0.5 flex-shrink-0" strokeWidth={1.5} />
            <div className="font-lato text-culteo-gris-basalte text-sm">
              {place.serviceTimes || 'Horaires non disponibles'}
            </div>
          </div>

          {/* Bouton itinéraire uniquement */}
          <button
            onClick={handleItinerary}
            className="w-full flex items-center justify-center gap-2 bg-culteo-vert-esperance text-white px-4 py-2.5 rounded-culteo font-poppins font-medium hover:bg-primary-600 transition-colors"
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
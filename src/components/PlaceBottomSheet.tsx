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
          transform transition-all duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          ${isSwipping ? 'scale-105 shadow-culteo-medium' : ''}
        `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle pour drag + indicateur swipe */}
        <div className="flex flex-col items-center py-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full mb-1"></div>
          {totalPlaces > 1 && (
            <div className="text-xs font-lato text-culteo-gris-basalte/50 animate-pulse">
              ← Glissez pour naviguer →
            </div>
          )}
        </div>

        {/* Navigation horizontale et compteur */}
        {totalPlaces > 1 && (
          <div className="flex items-center justify-between px-4 pb-3 bg-culteo-blanc-coquille/30">
            {/* Flèche gauche */}
            <button
              onClick={() => {
                console.log('🔄 Clic flèche gauche');
                onNavigate?.('prev');
              }}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full border-2 transition-all ${
                currentIndex === 0 
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed' 
                  : 'text-culteo-vert-esperance border-culteo-vert-esperance hover:bg-culteo-vert-esperance hover:text-white'
              }`}
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>

            {/* Compteur X/Y et points de navigation */}
            <div className="flex flex-col items-center space-y-2">
              {/* Points de navigation simplifiés */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(totalPlaces, 5) }, (_, i) => {
                  const actualIndex = i < 5 ? i : currentIndex - 2 + i;
                  return (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        actualIndex === currentIndex ? 'bg-culteo-vert-esperance scale-125' : 'bg-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
              {/* Compteur numérique */}
              <span className="text-sm font-poppins font-semibold text-culteo-gris-basalte">
                {currentIndex + 1} / {totalPlaces}
              </span>
            </div>

            {/* Flèche droite */}
            <button
              onClick={() => {
                console.log('🔄 Clic flèche droite');
                onNavigate?.('next');
              }}
              disabled={currentIndex === totalPlaces - 1}
              className={`p-3 rounded-full border-2 transition-all ${
                currentIndex === totalPlaces - 1 
                  ? 'text-gray-300 border-gray-200 cursor-not-allowed' 
                  : 'text-culteo-vert-esperance border-culteo-vert-esperance hover:bg-culteo-vert-esperance hover:text-white'
              }`}
            >
              <ChevronRight className="w-6 h-6" strokeWidth={2} />
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
import React from 'react';
import { MapPin, Clock, Navigation, X, Calendar } from 'lucide-react';
import { Place, Denomination } from '../types';

interface PlaceBottomSheetProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
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

const PlaceBottomSheet: React.FC<PlaceBottomSheetProps> = ({ place, isOpen, onClose }) => {
  if (!place) return null;

  const handleItinerary = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.position[0]},${place.position[1]}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleViewDetails = () => {
    // TODO: Navigation vers fiche détaillée
    console.log('Voir fiche détaillée:', place.name);
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
      <div className={`
        fixed bottom-0 left-0 right-0 z-50 lg:hidden
        bg-culteo-blanc-pur rounded-t-culteo-lg shadow-culteo-float
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        {/* Handle pour drag */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Contenu selon specs Culteo */}
        <div className="px-6 pb-8 space-y-4">
          {/* Header avec titre et bouton fermer */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Titre */}
              <h3 className="font-poppins font-bold text-culteo-gris-basalte text-xl leading-tight">
                {place.name}
              </h3>
              
              {/* Tag catégorie selon specs */}
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-culteo bg-culteo-vert-esperance/15 text-culteo-vert-esperance font-poppins font-semibold text-sm">
                  {denominationLabels[place.denomination]}
                </span>
              </div>
            </div>
            
            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className="p-2 rounded-culteo hover:bg-culteo-blanc-coquille transition-colors"
            >
              <X className="w-5 h-5 text-culteo-gris-basalte" strokeWidth={1.5} />
            </button>
          </div>

          {/* Adresse */}
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-culteo-vert-esperance mt-0.5 flex-shrink-0" strokeWidth={1.5} />
            <span className="font-lato text-culteo-gris-basalte">
              {place.address}, {place.city}
            </span>
          </div>

          {/* Horaires - Information clé */}
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-culteo-vert-esperance mt-0.5 flex-shrink-0" strokeWidth={1.5} />
            <div className="font-lato text-culteo-gris-basalte">
              {place.serviceTimes || 'Horaires non disponibles'}
            </div>
          </div>

          {/* Boutons d'action côte à côte selon specs */}
          <div className="flex gap-3 pt-2">
            {/* Bouton secondaire - Itinéraire */}
            <button
              onClick={handleItinerary}
              className="flex-1 flex items-center justify-center gap-2 bg-culteo-blanc-coquille text-culteo-gris-basalte px-4 py-3 rounded-culteo font-poppins font-medium hover:bg-gray-100 transition-colors"
            >
              <Navigation className="w-4 h-4" strokeWidth={1.5} />
              Itinéraire
            </button>
            
            {/* Bouton primaire - Voir la fiche */}
            <button
              onClick={handleViewDetails}
              className="flex-1 flex items-center justify-center gap-2 bg-culteo-vert-esperance text-white px-4 py-3 rounded-culteo font-poppins font-medium hover:bg-primary-600 transition-colors"
            >
              <Calendar className="w-4 h-4" strokeWidth={1.5} />
              Voir la fiche
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceBottomSheet; 
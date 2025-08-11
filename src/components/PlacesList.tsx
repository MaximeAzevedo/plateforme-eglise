import React, { useState } from 'react';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { WorshipPlace, Denomination } from '../types';

interface PlacesListProps {
  places: WorshipPlace[];
}

// Configuration des icônes selon dénominations
const denominationConfig: Record<Denomination, { emoji: string }> = {
  'Catholic': { emoji: '⛪' },
  'Protestant': { emoji: '✝️' },
  'Orthodox': { emoji: '☦️' },
  'Evangelical': { emoji: '📖' },
  'Pentecostal': { emoji: '🔥' },
  'Baptist': { emoji: '💧' },
  'Neo-Apostolic': { emoji: '🕊️' },
  'Other': { emoji: '🙏' }
};

// Labels des confessions
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

const PlacesList: React.FC<PlacesListProps> = ({ places }) => {
  // Calcul distance (simulé pour l'instant)
  const getDistance = (place: WorshipPlace): string => {
    // TODO: Calculer vraie distance avec géolocalisation
    return `${Math.floor(Math.random() * 20) + 1} km`;
  };

  const handlePlaceClick = (place: WorshipPlace) => {
    // TODO: Navigation vers fiche détaillée
    console.log('Clic sur lieu:', place.name);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-poppins font-bold text-culteo-gris-basalte mb-2">
          {places.length} lieu{places.length > 1 ? 'x' : ''} de culte
        </h3>
        <p className="font-lato text-culteo-gris-basalte">
          Liste triée par proximité
        </p>
      </div>

      {places.length > 0 ? (
        /* Liste verticale scrollable selon specs */
        <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-culteo">
          {places.map((place, index) => (
            <div 
              key={place.id || index}
              onClick={() => handlePlaceClick(place)}
              className="group bg-culteo-blanc-pur rounded-culteo shadow-culteo-soft border border-gray-100 p-4 hover:shadow-culteo-medium transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Icône de catégorie à gauche selon specs */}
                <div className="flex-shrink-0 w-10 h-10 rounded-culteo bg-culteo-vert-esperance/10 flex items-center justify-center">
                  <span className="text-lg text-culteo-vert-esperance">
                    {denominationConfig[place.denomination]?.emoji || '🏛️'}
                  </span>
                </div>

                {/* Contenu principal */}
                <div className="flex-1 min-w-0">
                  {/* Nom du lieu */}
                  <h4 className="font-poppins font-semibold text-culteo-gris-basalte text-lg leading-tight mb-1 truncate">
                    {place.name}
                  </h4>
                  
                  {/* Adresse */}
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-culteo-vert-esperance flex-shrink-0" strokeWidth={1.5} />
                    <span className="font-lato text-culteo-gris-basalte text-sm truncate">
                      {place.address}, {place.city}
                    </span>
                  </div>
                  
                  {/* Distance */}
                  <div className="font-lato text-culteo-vert-esperance text-sm font-medium">
                    À {getDistance(place)}
                  </div>
                </div>

                {/* Chevron à droite selon specs */}
                <div className="flex-shrink-0">
                  <ChevronRight 
                    className="w-5 h-5 text-culteo-gris-basalte group-hover:text-culteo-vert-esperance transition-colors" 
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Message vide */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-culteo-blanc-coquille rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-culteo-vert-esperance" strokeWidth={1.5} />
          </div>
          <h3 className="font-poppins font-semibold text-culteo-gris-basalte text-lg mb-2">
            Aucun lieu trouvé
          </h3>
          <p className="font-lato text-culteo-gris-basalte">
            Essayez d'ajuster vos filtres de recherche
          </p>
        </div>
      )}
    </div>
  );
};

export default PlacesList;
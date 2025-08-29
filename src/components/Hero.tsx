import React, { useState } from 'react';
import { 
  Search,
  Filter,
  Church,
  Calendar,
  Users,
  Plus,
  List,
  Map,
  MapPin
} from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onTestimonyClick?: () => void;
  onMapClick?: () => void;
  viewMode?: 'list' | 'map';
  onViewModeChange?: (mode: 'list' | 'map') => void;
  onLocationFound?: (position: [number, number]) => void;
  onSearch?: (query: string) => void;
  isMobile?: boolean; // Nouvelle prop
}

const Hero: React.FC<HeroProps> = ({ 
  onExploreClick, 
  onTestimonyClick,
  onMapClick,
  viewMode = 'map',
  onViewModeChange,
  onLocationFound,
  onSearch,
  isMobile = false // Valeur par défaut
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        onLocationFound?.(coords);
        setIsLocating(false);
      },
      (error) => {
        console.error('Erreur géolocalisation:', error);
        setIsLocating(false);
        alert('Impossible d\'obtenir votre position');
      }
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const categories = [
    {
      icon: Church,
      title: 'Lieux de Culte',
      action: onMapClick
    },
    {
      icon: Calendar,
      title: 'Événements',
      action: () => console.log('Événements')
    },
    {
      icon: Users,
      title: 'Groupes & Communautés',
      action: () => console.log('Groupes')
    },
    {
      icon: Plus,
      title: 'Contribuer',
      action: onExploreClick
    }
  ];

  return (
    <div className="min-h-screen bg-culteo-blanc-coquille pt-16">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-culteo-blanc-pur rounded-culteo-xl shadow-culteo-float border border-gray-100 p-8 md:p-12">
        
          {/* Section d'accroche selon specs Culteo */}
          <div className="text-center mb-16">
            {/* Titre H1 principal */}
            <h1 className="font-poppins font-bold text-culteo-gris-basalte mb-4" style={{ fontSize: '36px', lineHeight: '1.2' }}>
              Trouvez votre place.
            </h1>

            {/* Sous-titre */}
            <p className="font-lato text-culteo-gris-basalte mb-12" style={{ fontSize: '18px', lineHeight: '1.6' }}>
              Le guide de toutes les communautés chrétiennes.
            </p>

            {/* Barre de recherche simplifiée sur mobile, complète sur desktop */}
            {!isMobile && (
              <div className="max-w-4xl mx-auto mb-16">
                <div className="flex items-center gap-3 bg-culteo-blanc-coquille rounded-culteo-lg shadow-culteo-soft border border-gray-100 p-3">
                  
                  {/* 1. Bouton Toggle Liste/Carte */}
                  <button
                    onClick={() => onViewModeChange?.(viewMode === 'map' ? 'list' : 'map')}
                    className="p-3 rounded-culteo hover:bg-white transition-colors duration-200 flex-shrink-0"
                    title={viewMode === 'map' ? 'Afficher en liste' : 'Afficher sur la carte'}
                  >
                    {viewMode === 'map' ? (
                      <List 
                        className="w-5 h-5 text-culteo-vert-esperance" 
                        strokeWidth={1.5}
                        style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                      />
                    ) : (
                      <Map 
                        className="w-5 h-5 text-culteo-vert-esperance" 
                        strokeWidth={1.5}
                        style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                      />
                    )}
                  </button>

                  {/* 2. Barre de recherche */}
                  <div className="flex items-center flex-1">
                    <Search 
                      className="w-5 h-5 text-culteo-vert-esperance mr-3" 
                      strokeWidth={1.5}
                      style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearch}
                      placeholder="Rechercher une ville, une paroisse..."
                      className="flex-1 bg-transparent border-none outline-none font-lato text-culteo-gris-basalte placeholder-gray-400"
                      style={{ fontSize: '16px' }}
                    />
                  </div>

                  {/* 3. Bouton géolocalisation (plus petit) */}
                  <button
                    onClick={handleGeolocation}
                    disabled={isLocating}
                    className="p-2 rounded-culteo hover:bg-white transition-colors duration-200 flex-shrink-0"
                    title="Me localiser"
                  >
                    <MapPin 
                      className={`w-4 h-4 text-culteo-vert-esperance ${isLocating ? 'animate-pulse' : ''}`}
                      strokeWidth={1.5}
                      style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                    />
                  </button>

                  {/* 4. Bouton filtres */}
                  <button
                    onClick={() => {
                      // TODO: Implémenter l'ouverture des filtres
                      console.log('Ouverture des filtres - à implémenter');
                    }}
                    className="p-3 rounded-culteo hover:bg-white transition-colors duration-200 flex-shrink-0"
                    title="Filtres"
                  >
                    <Filter 
                      className="w-5 h-5 text-culteo-vert-esperance" 
                      strokeWidth={1.5}
                      style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Message simplifié pour mobile */}
            {isMobile && (
              <div className="max-w-4xl mx-auto mb-16">
                <p className="font-lato text-culteo-gris-basalte text-lg">
                  Utilisez le menu pour naviguer vers la carte ou la recherche
                </p>
              </div>
            )}
          </div>

          {/* Raccourcis catégories 2x2 selon specs - avec style cohérent */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 gap-6">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={category.action}
                  className="bg-culteo-blanc-coquille rounded-culteo shadow-culteo-soft border border-gray-100 p-8 hover:shadow-culteo-medium hover:bg-white transition-all duration-300 group text-center"
                >
                  {/* Icône */}
                  <div className="w-16 h-16 bg-white rounded-culteo flex items-center justify-center mx-auto mb-4 group-hover:bg-culteo-blanc-coquille transition-colors duration-300 shadow-culteo-soft">
                    <category.icon 
                      className="w-8 h-8 text-culteo-vert-esperance group-hover:scale-110 transition-transform duration-300" 
                      strokeWidth={1.5}
                      style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
                    />
                  </div>
                  
                  {/* Label */}
                  <h3 className="font-poppins font-semibold text-culteo-gris-basalte group-hover:text-culteo-vert-esperance transition-colors duration-300">
                    {category.title}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 
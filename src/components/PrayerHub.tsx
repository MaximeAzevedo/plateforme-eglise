import React, { useState, useEffect } from 'react';
import { Heart, Plus, Users, Globe, Clock, ChevronRight, Sparkles, Shield, Zap, Crown } from 'lucide-react';
import FullscreenModal from './FullscreenModal';
import PrayerForm from './PrayerForm';
import PrayerWall from './PrayerWall';

interface PrayerHubProps {
  isOpen: boolean;
  onClose: () => void;
  supabase: any;
  defaultType?: PrayerHubType;
}

type PrayerHubType = 'add' | 'wall' | null;

const PrayerHub: React.FC<PrayerHubProps> = ({ isOpen, onClose, supabase, defaultType = null }) => {
  const [selectedType, setSelectedType] = useState<PrayerHubType>(defaultType);

  // Réinitialiser le type sélectionné quand le modal s'ouvre/ferme
  useEffect(() => {
    if (isOpen) {
      setSelectedType(defaultType);
    }
  }, [isOpen, defaultType]);

  const handleBackToHub = () => {
    setSelectedType(null);
  };

  const prayerOptions = [
    {
      id: 'add' as PrayerHubType,
      title: 'Demander une Prière',
      description: 'Partagez vos besoins de prière avec notre communauté bienveillante',
      icon: Heart,
      color: 'linear-gradient(135deg, #0A6847, #FFC107)',
      stats: 'Soutien communautaire'
    },
    {
      id: 'wall' as PrayerHubType,
      title: 'Mur de Prières',
      description: 'Découvrez les demandes de prière et soutenez la communauté',
      icon: Users,
      color: 'linear-gradient(135deg, #FFC107, #0A6847)',
      stats: 'Prières actives'
    }
  ];

  if (!isOpen) return null;

  // Affichage du formulaire de prière
  if (selectedType === 'add') {
    return (
      <FullscreenModal
        isOpen={true}
        onClose={onClose}
        onBack={handleBackToHub}
        showBackButton={true}
        title="Demander une Prière"
        subtitle="Partagez vos besoins spirituels"
        headerIcon={
          <div 
            className="w-10 h-10 rounded-culteo flex items-center justify-center"
            style={{background: 'linear-gradient(135deg, #0A6847, #FFC107)', borderRadius: '12px'}}
          >
            <Heart className="h-5 w-5 text-white" />
          </div>
        }
      >
        <PrayerForm 
          isOpen={false} // Géré par FullscreenModal
          onClose={onClose}
          onBack={handleBackToHub}
          supabase={supabase}
        />
      </FullscreenModal>
    );
  }

  // Affichage du mur de prières
  if (selectedType === 'wall') {
    return (
      <PrayerWall 
        isOpen={true}
        onClose={onClose}
        supabase={supabase}
      />
    );
  }

  // Affichage du hub principal
  return (
    <FullscreenModal
      isOpen={isOpen}
      onClose={onClose}
      title="Prières & Communion"
      subtitle="Partageons nos besoins spirituels ensemble"
      headerIcon={
        <div className="relative">
          <div 
            className="w-10 h-10 rounded-culteo flex items-center justify-center shadow-culteo-medium"
            style={{background: 'linear-gradient(135deg, #0A6847, #FFC107)', borderRadius: '12px'}}
          >
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div 
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center animate-pulse"
            style={{background: 'linear-gradient(135deg, #FFC107, #0A6847)'}}
          >
            <Sparkles className="h-2 w-2 text-white" />
          </div>
        </div>
      }
    >
      {/* Statistiques en haut */}
      <div 
        className="bg-culteo-blanc-coquille rounded-culteo p-4 mb-6"
        style={{backgroundColor: '#F9F9F9', borderRadius: '16px'}}
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Heart className="h-5 w-5 mx-auto mb-2" style={{color: '#0A6847'}} />
            <div className="font-poppins font-bold text-culteo-gris-basalte text-sm" style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}>50+</div>
            <div className="font-lato text-xs" style={{color: 'rgba(61, 61, 61, 0.7)', fontFamily: 'Lato, sans-serif'}}>Prières</div>
          </div>
          <div>
            <Users className="h-5 w-5 mx-auto mb-2" style={{color: '#0A6847'}} />
            <div className="font-poppins font-bold text-culteo-gris-basalte text-sm" style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}>200+</div>
            <div className="font-lato text-xs" style={{color: 'rgba(61, 61, 61, 0.7)', fontFamily: 'Lato, sans-serif'}}>Soutiens</div>
          </div>
          <div>
            <Clock className="h-5 w-5 mx-auto mb-2" style={{color: '#0A6847'}} />
            <div className="font-poppins font-bold text-culteo-gris-basalte text-sm" style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}>24h</div>
            <div className="font-lato text-xs" style={{color: 'rgba(61, 61, 61, 0.7)', fontFamily: 'Lato, sans-serif'}}>Active</div>
          </div>
        </div>
      </div>

      {/* Liste des options - Mobile First */}
      <div className="space-y-4">
        {prayerOptions.map((option) => {
          const IconComponent = option.icon;

          return (
            <button
              key={option.id}
              onClick={() => setSelectedType(option.id)}
              className="w-full p-4 bg-culteo-blanc-pur border-2 border-culteo-vert-esperance/10 rounded-culteo-lg transition-all duration-300 hover:border-culteo-vert-esperance/30 hover:shadow-culteo-medium active:scale-[0.98]"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: 'rgba(10, 104, 71, 0.1)',
                borderRadius: '20px'
              }}
            >
              <div className="flex items-center space-x-4">
                {/* Icône */}
                <div 
                  className="w-12 h-12 rounded-culteo flex items-center justify-center flex-shrink-0"
                  style={{
                    background: option.color,
                    borderRadius: '16px'
                  }}
                >
                  <IconComponent className="h-6 w-6 text-white" />
                </div>

                {/* Contenu */}
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 
                      className="font-poppins font-bold text-culteo-gris-basalte text-base"
                      style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}
                    >
                      {option.title}
                    </h3>
                    <div 
                      className="px-2 py-1 bg-culteo-blanc-coquille rounded-full text-xs font-lato"
                      style={{backgroundColor: '#F9F9F9', color: 'rgba(61, 61, 61, 0.7)', fontFamily: 'Lato, sans-serif'}}
                    >
                      {option.stats}
                    </div>
                  </div>
                  <p 
                    className="font-lato text-culteo-gris-basalte/70 text-sm leading-relaxed"
                    style={{color: 'rgba(61, 61, 61, 0.7)', fontFamily: 'Lato, sans-serif'}}
                  >
                    {option.description}
                  </p>
                </div>

                {/* Flèche */}
                <ChevronRight className="h-5 w-5 flex-shrink-0" style={{color: 'rgba(61, 61, 61, 0.4)'}} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Catégories de prières populaires */}
      <div className="mt-8">
        <h4 
          className="font-poppins font-bold text-culteo-gris-basalte text-sm mb-4"
          style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}
        >
          Catégories populaires
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Sparkles, label: 'Guérison', color: '#0A6847' },
            { icon: Shield, label: 'Protection', color: '#FFC107' },
            { icon: Crown, label: 'Croissance', color: '#0A6847' },
            { icon: Zap, label: 'Percée', color: '#FFC107' }
          ].map((category, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 p-2 bg-culteo-blanc-coquille rounded-culteo"
              style={{backgroundColor: '#F9F9F9', borderRadius: '12px'}}
            >
              <category.icon className="h-4 w-4" style={{color: category.color}} />
              <span 
                className="font-lato text-xs"
                style={{color: 'rgba(61, 61, 61, 0.8)', fontFamily: 'Lato, sans-serif'}}
              >
                {category.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Message d'encouragement */}
      <div 
        className="mt-8 p-4 bg-gradient-to-r from-culteo-vert-esperance/5 to-culteo-jaune-lumiere/5 border border-culteo-vert-esperance/20 rounded-culteo-lg text-center"
        style={{
          background: 'linear-gradient(to right, rgba(10, 104, 71, 0.05), rgba(255, 193, 7, 0.05))',
          borderColor: 'rgba(10, 104, 71, 0.2)',
          borderRadius: '20px'
        }}
      >
        <div className="flex justify-center mb-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{background: 'linear-gradient(135deg, #0A6847, #FFC107)'}}
          >
            <Heart className="h-4 w-4 text-white" />
          </div>
        </div>
        <h4 
          className="font-poppins font-bold mb-2 text-sm"
          style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}
        >
          "Priez les uns pour les autres"
        </h4>
        <p 
          className="font-lato text-xs leading-relaxed"
          style={{color: 'rgba(61, 61, 61, 0.8)', fontFamily: 'Lato, sans-serif'}}
        >
          Dans la prière, nous trouvons la force et l'espoir. Partageons ce don divin ensemble.
        </p>
      </div>
    </FullscreenModal>
  );
};

export default PrayerHub;
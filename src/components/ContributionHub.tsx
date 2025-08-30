import React, { useState, useEffect } from 'react';
import { Church, Heart, Star, AlertTriangle, MapPin, Users, Globe, Plus, ChevronRight } from 'lucide-react';
import FullscreenModal from './FullscreenModal';
import ContributeForm from './ContributeForm';
import TestimonyForm from './TestimonyForm';
import PrayerForm from './PrayerForm';

interface ContributionHubProps {
  isOpen: boolean;
  onClose: () => void;
  supabase: any;
  defaultType?: ContributionType;
}

type ContributionType = 'church' | 'testimony' | 'prayer' | 'modification' | null;

const ContributionHub: React.FC<ContributionHubProps> = ({ isOpen, onClose, supabase, defaultType = null }) => {
  const [selectedType, setSelectedType] = useState<ContributionType>(defaultType);

  // Réinitialiser le type sélectionné quand le modal s'ouvre/ferme
  useEffect(() => {
    if (isOpen) {
      setSelectedType(defaultType);
    }
  }, [isOpen, defaultType]);

  const handleBackToHub = () => {
    setSelectedType(null);
  };

  const contributionOptions = [
    {
      id: 'church' as ContributionType,
      title: 'Référencer une Église',
      description: 'Ajoutez un nouveau lieu de culte à notre carte communautaire',
      icon: Church,
      color: 'from-culteo-vert-esperance to-culteo-jaune-lumiere',
      bgColor: 'bg-culteo-blanc-coquille',
      borderColor: 'border-culteo-vert-esperance/20',
      hoverColor: 'hover:border-culteo-vert-esperance hover:bg-culteo-blanc-pur',
      stats: '1500+ lieux référencés'
    },
    {
      id: 'testimony' as ContributionType,
      title: 'Partager un Témoignage',
      description: 'Racontez comment Dieu a transformé votre vie et inspirez la communauté',
      icon: Star,
      color: 'from-culteo-jaune-lumiere to-culteo-vert-esperance',
      bgColor: 'bg-culteo-blanc-coquille',
      borderColor: 'border-culteo-jaune-lumiere/20',
      hoverColor: 'hover:border-culteo-jaune-lumiere hover:bg-culteo-blanc-pur',
      stats: 'Encouragez des milliers'
    },
    {
      id: 'prayer' as ContributionType,
      title: 'Demande de Prière',
      description: 'Partagez vos besoins de prière avec notre communauté bienveillante',
      icon: Heart,
      color: 'from-culteo-vert-esperance via-culteo-jaune-lumiere to-culteo-vert-esperance',
      bgColor: 'bg-culteo-blanc-coquille',
      borderColor: 'border-culteo-vert-esperance/20',
      hoverColor: 'hover:border-culteo-vert-esperance hover:bg-culteo-blanc-pur',
      stats: 'Prières en communion'
    },
    {
      id: 'modification' as ContributionType,
      title: 'Signaler une Modification',
      description: 'Aidez-nous à maintenir nos informations à jour',
      icon: AlertTriangle,
      color: 'from-culteo-gris-basalte to-culteo-vert-esperance',
      bgColor: 'bg-culteo-blanc-coquille',
      borderColor: 'border-culteo-gris-basalte/20',
      hoverColor: 'hover:border-culteo-gris-basalte hover:bg-culteo-blanc-pur',
      stats: 'Qualité garantie'
    }
  ];

  if (!isOpen) return null;

  // Affichage du formulaire spécifique avec FullscreenModal
  if (selectedType === 'church') {
    return (
      <FullscreenModal
        isOpen={true}
        onClose={onClose}
        onBack={handleBackToHub}
        showBackButton={true}
        title="Référencer une Église"
        subtitle="Ajoutez un nouveau lieu de culte"
        headerIcon={
          <div 
            className="w-10 h-10 rounded-culteo flex items-center justify-center"
            style={{background: 'linear-gradient(135deg, #0A6847, #FFC107)', borderRadius: '12px'}}
          >
            <Church className="h-5 w-5 text-white" />
          </div>
        }
      >
        <ContributeForm 
          isOpen={true} // Doit être true pour s'afficher
          onClose={onClose}
          onBack={handleBackToHub}
          supabase={supabase}
        />
      </FullscreenModal>
    );
  }

  if (selectedType === 'testimony') {
    return (
      <FullscreenModal
        isOpen={true}
        onClose={onClose}
        onBack={handleBackToHub}
        showBackButton={true}
        title="Partager un Témoignage"
        subtitle="Inspirez la communauté"
        headerIcon={
          <div 
            className="w-10 h-10 rounded-culteo flex items-center justify-center"
            style={{background: 'linear-gradient(135deg, #FFC107, #0A6847)', borderRadius: '12px'}}
          >
            <Star className="h-5 w-5 text-white" />
          </div>
        }
      >
        <TestimonyForm 
          isOpen={true} // Doit être true pour s'afficher
          onClose={onClose}
          onBack={handleBackToHub}
          supabase={supabase}
        />
      </FullscreenModal>
    );
  }

  if (selectedType === 'prayer') {
    return (
      <FullscreenModal
        isOpen={true}
        onClose={onClose}
        onBack={handleBackToHub}
        showBackButton={true}
        title="Demande de Prière"
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
          isOpen={true} // Doit être true pour s'afficher
          onClose={onClose}
          onBack={handleBackToHub}
          supabase={supabase}
        />
      </FullscreenModal>
    );
  }

  // Affichage du hub principal
  return (
    <FullscreenModal
      isOpen={isOpen}
      onClose={onClose}
      title="Contribuer à Culteo"
      subtitle="Chaque contribution compte pour notre communauté"
      headerIcon={
        <div className="relative">
          <div 
            className="w-10 h-10 rounded-culteo flex items-center justify-center shadow-culteo-medium"
            style={{background: 'linear-gradient(135deg, #0A6847, #FFC107)', borderRadius: '12px'}}
          >
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div 
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center animate-pulse"
            style={{background: 'linear-gradient(135deg, #FFC107, #0A6847)'}}
          >
            <Heart className="h-2 w-2 text-white" />
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
            <MapPin className="h-5 w-5 mx-auto mb-2" style={{color: '#0A6847'}} />
            <div className="font-poppins font-bold text-culteo-gris-basalte text-sm" style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}>1500+</div>
            <div className="font-lato text-xs" style={{color: 'rgba(61, 61, 61, 0.7)', fontFamily: 'Lato, sans-serif'}}>Lieux</div>
          </div>
          <div>
            <Users className="h-5 w-5 mx-auto mb-2" style={{color: '#0A6847'}} />
            <div className="font-poppins font-bold text-culteo-gris-basalte text-sm" style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}>Actif</div>
            <div className="font-lato text-xs" style={{color: 'rgba(61, 61, 61, 0.7)', fontFamily: 'Lato, sans-serif'}}>Communauté</div>
          </div>
          <div>
            <Globe className="h-5 w-5 mx-auto mb-2" style={{color: '#0A6847'}} />
            <div className="font-poppins font-bold text-culteo-gris-basalte text-sm" style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}>France</div>
            <div className="font-lato text-xs" style={{color: 'rgba(61, 61, 61, 0.7)', fontFamily: 'Lato, sans-serif'}}>Entière</div>
          </div>
        </div>
      </div>

      {/* Liste des options - Mobile First */}
      <div className="space-y-4">
        {contributionOptions.map((option) => {
          const IconComponent = option.icon;
          
          const getIconGradient = (id: string) => {
            const gradients = {
              church: 'linear-gradient(135deg, #0A6847, #FFC107)',
              testimony: 'linear-gradient(135deg, #FFC107, #0A6847)', 
              prayer: 'linear-gradient(135deg, #0A6847, #FFC107)',
              modification: 'linear-gradient(135deg, #3D3D3D, #0A6847)'
            };
            return gradients[id as keyof typeof gradients];
          };

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
                    background: getIconGradient(option.id),
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
          Merci pour votre cœur généreux !
        </h4>
        <p 
          className="font-lato text-xs leading-relaxed"
          style={{color: 'rgba(61, 61, 61, 0.8)', fontFamily: 'Lato, sans-serif'}}
        >
          Ensemble, nous semons des graines d'espoir dans notre communauté spirituelle.
        </p>
      </div>
    </FullscreenModal>
  );
};

export default ContributionHub; 
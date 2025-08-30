import React, { useState, useEffect } from 'react';
import { X, Church, Heart, Star, AlertTriangle, MapPin, Users, Globe, Plus } from 'lucide-react';
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

  // Affichage du formulaire spécifique
  if (selectedType === 'church') {
    return (
      <ContributeForm 
        isOpen={true} 
        onClose={onClose}
        onBack={handleBackToHub}
        supabase={supabase}
      />
    );
  }

  if (selectedType === 'testimony') {
    return (
      <TestimonyForm 
        isOpen={true} 
        onClose={onClose}
        onBack={handleBackToHub}
        supabase={supabase}
      />
    );
  }

  if (selectedType === 'prayer') {
    return (
      <PrayerForm 
        isOpen={true} 
        onClose={onClose}
        onBack={handleBackToHub}
        supabase={supabase}
      />
    );
  }

  // Affichage du hub principal
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-culteo-blanc-pur rounded-culteo md:rounded-culteo-xl shadow-culteo-float w-full max-w-4xl max-h-[95vh] overflow-y-auto scrollbar-culteo">
        {/* Header */}
        <div className="relative p-6 md:p-8 bg-gradient-to-br from-culteo-blanc-coquille via-culteo-blanc-pur to-culteo-blanc-coquille border-b border-culteo-vert-esperance/10" style={{background: 'linear-gradient(135deg, #F9F9F9, #FFFFFF, #F9F9F9)', borderBottomColor: 'rgba(10, 104, 71, 0.1)'}}>
          <button 
            onClick={onClose} 
            className="absolute right-4 md:right-6 top-4 md:top-6 p-2 hover:bg-culteo-blanc-coquille rounded-culteo transition-all duration-300 hover:scale-110"
          >
            <X className="h-5 w-5 text-culteo-gris-basalte" />
          </button>
          
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-culteo-vert-esperance to-culteo-jaune-lumiere rounded-culteo-lg flex items-center justify-center shadow-culteo-medium" style={{background: 'linear-gradient(135deg, #0A6847, #FFC107)', borderRadius: '20px'}}>
                  <Plus className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-culteo-jaune-lumiere to-culteo-vert-esperance rounded-full flex items-center justify-center animate-pulse" style={{background: 'linear-gradient(135deg, #FFC107, #0A6847)'}}>
                  <Heart className="h-2 w-2 md:h-3 md:w-3 text-white" />
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-poppins font-bold text-culteo-gris-basalte mb-3" style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}>
              Contribuer à Culteo
            </h2>
            <p className="font-lato text-culteo-gris-basalte text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{color: '#3D3D3D', fontFamily: 'Lato, sans-serif'}}>
              Choisissez comment vous souhaitez enrichir notre communauté spirituelle. 
              Chaque contribution compte pour bâtir ensemble un réseau de foi vivant.
            </p>
            
            {/* Statistiques rapides */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-6 text-sm">
              <div className="flex items-center gap-2 text-culteo-gris-basalte/70" style={{color: 'rgba(61, 61, 61, 0.7)'}}>
                <MapPin className="h-4 w-4 text-culteo-vert-esperance" style={{color: '#0A6847'}} />
                <span>1500+ lieux</span>
              </div>
              <div className="flex items-center gap-2 text-culteo-gris-basalte/70" style={{color: 'rgba(61, 61, 61, 0.7)'}}>
                <Users className="h-4 w-4 text-culteo-vert-esperance" style={{color: '#0A6847'}} />
                <span>Communauté active</span>
              </div>
              <div className="flex items-center gap-2 text-culteo-gris-basalte/70" style={{color: 'rgba(61, 61, 61, 0.7)'}}>
                <Globe className="h-4 w-4 text-culteo-vert-esperance" style={{color: '#0A6847'}} />
                <span>Toute la France</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des options */}
        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {/* Sur mobile, affichage en accordéon plus compact */}
            {contributionOptions.map((option) => {
              const IconComponent = option.icon;
              
              // Styles inline pour chaque option
              const getInlineStyles = (optionId: string) => {
                const baseStyle = {
                  backgroundColor: '#F9F9F9',
                  borderColor: 'rgba(10, 104, 71, 0.2)',
                  borderRadius: '20px',
                  backfaceVisibility: 'hidden' as const,
                  perspective: '1000px'
                };
                
                const iconColors = {
                  church: 'linear-gradient(135deg, #0A6847, #FFC107)',
                  testimony: 'linear-gradient(135deg, #FFC107, #0A6847)', 
                  prayer: 'linear-gradient(135deg, #0A6847, #FFC107)',
                  modification: 'linear-gradient(135deg, #3D3D3D, #0A6847)'
                };
                
                return { ...baseStyle, '--icon-bg': iconColors[optionId as keyof typeof iconColors] };
              };
              
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedType(option.id)}
                  className={`group relative p-6 md:p-8 border-2 rounded-culteo-lg transition-all duration-500 text-left hover:scale-[1.02] hover:shadow-culteo-strong transform-gpu ${option.bgColor} ${option.borderColor} ${option.hoverColor}`}
                  style={getInlineStyles(option.id)}
                >
                  {/* Icône et badge */}
                  <div className="flex items-start justify-between mb-4 md:mb-6">
                    <div 
                      className="w-12 h-12 md:w-14 md:h-14 rounded-culteo flex items-center justify-center shadow-culteo-medium group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                      style={{
                        background: option.id === 'church' ? 'linear-gradient(135deg, #0A6847, #FFC107)' :
                                  option.id === 'testimony' ? 'linear-gradient(135deg, #FFC107, #0A6847)' :
                                  option.id === 'prayer' ? 'linear-gradient(135deg, #0A6847, #FFC107)' :
                                  'linear-gradient(135deg, #3D3D3D, #0A6847)',
                        borderRadius: '16px'
                      }}
                    >
                      <IconComponent className="h-5 w-5 md:h-7 md:w-7 text-white" />
                    </div>
                    <div className="px-3 py-1 md:px-4 md:py-2 bg-culteo-blanc-pur/90 backdrop-blur-sm rounded-culteo text-xs font-lato font-medium text-culteo-gris-basalte shadow-culteo-soft group-hover:bg-culteo-blanc-pur transition-all duration-300" style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#3D3D3D', fontFamily: 'Lato, sans-serif', borderRadius: '16px'}}>
                      {option.stats}
                    </div>
                  </div>

                  {/* Contenu */}
                  <h3 className="text-lg md:text-xl font-poppins font-bold text-culteo-gris-basalte mb-2 md:mb-3 group-hover:text-culteo-vert-esperance transition-colors duration-300" style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}>
                    {option.title}
                  </h3>
                  <p className="font-lato text-culteo-gris-basalte/80 leading-relaxed text-sm mb-4 md:mb-6 group-hover:text-culteo-gris-basalte transition-colors duration-300" style={{color: 'rgba(61, 61, 61, 0.8)', fontFamily: 'Lato, sans-serif'}}>
                    {option.description}
                  </p>

                  {/* Flèche */}
                  <div className="flex items-center text-culteo-gris-basalte/60 group-hover:text-culteo-vert-esperance transition-all duration-300" style={{color: 'rgba(61, 61, 61, 0.6)'}}>
                    <span className="text-sm font-lato font-medium mr-3" style={{fontFamily: 'Lato, sans-serif'}}>Commencer</span>
                    <div className="w-6 h-6 rounded-full bg-culteo-blanc-coquille group-hover:bg-culteo-vert-esperance flex items-center justify-center transition-all duration-300 group-hover:translate-x-1" style={{backgroundColor: '#F9F9F9'}}>
                      <span className="text-xs font-medium group-hover:text-white">→</span>
                    </div>
                  </div>

                  {/* Effet de brillance au hover - plus subtil */}
                  <div className="absolute inset-0 rounded-culteo-lg bg-gradient-to-r from-transparent via-culteo-blanc-pur/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none"></div>
                  
                  {/* Bordure animée invisible pour stabiliser le hover */}
                  <div className="absolute inset-0 rounded-culteo-lg border-2 border-transparent group-hover:border-culteo-blanc-pur/30 transition-all duration-300 pointer-events-none"></div>
                </button>
              );
            })}
          </div>

          {/* Message d'encouragement */}
          <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-culteo-blanc-coquille to-culteo-blanc-pur border border-culteo-vert-esperance/20 rounded-culteo-lg text-center" style={{background: 'linear-gradient(to right, #F9F9F9, #FFFFFF)', borderColor: 'rgba(10, 104, 71, 0.2)', borderRadius: '20px'}}>
            <div className="flex justify-center mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-culteo-vert-esperance to-culteo-jaune-lumiere rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, #0A6847, #FFC107)'}}>
                <Heart className="h-4 w-4 text-white" />
              </div>
            </div>
            <h4 className="font-poppins text-culteo-gris-basalte font-bold mb-2 text-sm md:text-base" style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}>Merci pour votre cœur généreux !</h4>
            <p className="font-lato text-culteo-gris-basalte/80 text-xs md:text-sm leading-relaxed" style={{color: 'rgba(61, 61, 61, 0.8)', fontFamily: 'Lato, sans-serif'}}>
              Chaque contribution, qu'elle soit grande ou petite, participe à édifier une communauté 
              spirituelle plus forte et plus connectée. Ensemble, nous semons des graines d'espoir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionHub; 
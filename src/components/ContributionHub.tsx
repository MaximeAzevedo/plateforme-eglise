import React, { useState } from 'react';
import { X, Church, Heart, Star, AlertTriangle, MapPin, Users, Globe, Plus } from 'lucide-react';
import ContributeForm from './ContributeForm';
import TestimonyForm from './TestimonyForm';
import PrayerForm from './PrayerForm';

interface ContributionHubProps {
  isOpen: boolean;
  onClose: () => void;
  supabase: any;
}

type ContributionType = 'church' | 'testimony' | 'prayer' | 'modification' | null;

const ContributionHub: React.FC<ContributionHubProps> = ({ isOpen, onClose, supabase }) => {
  const [selectedType, setSelectedType] = useState<ContributionType>(null);

  const handleBackToHub = () => {
    setSelectedType(null);
  };

  const contributionOptions = [
    {
      id: 'church' as ContributionType,
      title: 'Référencer une Église',
      description: 'Ajoutez un nouveau lieu de culte à notre carte communautaire',
      icon: Church,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      hoverColor: 'hover:border-amber-400 hover:bg-amber-100',
      stats: '1500+ lieux référencés'
    },
    {
      id: 'testimony' as ContributionType,
      title: 'Partager un Témoignage',
      description: 'Racontez comment Dieu a transformé votre vie et inspirez la communauté',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      hoverColor: 'hover:border-purple-400 hover:bg-purple-100',
      stats: 'Encouragez des milliers'
    },
    {
      id: 'prayer' as ContributionType,
      title: 'Demande de Prière',
      description: 'Partagez vos besoins de prière avec notre communauté bienveillante',
      icon: Heart,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      hoverColor: 'hover:border-red-400 hover:bg-red-100',
      stats: 'Prières en communion'
    },
    {
      id: 'modification' as ContributionType,
      title: 'Signaler une Modification',
      description: 'Aidez-nous à maintenir nos informations à jour',
      icon: AlertTriangle,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:border-blue-400 hover:bg-blue-100',
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-b border-amber-200/50">
          <button 
            onClick={onClose} 
            className="absolute right-6 top-6 p-2 hover:bg-white/50 rounded-full transition-all duration-300 hover:scale-110"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                  <Heart className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Contribuer à GOD × CONNECT
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Choisissez comment vous souhaitez enrichir notre communauté spirituelle. 
              Chaque contribution compte pour bâtir ensemble un réseau de foi vivant.
            </p>
            
            {/* Statistiques rapides */}
            <div className="flex justify-center items-center gap-8 mt-6 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>1500+ lieux</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Users className="h-4 w-4" />
                <span>Communauté active</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Globe className="h-4 w-4" />
                <span>Toute la France</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des options */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contributionOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedType(option.id)}
                  className={`group relative p-8 border-2 rounded-2xl transition-all duration-500 text-left hover:scale-[1.02] hover:shadow-2xl transform-gpu ${option.bgColor} ${option.borderColor} ${option.hoverColor}`}
                  style={{
                    backfaceVisibility: 'hidden',
                    perspective: '1000px'
                  }}
                >
                  {/* Icône et badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-gray-600 shadow-sm group-hover:bg-white/90 transition-all duration-300">
                      {option.stats}
                    </div>
                  </div>

                  {/* Contenu */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    {option.description}
                  </p>

                  {/* Flèche */}
                  <div className="flex items-center text-gray-400 group-hover:text-gray-600 transition-all duration-300">
                    <span className="text-sm font-medium mr-3">Commencer</span>
                    <div className="w-6 h-6 rounded-full bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                      <span className="text-xs font-medium">→</span>
                    </div>
                  </div>

                  {/* Effet de brillance au hover - plus subtil */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none"></div>
                  
                  {/* Bordure animée invisible pour stabiliser le hover */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-all duration-300 pointer-events-none"></div>
                </button>
              );
            })}
          </div>

          {/* Message d'encouragement */}
          <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl text-center">
            <div className="flex justify-center mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
            </div>
            <h4 className="text-gray-900 font-bold mb-2">Merci pour votre cœur généreux !</h4>
            <p className="text-gray-600 text-sm">
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
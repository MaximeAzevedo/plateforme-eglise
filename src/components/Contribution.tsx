import React from 'react';
import { Plus, AlertCircle, MapPin, Heart } from 'lucide-react';

interface ContributionProps {
  onAddPlace?: () => void;
}

const Contribution: React.FC<ContributionProps> = ({ onAddPlace }) => {
  return (
    <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      {/* Titre de la section */}
      <div className="text-center mb-12">
        <h2 className="text-gray-800 font-body text-2xl font-medium mb-6">
          Ensemble, faisons vivre la carte
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Illustration et contenu textuel */}
        <div className="space-y-8">
          {/* Image de collaboration */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full">
              <img 
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=500&h=350&q=80"
                alt="Personnes qui collaborent"
                className="w-full h-64 object-cover rounded-3xl shadow-lg transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=500&h=350&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
              
              {/* Badge de collaboration */}
              <div className="absolute top-4 right-4">
                <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md">
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
              </div>
              
              {/* Éléments décoratifs */}
              <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-yellow-500 rounded-full animate-pulse shadow-md"></div>
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full shadow-sm"></div>
            </div>
          </div>

          {/* Paragraphe explicatif */}
          <div className="space-y-6">
            <p className="text-gray-700 font-body text-base leading-relaxed">
              <strong>Culteo</strong> est une plateforme collaborative. La richesse de l'information dépend de vous. 
              Aidez-nous à créer une communauté spirituelle vivante en partageant vos lieux de culte, témoignages et demandes de prière.
            </p>
          </div>
        </div>

        {/* Boutons d'action avec hauteur équilibrée */}
        <div className="flex items-center h-full">
          <div className="w-full bg-gray-50 rounded-3xl p-8 space-y-6 shadow-sm">
            <h3 className="text-gray-800 font-body text-base font-medium text-center mb-8">
              Comment contribuer ?
            </h3>
            
            {/* Bouton Ajouter un lieu */}
            <button
              onClick={onAddPlace}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl shadow-md hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105"
            >
              <div className="p-2 bg-white/20 rounded-full">
                <Plus className="h-5 w-5" />
              </div>
              <span className="font-body font-medium text-sm">Contribuer à la plateforme</span>
            </button>

            {/* Bouton Suggérer une modification */}
            <button 
              onClick={onAddPlace}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl shadow-md hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 transform hover:scale-105"
            >
              <div className="p-2 bg-gray-100 rounded-full">
                <AlertCircle className="h-5 w-5 text-gray-600" />
              </div>
              <span className="font-body font-medium text-sm">Découvrir toutes les options</span>
            </button>

            {/* Message d'encouragement */}
            <div className="text-center pt-6">
              <p className="text-gray-600 font-body text-sm">
                🙏 Chaque contribution compte pour enrichir notre communauté
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contribution; 
import React from 'react';
import { Plus, AlertCircle, MapPin, Heart, Users, Star } from 'lucide-react';

interface ContributionProps {
  onAddPlace?: () => void;
}

const Contribution: React.FC<ContributionProps> = ({ onAddPlace }) => {
  return (
    <section className="bg-culteo-blanc-coquille py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-culteo-blanc-pur rounded-culteo-xl shadow-culteo-float border border-gray-100 p-8 md:p-12">
          
          {/* Titre de la section */}
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-culteo-gris-basalte text-3xl md:text-4xl mb-6">
              Ensemble, faisons vivre la carte
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-culteo-jaune-lumiere to-culteo-vert-esperance mx-auto rounded-full mb-6"></div>
            <p className="font-lato text-culteo-gris-basalte text-lg max-w-3xl mx-auto leading-relaxed">
              <strong className="text-culteo-vert-esperance">Culteo</strong> est une plateforme collaborative. 
              La richesse de l'information dépend de vous. Aidez-nous à créer une communauté spirituelle vivante.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Illustration et contenu textuel */}
            <div className="space-y-8">
              {/* Image de collaboration avec style Culteo */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-culteo shadow-culteo-medium">
                  <img 
                    src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&h=400&q=80"
                    alt="Personnes qui collaborent"
                    className="w-full h-80 object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&h=400&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-culteo-gris-basalte/40 via-transparent to-transparent"></div>
                  
                  {/* Badge de collaboration */}
                  <div className="absolute top-6 right-6">
                    <div className="p-3 bg-culteo-blanc-pur/95 backdrop-blur-sm rounded-culteo shadow-culteo-soft">
                      <Heart className="h-6 w-6 text-red-500" />
                    </div>
                  </div>
                  
                  {/* Éléments décoratifs Culteo */}
                  <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-culteo-jaune-lumiere rounded-culteo animate-pulse shadow-culteo-soft"></div>
                  <div className="absolute -top-3 -left-3 w-6 h-6 bg-culteo-vert-esperance rounded-culteo shadow-culteo-soft"></div>
                </div>
              </div>

              {/* Stats de la communauté */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-culteo-blanc-coquille rounded-culteo">
                  <div className="w-12 h-12 bg-culteo-vert-esperance rounded-culteo flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="font-poppins font-bold text-culteo-gris-basalte text-2xl">500+</div>
                  <div className="font-lato text-culteo-gris-basalte text-sm">Lieux</div>
                </div>
                
                <div className="text-center p-4 bg-culteo-blanc-coquille rounded-culteo">
                  <div className="w-12 h-12 bg-culteo-jaune-lumiere rounded-culteo flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="font-poppins font-bold text-culteo-gris-basalte text-2xl">1K+</div>
                  <div className="font-lato text-culteo-gris-basalte text-sm">Visiteurs</div>
                </div>
                
                <div className="text-center p-4 bg-culteo-blanc-coquille rounded-culteo">
                  <div className="w-12 h-12 bg-red-500 rounded-culteo flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="font-poppins font-bold text-culteo-gris-basalte text-2xl">50+</div>
                  <div className="font-lato text-culteo-gris-basalte text-sm">Témoignages</div>
                </div>
              </div>
            </div>

            {/* Actions de contribution avec style Culteo */}
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="font-poppins font-bold text-culteo-gris-basalte text-2xl mb-4">
                  Comment contribuer ?
                </h3>
                <p className="font-lato text-culteo-gris-basalte text-base">
                  Chaque contribution compte pour enrichir notre communauté
                </p>
              </div>
              
              {/* Bouton principal - Contribuer */}
              <button
                onClick={onAddPlace}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-culteo-vert-esperance to-culteo-jaune-lumiere text-white rounded-culteo-lg p-8 shadow-culteo-medium hover:shadow-culteo-strong transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-culteo group-hover:scale-110 transition-transform duration-300">
                    <Plus className="h-8 w-8" />
                  </div>
                  <div className="text-left">
                    <div className="font-poppins font-bold text-xl mb-1">Contribuer à Culteo</div>
                    <div className="font-lato text-sm opacity-90">Ajoutez un lieu, un témoignage, une prière...</div>
                  </div>
                </div>
                
                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </button>

              {/* Options secondaires */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={onAddPlace}
                  className="group p-6 bg-culteo-blanc-coquille border-2 border-gray-200 text-culteo-gris-basalte rounded-culteo hover:border-culteo-vert-esperance hover:bg-white transition-all duration-300 text-center"
                >
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="font-poppins font-semibold text-sm mb-1">Témoignages</div>
                  <div className="font-lato text-xs text-culteo-gris-basalte/70">Partagez votre histoire</div>
                </button>

                <button 
                  onClick={onAddPlace}
                  className="group p-6 bg-culteo-blanc-coquille border-2 border-gray-200 text-culteo-gris-basalte rounded-culteo hover:border-culteo-jaune-lumiere hover:bg-white transition-all duration-300 text-center"
                >
                  <Star className="h-8 w-8 text-culteo-jaune-lumiere mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="font-poppins font-semibold text-sm mb-1">Prières</div>
                  <div className="font-lato text-xs text-culteo-gris-basalte/70">Intentions de prière</div>
                </button>
              </div>

              {/* Message inspirant */}
              <div className="text-center p-6 bg-gradient-to-r from-culteo-vert-esperance/10 to-culteo-jaune-lumiere/10 rounded-culteo border border-culteo-vert-esperance/20">
                <p className="font-lato text-culteo-gris-basalte text-sm italic mb-2">
                  "Là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux"
                </p>
                <cite className="font-lato text-culteo-vert-esperance text-xs">— Matthieu 18:20</cite>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contribution; 
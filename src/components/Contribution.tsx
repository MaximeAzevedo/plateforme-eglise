import React from 'react';
import { Plus, AlertCircle, MapPin, Heart, Users, Star } from 'lucide-react';

interface ContributionProps {
  onAddPlace?: () => void;
}

const Contribution: React.FC<ContributionProps> = ({ onAddPlace }) => {
  return (
    <section className="bg-culteo-blanc-coquille py-12 md:py-20" style={{backgroundColor: '#F9F9F9'}}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-culteo-blanc-pur rounded-culteo-xl shadow-culteo-float border border-culteo-vert-esperance/10 p-6 md:p-8 lg:p-12" style={{backgroundColor: '#FFFFFF', borderColor: 'rgba(10, 104, 71, 0.1)'}}>
          
          {/* Titre de la section */}
          <div className="text-center mb-8 md:mb-16">
            <h2 className="font-poppins font-bold text-culteo-gris-basalte text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6" style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}>
              Ensemble, faisons vivre la carte Culteo
            </h2>
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-culteo-jaune-lumiere to-culteo-vert-esperance mx-auto rounded-full mb-4 md:mb-6" style={{background: 'linear-gradient(to right, #FFC107, #0A6847)'}}></div>
            <p className="font-lato text-culteo-gris-basalte text-base md:text-lg max-w-3xl mx-auto leading-relaxed px-4" style={{color: '#3D3D3D', fontFamily: 'Lato, sans-serif'}}>
              <strong className="text-culteo-vert-esperance" style={{color: '#0A6847'}}>Culteo</strong> est une plateforme collaborative. 
              La richesse de l'information dépend de vous. Aidez-nous à créer une communauté spirituelle vivante.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            
            {/* Illustration et contenu textuel */}
            <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
              {/* Image de collaboration avec style Culteo */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-culteo shadow-culteo-medium">
                  <img 
                    src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&h=400&q=80"
                    alt="Personnes qui collaborent"
                    className="w-full h-60 md:h-80 object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&h=400&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-culteo-gris-basalte/40 via-transparent to-transparent"></div>
                  
                  {/* Badge de collaboration */}
                  <div className="absolute top-4 right-4 md:top-6 md:right-6">
                    <div className="p-2 md:p-3 bg-culteo-blanc-pur/95 backdrop-blur-sm rounded-culteo shadow-culteo-soft">
                      <Heart className="h-5 w-5 md:h-6 md:w-6 text-culteo-vert-esperance" />
                    </div>
                  </div>
                  
                  {/* Éléments décoratifs Culteo */}
                  <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 w-6 h-6 md:w-8 md:h-8 bg-culteo-jaune-lumiere rounded-culteo animate-pulse shadow-culteo-soft"></div>
                  <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-4 h-4 md:w-6 md:h-6 bg-culteo-vert-esperance rounded-culteo shadow-culteo-soft"></div>
                </div>
              </div>

              {/* Stats de la communauté */}
              <div className="grid grid-cols-3 gap-3 md:gap-6">
                <div className="text-center p-3 md:p-4 bg-culteo-blanc-coquille rounded-culteo">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-culteo-vert-esperance rounded-culteo flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <MapPin className="h-4 w-4 md:h-6 md:w-6 text-white" />
                  </div>
                  <div className="font-poppins font-bold text-culteo-gris-basalte text-lg md:text-2xl">1500+</div>
                  <div className="font-lato text-culteo-gris-basalte text-xs md:text-sm">Lieux</div>
                </div>
                
                <div className="text-center p-3 md:p-4 bg-culteo-blanc-coquille rounded-culteo">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-culteo-jaune-lumiere rounded-culteo flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <Users className="h-4 w-4 md:h-6 md:w-6 text-white" />
                  </div>
                  <div className="font-poppins font-bold text-culteo-gris-basalte text-lg md:text-2xl">1K+</div>
                  <div className="font-lato text-culteo-gris-basalte text-xs md:text-sm">Visiteurs</div>
                </div>
                
                <div className="text-center p-3 md:p-4 bg-culteo-blanc-coquille rounded-culteo">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-culteo-vert-esperance to-culteo-jaune-lumiere rounded-culteo flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <Star className="h-4 w-4 md:h-6 md:w-6 text-white" />
                  </div>
                  <div className="font-poppins font-bold text-culteo-gris-basalte text-lg md:text-2xl">50+</div>
                  <div className="font-lato text-culteo-gris-basalte text-xs md:text-sm">Témoignages</div>
                </div>
              </div>
            </div>

            {/* Actions de contribution avec style Culteo */}
            <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
              <div className="text-center mb-6 md:mb-8">
                <h3 className="font-poppins font-bold text-culteo-gris-basalte text-xl md:text-2xl mb-3 md:mb-4">
                  Comment contribuer ?
                </h3>
                <p className="font-lato text-culteo-gris-basalte text-sm md:text-base px-4">
                  Chaque contribution compte pour enrichir notre communauté
                </p>
              </div>
              
              {/* Bouton principal - Contribuer */}
              <button
                onClick={onAddPlace}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-culteo-vert-esperance to-culteo-jaune-lumiere text-white rounded-culteo-lg p-6 md:p-8 shadow-culteo-medium hover:shadow-culteo-strong transition-all duration-300 transform hover:scale-105"
                style={{
                  background: 'linear-gradient(to right, #0A6847, #FFC107)',
                  borderRadius: '30px',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-4">
                  <div className="p-2 md:p-3 bg-white/20 rounded-culteo group-hover:scale-110 transition-transform duration-300">
                    <Plus className="h-6 w-6 md:h-8 md:w-8" />
                  </div>
                  <div className="text-center md:text-left">
                    <div className="font-poppins font-bold text-lg md:text-xl mb-1">Contribuer à Culteo</div>
                    <div className="font-lato text-xs md:text-sm opacity-90">Ajoutez un lieu, un témoignage, une prière...</div>
                  </div>
                </div>
                
                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </button>

              {/* Options secondaires */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <button 
                  onClick={onAddPlace}
                  className="group p-4 md:p-6 bg-culteo-blanc-coquille border-2 border-culteo-vert-esperance/20 text-culteo-gris-basalte rounded-culteo hover:border-culteo-vert-esperance hover:bg-culteo-blanc-pur transition-all duration-300 text-center"
                >
                  <Heart className="h-6 w-6 md:h-8 md:w-8 text-culteo-vert-esperance mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="font-poppins font-semibold text-sm mb-1">Témoignages</div>
                  <div className="font-lato text-xs text-culteo-gris-basalte/70">Partagez votre histoire</div>
                </button>

                <button 
                  onClick={onAddPlace}
                  className="group p-4 md:p-6 bg-culteo-blanc-coquille border-2 border-culteo-jaune-lumiere/20 text-culteo-gris-basalte rounded-culteo hover:border-culteo-jaune-lumiere hover:bg-culteo-blanc-pur transition-all duration-300 text-center"
                >
                  <Star className="h-6 w-6 md:h-8 md:w-8 text-culteo-jaune-lumiere mx-auto mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="font-poppins font-semibold text-sm mb-1">Prières</div>
                  <div className="font-lato text-xs text-culteo-gris-basalte/70">Intentions de prière</div>
                </button>
              </div>

              {/* Message inspirant */}
              <div className="text-center p-4 md:p-6 bg-gradient-to-r from-culteo-vert-esperance/10 to-culteo-jaune-lumiere/10 rounded-culteo border border-culteo-vert-esperance/20">
                <p className="font-lato text-culteo-gris-basalte text-xs md:text-sm italic mb-2 leading-relaxed">
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
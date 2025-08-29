import React from 'react';
import { Search, MapPin, Users, Globe, Heart, Star } from 'lucide-react';

interface WhoWeAreForProps {
  onExploreClick?: () => void;
  onMapClick?: () => void;
  onContributeClick?: () => void;
}

const WhoWeAreFor: React.FC<WhoWeAreForProps> = ({
  onExploreClick,
  onMapClick,
  onContributeClick
}) => {
  return (
    <section className="bg-culteo-blanc-coquille py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-culteo-blanc-pur rounded-culteo-xl shadow-culteo-float border border-gray-100 p-8 md:p-12">
      {/* Titre de la section */}
      <div className="text-center mb-16">
        <h2 className="font-poppins font-bold text-culteo-gris-basalte text-3xl md:text-4xl mb-6">
          Une réponse pour chaque chemin
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-culteo-jaune-lumiere to-culteo-vert-esperance mx-auto rounded-full mb-6"></div>
        <p className="font-lato text-culteo-gris-basalte text-lg max-w-2xl mx-auto leading-relaxed">
          Que vous soyez en quête spirituelle, en voyage, ou désireux de partager votre foi, 
          <span className="text-culteo-vert-esperance font-semibold"> Culteo vous accompagne</span>.
        </p>
      </div>

      {/* Structure en 3 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        
        {/* Pour vous qui explorez */}
        <div className="group text-center space-y-6">
          <div className="relative overflow-hidden rounded-culteo shadow-culteo-soft hover:shadow-culteo-medium transition-all duration-500">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=300&q=80"
              alt="Jeune femme pensive"
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=300&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-culteo-vert-esperance/60 via-culteo-vert-esperance/20 to-transparent group-hover:from-culteo-vert-esperance/70 transition-all duration-500"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-culteo-blanc-pur/90 backdrop-blur-sm rounded-culteo p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-culteo-vert-esperance rounded-culteo flex items-center justify-center">
                    <Search className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-lato text-culteo-gris-basalte font-medium text-sm">Exploration spirituelle</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-poppins font-bold text-culteo-gris-basalte text-xl">
              Pour vous qui explorez
            </h3>
            
            <p className="font-lato text-culteo-gris-basalte text-base leading-relaxed">
              Trouvez un lieu sûr et bienveillant pour poser vos questions et nourrir votre quête de sens dans un environnement accueillant.
            </p>

            <div className="flex justify-center pt-2">
              <button 
                onClick={() => {
                  console.log('Exploration spirituelle');
                  onExploreClick?.();
                }}
                className="group/btn px-6 py-3 bg-culteo-blanc-pur border-2 border-culteo-vert-esperance/30 text-culteo-vert-esperance rounded-culteo font-poppins font-medium hover:border-culteo-vert-esperance hover:bg-culteo-vert-esperance hover:text-white transition-all duration-300 flex items-center gap-2 shadow-culteo-soft hover:shadow-culteo-medium"
              >
                <Globe className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                <span>Découvrir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pour vous qui voyagez */}
        <div className="group text-center space-y-6">
          <div className="relative overflow-hidden rounded-culteo shadow-culteo-soft hover:shadow-culteo-medium transition-all duration-500">
            <img 
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&h=300&q=80"
              alt="Famille souriante"
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-culteo-jaune-lumiere/60 via-culteo-jaune-lumiere/20 to-transparent group-hover:from-culteo-jaune-lumiere/70 transition-all duration-500"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-culteo-blanc-pur/90 backdrop-blur-sm rounded-culteo p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-culteo-jaune-lumiere rounded-culteo flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-lato text-culteo-gris-basalte font-medium text-sm">Navigation spirituelle</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-poppins font-bold text-culteo-gris-basalte text-xl">
              Pour vous qui voyagez
            </h3>
            
            <p className="font-lato text-culteo-gris-basalte text-base leading-relaxed">
              Localisez en quelques clics une communauté accueillante pour votre famille, où que vous soyez en France.
            </p>

            <div className="flex justify-center pt-2">
              <button 
                onClick={() => {
                  console.log('Navigation vers carte');
                  onMapClick?.();
                }}
                className="group/btn px-6 py-3 bg-culteo-blanc-pur border-2 border-culteo-jaune-lumiere/30 text-culteo-jaune-lumiere rounded-culteo font-poppins font-medium hover:border-culteo-jaune-lumiere hover:bg-culteo-jaune-lumiere hover:text-white transition-all duration-300 flex items-center gap-2 shadow-culteo-soft hover:shadow-culteo-medium"
              >
                <MapPin className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                <span>Localiser</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pour vous qui partagez */}
        <div className="group text-center space-y-6">
          <div className="relative overflow-hidden rounded-culteo shadow-culteo-soft hover:shadow-culteo-medium transition-all duration-500">
            <img 
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&h=300&q=80"
              alt="Groupe de jeunes dynamiques"
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-500/60 via-red-400/20 to-transparent group-hover:from-red-500/70 transition-all duration-500"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-culteo-blanc-pur/90 backdrop-blur-sm rounded-culteo p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500 rounded-culteo flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-lato text-culteo-gris-basalte font-medium text-sm">Communauté vibrante</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-poppins font-bold text-culteo-gris-basalte text-xl">
              Pour vous qui partagez
            </h3>
            
            <p className="font-lato text-culteo-gris-basalte text-base leading-relaxed">
              Donnez de la visibilité à votre communauté et faites connaître la vitalité de votre église auprès des chercheurs spirituels.
            </p>

            <div className="flex justify-center pt-2">
              <button 
                onClick={() => {
                  console.log('Contribution à la communauté');
                  onContributeClick?.();
                }}
                className="group/btn px-6 py-3 bg-culteo-blanc-pur border-2 border-red-400/30 text-red-500 rounded-culteo font-poppins font-medium hover:border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-culteo-soft hover:shadow-culteo-medium"
              >
                <Heart className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                <span>Partager</span>
              </button>
            </div>
          </div>
        </div>
      </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreFor; 
import React from 'react';
import { Search, MapPin, Users, Globe, Heart, Star } from 'lucide-react';

const WhoWeAreFor: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      {/* Titre de la section */}
      <div className="text-center mb-16">
        <h2 className="text-gray-900 font-bold text-3xl md:text-4xl mb-4">
          Une réponse pour chaque chemin
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full mb-4"></div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Que vous soyez en quête spirituelle, en voyage, ou désireux de partager votre foi, 
                        <span className="text-culteo-vert-esperance font-semibold"> Culteo vous accompagne</span>.
        </p>
      </div>

      {/* Structure en 3 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        
        {/* Pour vous qui explorez */}
        <div className="group text-center space-y-6">
          <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=300&q=80"
              alt="Jeune femme pensive"
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=300&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/60 via-emerald-400/20 to-transparent group-hover:from-emerald-600/70 transition-all duration-500"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                    <Search className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium text-sm">Exploration spirituelle</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-gray-900 font-bold text-xl">
              Pour vous qui explorez
            </h3>
            
            <p className="text-gray-600 text-base leading-relaxed">
              Trouvez un lieu sûr et bienveillant pour poser vos questions et nourrir votre quête de sens dans un environnement accueillant.
            </p>

            <div className="flex justify-center">
              <button className="group/btn px-6 py-3 border-2 border-emerald-200 text-emerald-700 rounded-xl font-medium hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300 flex items-center gap-2">
                <Globe className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                <span>Découvrir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pour vous qui voyagez */}
        <div className="group text-center space-y-6">
          <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
            <img 
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&h=300&q=80"
              alt="Famille souriante"
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/60 via-blue-400/20 to-transparent group-hover:from-blue-600/70 transition-all duration-500"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium text-sm">Navigation spirituelle</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-gray-900 font-bold text-xl">
              Pour vous qui voyagez
            </h3>
            
            <p className="text-gray-600 text-base leading-relaxed">
              Localisez en quelques clics une communauté accueillante pour votre famille, où que vous soyez en France.
            </p>

            <div className="flex justify-center">
              <button className="group/btn px-6 py-3 border-2 border-blue-200 text-blue-700 rounded-xl font-medium hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex items-center gap-2">
                <MapPin className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                <span>Localiser</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pour vous qui partagez */}
        <div className="group text-center space-y-6">
          <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500">
            <img 
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&h=300&q=80"
              alt="Groupe de jeunes dynamiques"
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-600/60 via-purple-400/20 to-transparent group-hover:from-purple-600/70 transition-all duration-500"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-800 font-medium text-sm">Communauté vibrante</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-gray-900 font-bold text-xl">
              Pour vous qui partagez
            </h3>
            
            <p className="text-gray-600 text-base leading-relaxed">
              Donnez de la visibilité à votre communauté et faites connaître la vitalité de votre église auprès des chercheurs spirituels.
            </p>

            <div className="flex justify-center">
              <button className="group/btn px-6 py-3 border-2 border-purple-200 text-purple-700 rounded-xl font-medium hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 flex items-center gap-2">
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
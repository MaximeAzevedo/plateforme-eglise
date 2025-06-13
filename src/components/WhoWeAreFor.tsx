import React from 'react';
import { Search, MapPin, Users } from 'lucide-react';

const WhoWeAreFor: React.FC = () => {
  return (
    <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      {/* Titre de la section */}
      <div className="text-center mb-12">
        <h2 className="text-gray-800 font-body text-2xl font-medium mb-4">
          Une réponse pour chaque chemin
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
      </div>

      {/* Structure en 3 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Pour vous qui explorez */}
        <div className="text-center space-y-6">
          <div className="relative overflow-hidden rounded-2xl shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=300&q=80"
              alt="Jeune femme pensive"
              className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=300&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Search className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            
            <h3 className="text-gray-800 font-body text-lg font-medium">
              Pour vous qui explorez
            </h3>
            
            <p className="text-gray-600 font-body text-base leading-relaxed">
              Trouvez un lieu sûr et bienveillant pour poser vos questions et nourrir votre quête de sens.
            </p>
          </div>
        </div>

        {/* Pour vous qui voyagez */}
        <div className="text-center space-y-6">
          <div className="relative overflow-hidden rounded-2xl shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&h=300&q=80"
              alt="Famille souriante"
              className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <MapPin className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            
            <h3 className="text-gray-800 font-body text-lg font-medium">
              Pour vous qui voyagez
            </h3>
            
            <p className="text-gray-600 font-body text-base leading-relaxed">
              Localisez en quelques clics une communauté accueillante pour votre famille, où que vous soyez en France.
            </p>
          </div>
        </div>

        {/* Pour vous qui partagez */}
        <div className="text-center space-y-6">
          <div className="relative overflow-hidden rounded-2xl shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&h=300&q=80"
              alt="Groupe de jeunes dynamiques"
              className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            
            <h3 className="text-gray-800 font-body text-lg font-medium">
              Pour vous qui partagez
            </h3>
            
            <p className="text-gray-600 font-body text-base leading-relaxed">
              Donnez de la visibilité à votre communauté et faites connaître la vitalité de votre église.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreFor; 
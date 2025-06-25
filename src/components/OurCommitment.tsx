import React from 'react';
import { Shield, ExternalLink, CheckCircle, Crown, Heart } from 'lucide-react';

const OurCommitment: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm border border-amber-200/50 rounded-3xl p-8 md:p-12 shadow-xl">
      {/* Titre de la section */}
      <div className="text-center mb-12">
        <h2 className="text-gray-900 font-bold text-3xl md:text-4xl mb-6">
          Explorez en toute sérénité
        </h2>
        
        {/* Logo/Badge de confiance modernisé */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/90 backdrop-blur-sm border-2 border-amber-200 rounded-2xl px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-gray-900 font-bold text-lg flex items-center gap-2">
                  <span>Charte de Confiance</span>
                  <Crown className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-amber-600 font-semibold text-sm">
                  GOD × CONNECT certifié
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu enrichi */}
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Paragraphe principal */}
        <div className="text-center">
          <p className="text-gray-700 text-lg leading-relaxed">
            Chaque communauté présente sur <span className="font-bold text-amber-600">GOD × CONNECT</span> adhère à notre 
            <span className="font-bold text-gray-900"> Charte de Confiance</span>. 
            Nous nous engageons à ne référencer que des lieux appartenant aux grandes familles du christianisme historique, 
            garantissant le respect des personnes et une démarche de foi authentique.
          </p>
        </div>

        {/* Points de confiance */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Vérification rigoureuse</h3>
            <p className="text-gray-600 text-sm">
              Chaque lieu est validé selon nos critères de qualité et d'authenticité spirituelle.
            </p>
          </div>

          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Respect garanti</h3>
            <p className="text-gray-600 text-sm">
              Environnement bienveillant pour tous les profils spirituels, du chercheur au croyant confirmé.
            </p>
          </div>

          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Authenticité spirituelle</h3>
            <p className="text-gray-600 text-sm">
              Communautés ancrées dans la tradition chrétienne historique et l'amour du prochain.
            </p>
          </div>
        </div>
        
        {/* Call to action modernisé */}
        <div className="text-center pt-6">
          <div className="inline-flex items-center gap-4">
            <a 
              href="#" 
              className="group inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border-2 border-amber-200 text-amber-700 hover:border-amber-400 hover:bg-amber-50 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              <span>Découvrir notre Charte</span>
              <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </a>

            <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Crown className="h-4 w-4" />
              <span>Rejoindre la communauté</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurCommitment; 
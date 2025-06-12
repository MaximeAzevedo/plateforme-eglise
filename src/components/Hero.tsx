import React from 'react';
import { Church, Heart, MapPin, Star, ArrowDown, Cross, Bird, Flame, Waves } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToSearch = () => {
    const searchElement = document.getElementById('search-section');
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary via-sand-light to-sand overflow-hidden">
      {/* Motif décoratif de fond - plus visible */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute top-32 left-20 transform rotate-12">
          <Church size={150} className="text-accent/20" />
        </div>
        <div className="absolute top-60 right-32 transform -rotate-12">
          <Heart size={120} className="text-title/15" />
        </div>
        <div className="absolute bottom-40 left-1/4 transform rotate-45">
          <Star size={80} className="text-accent/25" />
        </div>
        <div className="absolute bottom-60 right-1/3 transform -rotate-45">
          <MapPin size={140} className="text-title/20" />
        </div>
        <div className="absolute top-1/2 left-1/12 transform rotate-90">
          <Cross size={100} className="text-accent/15" />
        </div>
        <div className="absolute top-1/3 right-1/12 transform -rotate-45">
          <Bird size={90} className="text-title/20" />
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="relative z-10 container-dune py-24 min-h-screen flex flex-col justify-center">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          
          {/* Logo et titre principal */}
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="p-8 bg-accent-gradient rounded-full shadow-strong relative">
                <Church className="h-20 w-20 text-white" />
                {/* Cercles décoratifs autour du logo */}
                <div className="absolute -inset-3 border-2 border-accent/30 rounded-full animate-pulse"></div>
                <div className="absolute -inset-6 border border-accent/20 rounded-full"></div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-title font-heading text-5xl md:text-7xl font-bold leading-tight">
                Vers Lui
              </h1>
              <p className="text-title font-heading text-2xl md:text-3xl font-medium italic opacity-90">
                Dieu t'attend quelque part
              </p>
            </div>
          </div>

          {/* Description du projet */}
          <div className="max-w-3xl mx-auto space-y-8">
            <p className="text-text font-body text-xl md:text-2xl leading-relaxed">
              Découvrez les <strong className="text-accent">lieux de culte chrétiens</strong> près de chez vous. 
              Une plateforme œcuménique qui rassemble toutes les confessions pour vous aider à 
              <strong className="text-title"> trouver votre communauté spirituelle</strong>.
            </p>
            
            {/* Statistiques inspirantes */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16">
              <div className="space-y-3">
                <div className="text-4xl md:text-5xl font-heading font-bold text-accent">1,500+</div>
                <div className="text-base text-text font-body">Lieux référencés</div>
              </div>
              <div className="space-y-3">
                <div className="text-4xl md:text-5xl font-heading font-bold text-accent">2.4k+</div>
                <div className="text-base text-text font-body">Communauté</div>
              </div>
              <div className="col-span-2 md:col-span-1 space-y-3">
                <div className="text-4xl md:text-5xl font-heading font-bold text-accent">100%</div>
                <div className="text-base text-text font-body">Œcuménique</div>
              </div>
            </div>
          </div>

          {/* Confessions représentées avec icônes Lucide */}
          <div className="space-y-6">
            <p className="text-text font-body text-base opacity-75">
              Toutes les confessions chrétiennes sont les bienvenues
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Church, label: 'Catholique', color: 'bg-accent/10 text-accent border-accent/20' },
                { icon: Cross, label: 'Protestante', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
                { icon: Star, label: 'Orthodoxe', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
                { icon: Bird, label: 'Évangélique', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
                { icon: Flame, label: 'Pentecôtiste', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
                { icon: Waves, label: 'Baptiste', color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20' },
                { icon: Heart, label: 'Autres', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20' }
              ].map((confession, index) => {
                const IconComponent = confession.icon;
                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 px-4 py-3 backdrop-blur-sm rounded-2xl border transition-all duration-300 hover:scale-105 ${confession.color}`}
                  >
                    <IconComponent size={20} />
                    <span className="text-sm font-body font-medium">{confession.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to action */}
          <div className="pt-12">
            <div className="relative inline-block">
              {/* Cercle décoratif derrière le bouton - plus visible */}
              <div className="absolute inset-0 bg-accent/20 rounded-full scale-150 animate-pulse"></div>
              <div className="absolute inset-0 bg-accent/10 rounded-full scale-125"></div>
              
              <button
                onClick={scrollToSearch}
                className="relative group inline-flex items-center gap-4 px-10 py-5 bg-accent-gradient text-white rounded-2xl font-body font-semibold text-xl shadow-strong hover:shadow-[0_20px_40px_rgba(211,166,37,0.4)] transition-all duration-300 transform hover:scale-105"
              >
                <span>Commencer ma recherche</span>
                <ArrowDown className="h-6 w-6 group-hover:translate-y-2 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-accent rounded-full flex justify-center backdrop-blur-sm bg-white/20">
          <div className="w-1.5 h-4 bg-accent rounded-full mt-3 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 
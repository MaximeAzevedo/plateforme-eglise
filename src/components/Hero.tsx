import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Heart, 
  Star, 
  Crown, 
  Users, 
  ArrowRight,
  ChevronDown,
  CheckCircle,
  MessageSquare,
  Globe
} from 'lucide-react';

const HERO_BG = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80';

const Hero: React.FC = () => {
  const [currentTestimony, setCurrentTestimony] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const testimonies = [
    {
      text: "Là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux.",
      reference: "Matthieu 18:20"
    },
    {
      text: "La prière fervente du juste produit de grands effets.",
      reference: "Jacques 5:16"
    },
    {
      text: "Rendez-vous témoignage les uns aux autres de la grâce de Dieu.",
      reference: "1 Pierre 4:10"
    }
  ];

  const stats = [
    { value: '2852', label: 'Prières exaucées', icon: CheckCircle, color: 'from-emerald-400 to-teal-500' },
    { value: '15,230', label: 'Âmes connectées', icon: Users, color: 'from-pink-400 to-rose-500' },
    { value: '1,456', label: 'Témoignages', icon: MessageSquare, color: 'from-amber-400 to-orange-500' },
    { value: '342', label: 'Communautés', icon: Globe, color: 'from-blue-400 to-indigo-500' }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const testimonyInterval = setInterval(() => {
      setCurrentTestimony((prev) => (prev + 1) % testimonies.length);
    }, 4000);

    return () => clearInterval(testimonyInterval);
  }, []);

  const scrollToSearch = () => {
    const searchSection = document.getElementById('search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentTestimonyData = testimonies[currentTestimony];

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(15,23,42,0.8) 0%, rgba(30,41,59,0.6) 50%, rgba(15,23,42,0.8) 100%), url('${HERO_BG}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Effets de lumière divine */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center px-6 py-20">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Citation spirituelle en haut */}
          <div className="mb-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-2xl mx-auto">
              <blockquote className="text-white/90 text-lg md:text-xl italic font-light leading-relaxed mb-4">
                "{currentTestimonyData.text}"
              </blockquote>
              
              <cite className="text-white/70 font-semibold text-sm">
                — {currentTestimonyData.reference}
              </cite>
            </div>
          </div>

          {/* Titre principal */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
            </div>

            <h1 className="font-bold text-5xl md:text-7xl mb-6 leading-tight text-white drop-shadow-2xl">
              <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                GOD
              </span>
              <span className="text-white mx-3">×</span>
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                CONNECT
              </span>
            </h1>
            
            <p className="text-white/80 text-xl md:text-2xl font-light italic">
              Là où les âmes se rencontrent
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="flex justify-center mb-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-white font-bold text-2xl mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-12 max-w-3xl mx-auto">
            <p className="text-white/90 text-lg leading-relaxed">
              Découvrez une communauté spirituelle vivante où chaque prière compte, 
              chaque témoignage inspire, et chaque rencontre peut changer une vie.
            </p>
            <p className="text-yellow-300 font-semibold text-lg mt-2">
              Ensemble, nous marchons vers la lumière.
            </p>
          </div>

          {/* Actions principales */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={scrollToSearch}
              className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <MapPin className="h-5 w-5" />
              <span>Trouver ma communauté</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex gap-3">
              <button className="px-6 py-4 border-2 border-white/30 text-white rounded-2xl font-medium hover:border-purple-400 hover:bg-purple-500/20 backdrop-blur-sm transition-all duration-300 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>Mur de Prière</span>
              </button>

              <button className="px-6 py-4 border-2 border-white/30 text-white rounded-2xl font-medium hover:border-amber-400 hover:bg-amber-500/20 backdrop-blur-sm transition-all duration-300 flex items-center gap-2">
                <Star className="h-5 w-5" />
                <span>Témoignages</span>
              </button>
            </div>
          </div>

          {/* Indicateurs de communauté active */}
          <div className="flex items-center justify-center space-x-8 text-white/60 text-sm mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>En ligne maintenant</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>24/7 communauté active</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Présence de l'Esprit</span>
            </div>
          </div>

        </div>
      </div>

      {/* Overlay sombre pour contraste */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero; 
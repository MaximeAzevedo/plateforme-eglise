import React from 'react';
import { Heart, Mail, Github, Twitter, MapPin, Church, Star } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-title text-white relative overflow-hidden">
      {/* Fond décoratif subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-title via-text to-title opacity-90"></div>
      
      <div className="relative z-10 container-dune py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Section identité Vers Lui */}
          <div className="space-y-6">
            {/* Logo et slogan */}
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-accent-gradient rounded-xl shadow-soft">
                <Church className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-bold text-white">
                  Vers Lui
                </h3>
                <p className="text-sand-light font-body italic">
                  Dieu t'attend quelque part
                </p>
              </div>
            </div>
            
            {/* Statistiques Dune */}
            <div className="flex space-x-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="text-lg font-bold text-accent font-heading">1,500+</div>
                <div className="text-xs text-sand-light">Lieux référencés</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="text-lg font-bold text-accent font-heading">2.4k+</div>
                <div className="text-xs text-sand-light">Communauté</div>
              </div>
            </div>
          </div>

          {/* Navigation spirituelle */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold text-white flex items-center space-x-2">
              <span>🗺️</span>
              <span>Navigation spirituelle</span>
            </h4>
            <div className="space-y-2 text-sm text-sand-light">
              <div className="hover:text-accent transition-colors cursor-pointer">Explorer la carte</div>
              <div className="hover:text-accent transition-colors cursor-pointer">Rechercher un lieu</div>
              <div className="hover:text-accent transition-colors cursor-pointer">Référencer une Église</div>
              <div className="hover:text-accent transition-colors cursor-pointer">À propos de Vers Lui</div>
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold text-white flex items-center space-x-2">
              <span>📬</span>
              <span>Restez connectés</span>
            </h4>
            <div className="space-y-3">
              <a 
                href="mailto:contact@vers-lui.fr" 
                className="group flex items-center space-x-3 text-sand-light hover:text-accent transition-all duration-200"
              >
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Mail size={16} />
                </div>
                <span className="text-sm">contact@vers-lui.fr</span>
              </a>
              
              {/* Social links */}
              <div className="flex space-x-3 pt-2">
                <a 
                  href="#" 
                  className="p-2 bg-white/10 rounded-lg hover:bg-accent/20 transition-all duration-200"
                >
                  <Github size={16} className="text-sand-light hover:text-accent" />
                </a>
                <a 
                  href="#" 
                  className="p-2 bg-white/10 rounded-lg hover:bg-accent/20 transition-all duration-200"
                >
                  <Twitter size={16} className="text-sand-light hover:text-accent" />
                </a>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-soft"></div>
              <span className="text-sand-light">Service en ligne</span>
            </div>
          </div>
        </div>

        {/* Divider harmonieux */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8"></div>

        {/* Section finale */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-sand-light">
            <span>Réalisé avec</span>
            <Heart size={16} className="text-accent animate-pulse-soft" />
            <span>pour la communauté chrétienne, 2025</span>
            <span className="text-sand">•</span>
            <span className="text-accent font-medium">
              Nouvelle génération
            </span>
          </div>

          <div className="text-xs text-sand text-center md:text-right">
            <p>Plateforme œcuménique • Toutes confessions chrétiennes • Version 1.0</p>
            <p className="mt-1">
              Powered by 
              <span className="text-accent font-medium ml-1">React</span> • 
              <span className="text-accent font-medium ml-1">Supabase</span> • 
              <span className="text-accent font-medium ml-1">Modern Web</span>
            </p>
          </div>
        </div>

        {/* Call to action spirituel */}
        <div className="mt-8 p-6 bg-sand-gradient/10 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="text-center">
            <h5 className="text-lg font-heading font-semibold text-white mb-2 flex items-center justify-center space-x-2">
              <Star className="text-accent" size={20} />
              <span>Contribuez à Vers Lui</span>
              <Star className="text-accent" size={20} />
            </h5>
            <p className="text-sand-light text-sm mb-4">
              Aidez-nous à enrichir cette carte spirituelle en référençant les lieux de culte de votre région.
            </p>
            <button className="btn-dune-primary text-sm font-medium">
              🙏 Commencer maintenant
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
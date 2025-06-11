import React from 'react';
import { Heart, Mail, MapPin, Sparkles, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-20 bg-gradient-to-br from-dark-900 via-cyber-900 to-dark-950 text-white overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyber-500/10 to-electric-500/10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-400 to-transparent"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyber-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-electric-400 rounded-full animate-pulse opacity-80"></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-neon-400 rounded-full animate-bounce-soft opacity-50"></div>
      </div>

      <div className="relative container mx-auto px-6 py-12">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Branding section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-cyber-500 to-electric-500 rounded-xl shadow-glow">
                <MapPin className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Lieux de Culte
                </h3>
                <div className="flex items-center space-x-2">
                  <Sparkles size={12} className="text-neon-400" />
                  <span className="text-sm text-gray-400">Nouvelle génération</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Découvrez les lieux de culte chrétiens près de chez vous avec notre plateforme moderne et intuitive.
            </p>
            
            {/* Stats */}
            <div className="flex space-x-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="text-lg font-bold text-cyber-400">1,500+</div>
                <div className="text-xs text-gray-400">Lieux référencés</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="text-lg font-bold text-electric-400">50+</div>
                <div className="text-xs text-gray-400">Contributeurs</div>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
              <span>🚀</span>
              <span>Navigation</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-cyber-400 transition-colors duration-300 text-sm flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-cyber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>🗺️ Explorer la carte</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-electric-400 transition-colors duration-300 text-sm flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-electric-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>➕ Ajouter un lieu</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-mint-400 transition-colors duration-300 text-sm flex items-center space-x-2 group">
                  <span className="w-1 h-1 bg-mint-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span>📊 Statistiques</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
              <span>💬</span>
              <span>Contact</span>
            </h4>
            <div className="space-y-3">
              <a 
                href="mailto:contact@lieux-culte.fr" 
                className="group flex items-center space-x-3 text-gray-300 hover:text-cyber-400 transition-all duration-300"
              >
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-cyber-500/20 transition-colors">
                  <Mail size={16} />
                </div>
                <span className="text-sm">contact@lieux-culte.fr</span>
              </a>
              
              {/* Social links */}
              <div className="flex space-x-3 pt-2">
                <a 
                  href="#" 
                  className="p-2 bg-white/10 rounded-lg hover:bg-cyber-500/20 transition-all duration-300 hover:scale-110"
                >
                  <Github size={16} className="text-gray-400 hover:text-cyber-400" />
                </a>
                <a 
                  href="#" 
                  className="p-2 bg-white/10 rounded-lg hover:bg-electric-500/20 transition-all duration-300 hover:scale-110"
                >
                  <Twitter size={16} className="text-gray-400 hover:text-electric-400" />
                </a>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-mint-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <span className="text-gray-400">Service en ligne</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Réalisé avec</span>
            <Heart size={16} className="text-hot-500 animate-pulse" />
            <span>en Moselle, 2025</span>
            <span className="text-gray-600">•</span>
            <span className="bg-gradient-to-r from-cyber-400 to-electric-400 bg-clip-text text-transparent font-medium">
              Nouvelle expérience
            </span>
          </div>

          <div className="text-xs text-gray-500 text-center md:text-right">
            <p>Phase 1 du projet de référencement • Version Beta</p>
            <p className="mt-1">
              Powered by 
              <span className="text-cyber-400 font-medium ml-1">React</span> • 
              <span className="text-electric-400 font-medium ml-1">Supabase</span> • 
              <span className="text-mint-400 font-medium ml-1">Modern Web</span>
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-8 p-6 bg-gradient-to-r from-cyber-500/10 to-electric-500/10 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="text-center">
            <h5 className="text-lg font-semibold text-white mb-2">
              🌟 Contribuez à l'aventure !
            </h5>
            <p className="text-gray-300 text-sm mb-4">
              Aidez-nous à enrichir notre base de données en ajoutant les lieux de culte de votre région.
            </p>
            <button className="px-6 py-2 bg-gradient-to-r from-cyber-500 to-electric-500 text-white rounded-xl hover:from-cyber-600 hover:to-electric-600 transition-all duration-300 shadow-glow hover:shadow-glow-lg transform hover:scale-105 text-sm font-medium">
              Commencer maintenant
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
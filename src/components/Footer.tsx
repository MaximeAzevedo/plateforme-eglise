import React from 'react';
import { Crown, Mail, Twitter, Facebook, Instagram, Heart, Star, Sparkles, Flame, Users, Globe, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Effets de lumière divine en arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo et mission divine */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative p-3 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 rounded-2xl shadow-lg">
                <Crown className="h-6 w-6 text-white" />
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-2xl blur opacity-25"></div>
              </div>
              <div>
                <h3 className="text-xl font-heading font-extrabold">
                  <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                    GOD
                  </span>
                  <span className="text-white mx-1">×</span>
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    CONNECT
                  </span>
                </h3>
                <p className="text-gray-300 font-body text-sm flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>Là où les âmes se rencontrent</span>
                </p>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <p className="text-gray-300 text-sm leading-relaxed italic">
                "Connecter chaque âme à sa destinée divine, une communauté à la fois."
              </p>
              <cite className="text-amber-400 text-xs mt-2 block">— Notre Mission</cite>
            </div>
          </div>

          {/* Communauté Spirituelle */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold text-white flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-400" />
              <span>Communauté</span>
            </h4>
            <div className="space-y-3">
              <a href="#" className="group flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-all text-sm font-body">
                <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Mur de Prière</span>
              </a>
              <a href="#" className="group flex items-center space-x-2 text-gray-300 hover:text-amber-400 transition-all text-sm font-body">
                <Star className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                <span>Témoignages</span>
              </a>
              <a href="#" className="group flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-all text-sm font-body">
                <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Groupes de Croissance</span>
              </a>
              <a href="#" className="group flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-all text-sm font-body">
                <Crown className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Mentorat Spirituel</span>
              </a>
            </div>
          </div>

          {/* Ressources Spirituelles */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold text-white flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-400" />
              <span>Ressources</span>
            </h4>
            <div className="space-y-3">
              <a href="#" className="group flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-all text-sm font-body">
                <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Notre Vision</span>
              </a>
              <a href="#" className="group flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-all text-sm font-body">
                <Shield className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Sécurité & Confiance</span>
              </a>
              <a href="#" className="group flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-all text-sm font-body">
                <Globe className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Impact Mondial</span>
              </a>
            </div>
          </div>

          {/* Contact Divin */}
          <div className="space-y-4">
            <h4 className="text-lg font-heading font-semibold text-white flex items-center space-x-2">
              <Mail className="h-5 w-5 text-blue-400" />
              <span>Connexion</span>
            </h4>
            <div className="space-y-3">
              <a 
                href="mailto:connect@godconnect.faith" 
                className="group flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-all text-sm font-body"
              >
                <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>connect@godconnect.faith</span>
              </a>
              
              <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-2">Rejoignez notre communauté</p>
                <div className="flex space-x-2">
                  <a 
                    href="#" 
                    className="group p-2 bg-gradient-to-r from-blue-600/80 to-blue-700/80 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-4 w-4 text-white" />
                  </a>
                  <a 
                    href="#" 
                    className="group p-2 bg-gradient-to-r from-purple-600/80 to-purple-700/80 rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all transform hover:scale-110"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-4 w-4 text-white" />
                  </a>
                  <a 
                    href="#" 
                    className="group p-2 bg-gradient-to-r from-pink-600/80 to-pink-700/80 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all transform hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4 text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur lumineux */}
        <div className="border-t border-gradient-to-r from-transparent via-white/20 to-transparent my-8"></div>

        {/* Pied de page inspirant */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <p className="text-gray-400 text-sm font-body">
              © 2025 GOD × CONNECT. Béni pour bénir.
            </p>
            <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-medium">Communauté active 24/7</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <p className="text-gray-400 font-body flex items-center space-x-2">
              <Flame className="h-4 w-4 text-orange-400" />
              <span>Œcuménique • Toutes confessions</span>
            </p>
            <p className="text-gray-400 font-body flex items-center space-x-2">
              <Crown className="h-4 w-4 text-yellow-400" />
              <span>Soli Deo Gloria</span>
            </p>
          </div>
        </div>

        {/* Citation inspirante finale */}
        <div className="mt-8 text-center">
          <blockquote className="text-gray-300 text-sm italic max-w-2xl mx-auto">
            "Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux."
          </blockquote>
          <cite className="text-amber-400 text-xs mt-1 block">— Matthieu 18:20</cite>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
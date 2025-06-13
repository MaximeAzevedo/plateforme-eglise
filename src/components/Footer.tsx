import React from 'react';
import { Church, Mail, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo et identité */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Church className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-body font-semibold text-white">
                  Mon Église
                </h3>
                <p className="text-gray-300 font-body text-sm">
                  Le lieu de votre rencontre.
                </p>
              </div>
            </div>
          </div>

          {/* À Propos */}
          <div className="space-y-4">
            <h4 className="text-base font-body font-medium text-white">
              À Propos
            </h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm font-body">
                Notre Mission
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm font-body">
                Notre Équipe
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm font-body">
                Notre Histoire
              </a>
            </div>
          </div>

          {/* Informations Légales */}
          <div className="space-y-4">
            <h4 className="text-base font-body font-medium text-white">
              Informations
            </h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm font-body">
                Notre Charte
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm font-body">
                Mentions Légales
              </a>
              <a href="#" className="block text-gray-300 hover:text-white transition-colors text-sm font-body">
                Politique de Confidentialité
              </a>
            </div>
          </div>

          {/* Contact et Réseaux Sociaux */}
          <div className="space-y-4">
            <h4 className="text-base font-body font-medium text-white">
              Contact
            </h4>
            <div className="space-y-3">
              <a 
                href="mailto:contact@mon-eglise.fr" 
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm font-body"
              >
                <Mail size={16} />
                <span>contact@mon-eglise.fr</span>
              </a>
              
              {/* Réseaux sociaux */}
              <div className="pt-2">
                <p className="text-sm font-body text-gray-300 mb-3">Suivez-nous</p>
                <div className="flex space-x-3">
                  <a 
                    href="#" 
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={16} className="text-gray-300 hover:text-white" />
                  </a>
                  <a 
                    href="#" 
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter size={16} className="text-gray-300 hover:text-white" />
                  </a>
                  <a 
                    href="#" 
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={16} className="text-gray-300 hover:text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm font-body">
              © 2025 Mon Église. Tous droits réservés.
            </p>
            <p className="text-gray-400 text-sm font-body">
              Plateforme œcuménique • Toutes confessions chrétiennes
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
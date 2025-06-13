import React from 'react';
import { Shield, ExternalLink } from 'lucide-react';

const OurCommitment: React.FC = () => {
  return (
    <section className="bg-amber-50/30 border border-amber-100/50 rounded-2xl p-8 shadow-sm">
      {/* Titre de la section */}
      <div className="text-center mb-8">
        <h2 className="text-gray-800 font-body text-2xl font-medium mb-6">
          Explorez en toute sérénité
        </h2>
        
        {/* Logo/Badge de confiance */}
        <div className="flex justify-center mb-6">
          <div className="bg-white border-2 border-yellow-200 rounded-2xl px-6 py-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-left">
                <div className="text-gray-800 font-body font-semibold text-sm">
                  Label de Confiance
                </div>
                <div className="text-yellow-600 font-body font-medium text-xs">
                  Mon Église
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paragraphe explicatif */}
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <p className="text-gray-700 font-body text-base leading-relaxed">
          Chaque communauté présente sur Mon Église adhère à notre <strong>Charte de Confiance</strong>. 
          Nous nous engageons à ne référencer que des lieux appartenant aux grandes familles du christianisme historique, 
          garantissant le respect des personnes et une démarche de foi authentique.
        </p>
        
        {/* Appel à l'action discret */}
        <div className="pt-4">
          <a 
            href="#" 
            className="inline-flex items-center space-x-2 text-yellow-700 hover:text-yellow-800 font-body text-sm font-medium transition-colors duration-200 hover:underline"
          >
            <span>Découvrir notre Charte de Confiance</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default OurCommitment; 
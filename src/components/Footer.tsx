import React from 'react';
import { 
  MapPin,
  Mail,
  Phone,
  Globe,
  Heart,
  Shield,
  Users,
  Info
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-culteo-gris-basalte text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo et mission Culteo */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/Logo Culteo.png" 
                alt="Culteo" 
                className="h-10 w-auto"
              />
              <div className="text-xl font-poppins font-bold text-white">
                Culteo
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-culteo p-4">
              <p className="font-lato text-white/90 text-sm leading-relaxed italic">
                "Votre lieu de culte, simplement."
              </p>
              <cite className="text-culteo-jaune-lumiere text-xs mt-2 block">— Notre Mission</cite>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-poppins font-semibold text-lg text-white">Navigation</h4>
            <ul className="space-y-3">
              {[
                { name: 'Accueil', href: '#' },
                { name: 'Carte interactive', href: '#map' },
                { name: 'Communautés', href: '#community' },
                { name: 'Témoignages', href: '#testimonies' },
                { name: 'Contribuer', href: '#contribute' }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="font-lato text-white/70 hover:text-culteo-jaune-lumiere transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-poppins font-semibold text-lg text-white">Contact</h4>
            <div className="space-y-3">
              <a 
                href="mailto:contact@culteo.app"
                className="font-lato text-white/70 hover:text-culteo-jaune-lumiere transition-colors duration-200 flex items-center space-x-3"
              >
                <Mail className="h-4 w-4" />
                <span>contact@culteo.app</span>
              </a>
              <div className="font-lato text-white/70 flex items-center space-x-3">
                <MapPin className="h-4 w-4" />
                <span>France</span>
              </div>
            </div>
          </div>

          {/* À propos */}
          <div className="space-y-4">
            <h4 className="font-poppins font-semibold text-lg text-white">À propos</h4>
            <p className="font-lato text-white/70 text-sm leading-relaxed">
              Culteo facilite la découverte des communautés chrétiennes. 
              Simple, efficace, bienveillant.
            </p>
            <div className="flex space-x-4">
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200">
                <Heart className="h-5 w-5 text-culteo-jaune-lumiere" />
              </button>
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200">
                <Shield className="h-5 w-5 text-culteo-jaune-lumiere" />
              </button>
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200">
                <Info className="h-5 w-5 text-culteo-jaune-lumiere" />
              </button>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="font-lato text-white/50 text-sm">
              © 2025 Culteo. Une plateforme au service de la foi.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="font-lato text-white/50 hover:text-white text-sm transition-colors duration-200">
                Confidentialité
              </a>
              <a href="#" className="font-lato text-white/50 hover:text-white text-sm transition-colors duration-200">
                Conditions d'utilisation
              </a>
              <a href="#" className="font-lato text-white/50 hover:text-white text-sm transition-colors duration-200">
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
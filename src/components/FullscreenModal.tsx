import React, { useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  headerIcon?: React.ReactNode;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({
  isOpen,
  onClose,
  onBack,
  title,
  subtitle,
  children,
  showBackButton = false,
  headerIcon
}) => {
  // Bloquer le scroll du body quand le modal est ouvert
  useEffect(() => {
    console.log('🔍 FullscreenModal - isOpen:', isOpen, 'title:', title);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      console.log('✅ Modal ouvert, scroll bloqué');
    } else {
      document.body.style.overflow = 'unset';
      console.log('✅ Modal fermé, scroll restauré');
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, title]);

  if (!isOpen) {
    console.log('❌ Modal not open, returning null');
    return null;
  }

  console.log('🚀 Rendering FullscreenModal with title:', title);

  return (
    <div className="fixed inset-0 z-[9999]" style={{ zIndex: 9999 }}>
      {/* Debug visible */}
      <div className="fixed top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs rounded z-[10000] pointer-events-none">
        Modal: {title}
      </div>
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      />
      
      {/* Modal Content */}
      <div 
        className={`
          absolute inset-0 bg-culteo-blanc-pur
          transform transition-transform duration-300 ease-out
          translate-y-0
          md:inset-4 md:rounded-culteo-xl md:shadow-culteo-float
          overflow-hidden
        `}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: window.innerWidth >= 768 ? '24px' : '0',
          transform: 'translateY(0)',
          zIndex: 10000
        }}
      >
        {/* Header fixe */}
        <div 
          className="sticky top-0 z-10 bg-culteo-blanc-pur border-b border-culteo-vert-esperance/10 px-4 py-4 md:px-6 md:py-6"
          style={{
            backgroundColor: '#FFFFFF',
            borderBottomColor: 'rgba(10, 104, 71, 0.1)'
          }}
        >
          <div className="flex items-center justify-between">
            {/* Bouton retour ou fermer */}
            <button
              onClick={() => {
                console.log('🔄 Modal close/back button clicked');
                showBackButton && onBack ? onBack() : onClose();
              }}
              className="p-2 hover:bg-culteo-blanc-coquille rounded-culteo transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: 'transparent' }}
            >
              {showBackButton && onBack ? (
                <ArrowLeft className="h-6 w-6 text-culteo-gris-basalte" style={{ color: '#3D3D3D' }} />
              ) : (
                <X className="h-6 w-6 text-culteo-gris-basalte" style={{ color: '#3D3D3D' }} />
              )}
            </button>

            {/* Titre et icône */}
            <div className="flex items-center space-x-3">
              {headerIcon && (
                <div className="flex-shrink-0">
                  {headerIcon}
                </div>
              )}
              <div className="text-center">
                <h2 
                  className="font-poppins font-bold text-culteo-gris-basalte text-lg md:text-xl"
                  style={{ color: '#3D3D3D', fontFamily: 'Poppins, sans-serif' }}
                >
                  {title}
                </h2>
                {subtitle && (
                  <p 
                    className="font-lato text-culteo-gris-basalte/70 text-sm"
                    style={{ color: 'rgba(61, 61, 61, 0.7)', fontFamily: 'Lato, sans-serif' }}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Espace pour équilibrer */}
            <div className="w-10"></div>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-culteo">
          <div className="p-4 md:p-6 pb-safe">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenModal;
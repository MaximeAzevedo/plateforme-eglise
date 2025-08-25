import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, X, Info, Shield, Zap } from 'lucide-react';

interface GeolocationButtonProps {
  onLocationFound: (position: [number, number]) => void;
  onError?: (error: string) => void;
}

interface ConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onAccept, onDecline }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Compensation pour la scrollbar
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDecline();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onDecline]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={onDecline}
    >
      <div 
        className="modal-content"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderRadius: '24px',
          maxWidth: '420px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture */}
        <button
          onClick={onDecline}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: 'rgba(243, 244, 246, 1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1000000
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(229, 231, 235, 1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(243, 244, 246, 1)';
          }}
        >
          <X size={16} color="#6B7280" />
        </button>
        
        <div style={{ padding: '24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #6366F1, #0EA5E9)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
            }}>
              <Shield size={24} color="white" />
            </div>
            <div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: '#1F2937', 
                margin: 0,
                marginBottom: '4px'
              }}>
                🌍 Géolocalisation
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#6B7280', 
                fontWeight: '500',
                margin: 0
              }}>
                Trouvez les lieux près de vous
              </p>
            </div>
          </div>
          
          {/* Contenu simplifié */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              background: 'linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(14, 165, 233, 0.1))',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <p style={{ 
                fontSize: '14px', 
                color: '#4338CA', 
                fontWeight: '600',
                margin: '0 0 8px 0'
              }}>
                🎯 Nous aimerions accéder à votre position pour :
              </p>
              <p style={{ 
                fontSize: '14px', 
                color: '#4338CA', 
                margin: 0,
                lineHeight: '1.5'
              }}>
                Centrer automatiquement la carte sur votre localisation et vous aider à trouver les lieux de culte les plus proches.
              </p>
            </div>
            
            <div style={{
              background: 'linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(14, 165, 233, 0.1))',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '16px',
              padding: '16px'
            }}>
              <p style={{ 
                fontSize: '13px', 
                color: '#059669', 
                fontWeight: '600',
                margin: '0 0 8px 0'
              }}>
                🔒 Votre vie privée est protégée :
              </p>
              <ul style={{ 
                fontSize: '13px', 
                color: '#059669', 
                margin: 0,
                paddingLeft: '16px',
                lineHeight: '1.4'
              }}>
                <li>Position jamais stockée sur nos serveurs</li>
                <li>Utilisée uniquement pour centrer la carte</li>
                <li>Aucun suivi de vos déplacements</li>
              </ul>
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onDecline}
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: 'white',
                border: '2px solid #E5E7EB',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D1D5DB';
                e.currentTarget.style.backgroundColor = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              🚫 Refuser
            </button>
            <button
              onClick={onAccept}
              style={{
                flex: 1,
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #6366F1, #0EA5E9)',
                border: 'none',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(99, 102, 241, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.4)';
              }}
            >
              🎯 Autoriser
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Utilisation d'un portail pour s'assurer que le modal s'affiche au-dessus de tout
  return createPortal(modalContent, document.body);
};

const GeolocationButton: React.FC<GeolocationButtonProps> = ({ onLocationFound, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [hasAskedPermission, setHasAskedPermission] = useState(false);

  const handleLocationRequest = () => {
    if (!hasAskedPermission) {
      setShowConsentModal(true);
      return;
    }
    
    requestLocation();
  };

  const handleConsentAccept = () => {
    setShowConsentModal(false);
    setHasAskedPermission(true);
    requestLocation();
  };

  const handleConsentDecline = () => {
    setShowConsentModal(false);
    setHasAskedPermission(true);
    if (onError) {
      onError("Géolocalisation refusée par l'utilisateur 🚫");
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      if (onError) {
        onError("❌ La géolocalisation n'est pas supportée par votre navigateur");
      }
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationFound([latitude, longitude]);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        let errorMessage = "❌ Erreur de géolocalisation";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "🚫 Accès à la position refusé";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "📍 Position indisponible";
            break;
          case error.TIMEOUT:
            errorMessage = "⏱️ Délai d'attente dépassé";
            break;
        }
        
        if (onError) {
          onError(errorMessage);
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  return (
    <>
      <button
        onClick={handleLocationRequest}
        disabled={isLoading}
        className={`group inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200 text-xs font-medium ${
          isLoading 
            ? 'bg-culteo-vert-esperance/10 text-culteo-vert-esperance cursor-not-allowed'
            : 'bg-transparent text-gray-600 hover:bg-culteo-vert-esperance/10 hover:text-culteo-vert-esperance'
        }`}
        title="Me localiser"
      >
        {isLoading ? (
          <div className="w-3 h-3 text-culteo-vert-esperance animate-spin">
            <div className="w-full h-full border border-culteo-vert-esperance border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <MapPin className="h-3 w-3 transition-transform duration-200" />
        )}
        <span>
          {isLoading ? 'Localisation...' : 'Près de moi'}
        </span>
      </button>

      <ConsentModal
        isOpen={showConsentModal}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
      />
    </>
  );
};

export default GeolocationButton; 
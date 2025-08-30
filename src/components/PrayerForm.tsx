import React, { useState, useEffect } from 'react';
import { X, Heart, ArrowLeft, Shield, ChevronRight, Check, AlertCircle } from 'lucide-react';

interface PrayerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  supabase: any;
}

type PrayerType = 'health' | 'family' | 'work' | 'guidance' | 'protection' | 'gratitude' | 'other';

const PrayerForm: React.FC<PrayerFormProps> = ({ isOpen, onClose, onBack, supabase }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    type: 'guidance' as PrayerType,
    description: '',
    firstName: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Désactiver le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const prayerTypes = [
    { 
      value: 'health', 
      label: 'Santé & Guérison', 
      icon: '🙏', 
      color: 'from-green-400 to-emerald-500',
      description: 'Maladies, opérations, rétablissement'
    },
    { 
      value: 'family', 
      label: 'Famille & Relations', 
      icon: '👨‍👩‍👧‍👦', 
      color: 'from-blue-400 to-indigo-500',
      description: 'Conflits, réconciliation, protection familiale'
    },
    { 
      value: 'work', 
      label: 'Travail & Finances', 
      icon: '💼', 
      color: 'from-amber-400 to-orange-500',
      description: 'Emploi, revenus, stabilité financière'
    },
    { 
      value: 'guidance', 
      label: 'Direction & Discernement', 
      icon: '🧭', 
      color: 'from-purple-400 to-pink-500',
      description: 'Choix importants, volonté de Dieu'
    },
    { 
      value: 'protection', 
      label: 'Protection & Sécurité', 
      icon: '🛡️', 
      color: 'from-red-400 to-pink-500',
      description: 'Voyages, situations dangereuses'
    },
    { 
      value: 'gratitude', 
      label: 'Action de Grâces', 
      icon: '🙌', 
      color: 'from-yellow-400 to-orange-400',
      description: 'Remerciements, témoignages de reconnaissance'
    },
    { 
      value: 'other', 
      label: 'Autre', 
      icon: '💫', 
      color: 'from-gray-400 to-gray-500',
      description: 'Autres besoins spirituels'
    }
  ];

  const handleSubmit = async () => {
    setErrors([]);

    // Validation finale
    const newErrors: string[] = [];
    if (!formData.title.trim()) newErrors.push('Le titre est obligatoire');
    if (!formData.description.trim()) newErrors.push('La description est obligatoire');
    if (!formData.firstName.trim()) newErrors.push('Le prénom est obligatoire');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const prayerData = {
        user_name: formData.firstName,
        user_email: 'user@example.com',
        title: formData.title,
        content: formData.description,
        category: formData.type === 'health' ? 'health' : 
                 formData.type === 'family' ? 'family' :
                 formData.type === 'work' ? 'financial' :
                 formData.type === 'guidance' ? 'guidance' :
                 formData.type === 'protection' ? 'protection' :
                 formData.type === 'gratitude' ? 'thanksgiving' : 'other',
        prayer_language: 'fr',
        location: '',
        is_anonymous: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_approved: false,
        moderation_notes: '',
        reports_count: 0
      };

      console.log('Envoi de la demande de prière:', prayerData);

      const { data, error } = await supabase
        .from('prayer_requests')
        .insert([prayerData]);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur lors de la sauvegarde: ${error.message}`);
      }

      console.log('Demande de prière sauvegardée avec succès:', data);
      setShowSuccess(true);
      
      // Réinitialiser après 3 secondes
      setTimeout(() => {
        setFormData({
          title: '',
          type: 'guidance',
          description: '',
          firstName: ''
        });
        setCurrentStep(1);
        setShowSuccess(false);
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setErrors([error instanceof Error ? error.message : 'Une erreur est survenue']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setErrors([]);
    
    // Validation par étape
    if (currentStep === 1 && !formData.type) {
      setErrors(['Veuillez sélectionner un type de prière']);
      return;
    }
    if (currentStep === 2 && !formData.title.trim()) {
      setErrors(['Le titre est obligatoire']);
      return;
    }
    if (currentStep === 3 && !formData.description.trim()) {
      setErrors(['La description est obligatoire']);
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  // Écran de succès
  if (showSuccess) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-auto p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Prière envoyée ! 🙏</h3>
        <p className="text-gray-600 leading-relaxed mb-6">
          Votre demande de prière a été transmise avec succès. Notre communauté intercèdera pour vous.
        </p>
        <div className="text-sm text-gray-500">
          Cette fenêtre se fermera automatiquement...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-culteo-gris-basalte">Étape {currentStep} sur 4</h3>
          <div className="text-sm text-culteo-gris-basalte/70">
            {currentStep === 1 && "Type de prière"}
            {currentStep === 2 && "Titre de votre prière"}
            {currentStep === 3 && "Description détaillée"}
            {currentStep === 4 && "Informations personnelles"}
          </div>
        </div>
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full transition-colors duration-300 ${
                step <= currentStep
                  ? 'bg-gradient-to-r from-culteo-vert-esperance to-culteo-jaune-lumiere'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Affichage des erreurs */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <div className="text-sm text-red-700">
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contenu du formulaire - plus de modal wrapper car déjà dans FullscreenModal */}
      <div>
          
          {/* Étape 1: Type de prière */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-slide-in">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Pour quoi souhaitez-vous prier ?
                </h3>
                <p className="text-gray-600">
                  Choisissez le domaine qui correspond à votre besoin
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prayerTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({...formData, type: type.value as PrayerType})}
                    className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 active:scale-95 ${
                      formData.type === type.value
                        ? 'border-purple-300 bg-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25'
                    }`}
                    style={{ minHeight: '80px' }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${type.color} flex items-center justify-center shadow-lg text-xl`}>
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {type.label}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Étape 2: Titre */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-slide-in">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Quel est le titre de votre prière ?
                </h3>
                <p className="text-gray-600">
                  Un titre court et descriptif pour votre demande
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Ex: Guérison pour ma mère, Nouveau travail..."
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-800 font-medium placeholder:text-gray-500 transition-all duration-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 focus:bg-white text-base"
                  style={{ fontSize: '16px' }}
                  maxLength={100}
                />
                <div className="text-right text-sm text-gray-500">
                  {formData.title.length}/100 caractères
                </div>
              </div>

              {/* Suggestions de titres */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <h5 className="col-span-full text-sm font-medium text-gray-700 mb-2">
                  Suggestions :
                </h5>
                {[
                  'Rétablissement complet',
                  'Réconciliation familiale',
                  'Nouveau travail',
                  'Paix intérieure',
                  'Protection voyage',
                  'Action de grâces'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setFormData({...formData, title: suggestion})}
                    className="text-left px-4 py-3 rounded-xl bg-gray-100 hover:bg-purple-50 hover:border-purple-200 border-2 border-transparent transition-colors text-sm font-medium text-gray-700 hover:text-purple-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Étape 3: Description */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-slide-in">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Partagez votre demande
                </h3>
                <p className="text-gray-600">
                  Décrivez votre situation pour que nous puissions prier spécifiquement
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  placeholder="Partagez ici votre demande de prière. Plus vous serez précis, mieux nous pourrons intercéder pour vous..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-800 font-medium placeholder:text-gray-500 transition-all duration-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 focus:bg-white text-base resize-none"
                  style={{ fontSize: '16px', minHeight: '120px' }}
                  rows={6}
                  maxLength={1000}
                />
                <div className="text-right text-sm text-gray-500">
                  {formData.description.length}/1000 caractères
                </div>
              </div>

              {/* Conseils de rédaction */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <h5 className="font-semibold text-blue-900 mb-2">💡 Conseils :</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Soyez honnête et sincère</li>
                  <li>• Partagez le contexte si nécessaire</li>
                  <li>• Précisez vos besoins spécifiques</li>
                  <li>• Votre demande restera confidentielle</li>
                </ul>
              </div>
            </div>
          )}

          {/* Étape 4: Informations personnelles */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-slide-in">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Comment vous appeler ?
                </h3>
                <p className="text-gray-600">
                  Votre prénom nous aide à personnaliser nos prières
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Votre prénom"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-800 font-medium placeholder:text-gray-500 transition-all duration-300 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 focus:bg-white text-base"
                  style={{ fontSize: '16px' }}
                  maxLength={50}
                />
              </div>

              {/* Récapitulatif */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <h5 className="font-semibold text-gray-900 mb-4">📋 Récapitulatif :</h5>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📂</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Catégorie :</span>
                      <div className="font-medium text-gray-900">
                        {prayerTypes.find(t => t.value === formData.type)?.label}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📝</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Titre :</span>
                      <div className="font-medium text-gray-900">{formData.title}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm">💬</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Description :</span>
                      <div className="font-medium text-gray-900 text-sm leading-relaxed">
                        {formData.description.substring(0, 100)}
                        {formData.description.length > 100 && '...'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice de confidentialité */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <strong>Confidentialité :</strong> Votre demande sera modérée avant publication et seule la communauté approuvée pourra la voir.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer avec boutons d'action - Style Culteo */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex gap-4">
            {/* Bouton Précédent */}
            {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-culteo-blanc-coquille border-2 border-culteo-vert-esperance/30 text-culteo-vert-esperance rounded-culteo font-poppins font-medium hover:border-culteo-vert-esperance hover:bg-culteo-blanc-pur transition-all duration-300"
            >
              Précédent
            </button>
          )}
          
          {/* Bouton principal */}
          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              className="flex-1 bg-gradient-to-r from-culteo-vert-esperance to-culteo-jaune-lumiere text-white px-6 py-3 rounded-culteo font-poppins font-semibold shadow-culteo-medium hover:shadow-culteo-strong transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span>Continuer</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-culteo-vert-esperance to-culteo-jaune-lumiere text-white px-6 py-3 rounded-culteo font-poppins font-semibold shadow-culteo-medium hover:shadow-culteo-strong transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5" />
                  <span>Envoyer ma prière</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrayerForm; 
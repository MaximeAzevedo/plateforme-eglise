import React, { useState } from 'react';
import { X, Heart, ArrowLeft, Clock, Users, Shield, Eye, EyeOff, Tag, Calendar } from 'lucide-react';

interface PrayerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  supabase: any;
}

type PrayerType = 'health' | 'family' | 'work' | 'guidance' | 'protection' | 'gratitude' | 'other';
type PrayerUrgency = 'normal' | 'urgent' | 'ongoing';
type PrayerDuration = '7days' | '30days' | '90days' | 'ongoing';

const PrayerForm: React.FC<PrayerFormProps> = ({ isOpen, onClose, onBack, supabase }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'guidance' as PrayerType,
    description: '',
    urgency: 'normal' as PrayerUrgency,
    duration: '30days' as PrayerDuration,
    isAnonymous: false,
    tags: [] as string[],
    firstName: '',
    location: ''
  });

  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const urgencyOptions = [
    { value: 'normal', label: 'Normal', color: 'text-gray-600', bg: 'bg-gray-100' },
    { value: 'urgent', label: 'Urgent', color: 'text-orange-600', bg: 'bg-orange-100' },
    { value: 'ongoing', label: 'Continu', color: 'text-blue-600', bg: 'bg-blue-100' }
  ];

  const durationOptions = [
    { value: '7days', label: '7 jours' },
    { value: '30days', label: '30 jours' },
    { value: '90days', label: '3 mois' },
    { value: 'ongoing', label: 'Besoin continu' }
  ];

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validation
    const newErrors: string[] = [];
    if (!formData.title.trim()) newErrors.push('Le titre est obligatoire');
    if (!formData.description.trim()) newErrors.push('La description est obligatoire');
    if (!formData.isAnonymous && !formData.firstName.trim()) {
      newErrors.push('Le prénom est obligatoire si vous ne publiez pas anonymement');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculer la date d'expiration
      const expiresAt = formData.duration === 'ongoing' ? null : 
        new Date(Date.now() + (
          formData.duration === '7days' ? 7 * 24 * 60 * 60 * 1000 :
          formData.duration === '30days' ? 30 * 24 * 60 * 60 * 1000 :
          90 * 24 * 60 * 60 * 1000
        )).toISOString();

      const prayerData = {
        title: formData.title,
        type: formData.type,
        description: formData.description,
        urgency: formData.urgency,
        duration: formData.duration,
        is_anonymous: formData.isAnonymous,
        tags: formData.tags,
        first_name: formData.isAnonymous ? null : formData.firstName,
        location: formData.location || null,
        expires_at: expiresAt
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
      alert('Merci ! Votre demande de prière a été partagée avec la communauté.');
      
      // Reset du formulaire
      setFormData({
        title: '',
        type: 'guidance',
        description: '',
        urgency: 'normal',
        duration: '7days',
        isAnonymous: false,
        tags: [],
        firstName: '',
        location: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setErrors([error instanceof Error ? error.message : 'Une erreur est survenue']);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="relative flex items-center">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
            >
              <ArrowLeft className="h-4 w-4 text-gray-500" />
            </button>
            
            <div className="flex-1 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Demande de Prière
              </h2>
              <p className="text-gray-600">
                Partagez vos besoins avec notre communauté qui priera pour vous
              </p>
            </div>

            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          {/* Erreurs */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="font-medium text-red-800 mb-2">Veuillez corriger :</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de votre demande *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Ex: Prière pour la guérison de ma mère..."
                value={formData.title}
                onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
              />
            </div>

            {/* Type de prière */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de demande *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prayerTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, type: type.value as PrayerType }))}
                    className={`p-4 border-2 rounded-xl transition-all duration-300 text-left ${
                      formData.type === type.value
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <span className="text-lg">{type.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 mb-1">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Décrivez votre besoin de prière *
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                placeholder="Partagez les détails de votre demande pour que la communauté puisse prier de manière ciblée..."
                value={formData.description}
                onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            {/* Urgence et Durée */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Niveau d'urgence
                </label>
                <div className="space-y-2">
                  {urgencyOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(f => ({ ...f, urgency: option.value as PrayerUrgency }))}
                      className={`w-full p-3 border-2 rounded-xl transition-all duration-300 text-left flex items-center gap-3 ${
                        formData.urgency === option.value
                          ? 'border-red-400 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${option.bg}`}></div>
                      <span className={`font-medium ${option.color}`}>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée de prière souhaitée
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  value={formData.duration}
                  onChange={e => setFormData(f => ({ ...f, duration: e.target.value as PrayerDuration }))}
                >
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Anonymat */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormData(f => ({ ...f, isAnonymous: !f.isAnonymous }))}
                  className={`p-2 rounded-lg transition-colors ${
                    formData.isAnonymous 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {formData.isAnonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <div>
                  <div className="font-medium text-gray-900">
                    Demande anonyme
                  </div>
                  <div className="text-sm text-gray-600">
                    Votre demande sera publiée sans révéler votre identité
                  </div>
                </div>
              </div>

              {/* Prénom si pas anonyme */}
              {!formData.isAnonymous && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre prénom *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="Ex: Marie, Jean..."
                    value={formData.firstName}
                    onChange={e => setFormData(f => ({ ...f, firstName: e.target.value }))}
                  />
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mots-clés (optionnel)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Ajouter un mot-clé..."
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!currentTag.trim() || formData.tags.length >= 5}
                  className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Tag className="h-4 w-4" />
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Localisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localisation (optionnel)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Ex: Paris, France"
                value={formData.location}
                onChange={e => setFormData(f => ({ ...f, location: e.target.value }))}
              />
            </div>

            {/* Note de confidentialité */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900 mb-1">Confidentialité respectée</h4>
                  <p className="text-sm text-amber-800">
                    Votre demande sera traitée avec respect et confidentialité. 
                    Seuls les éléments que vous choisissez de partager seront visibles par la communauté.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Envoi en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>Partager ma demande</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrayerForm; 
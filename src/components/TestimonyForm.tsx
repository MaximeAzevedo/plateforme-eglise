import React, { useState } from 'react';
import { X, Star, ArrowLeft, Heart, Calendar, MapPin, Tag, Shield, Eye, EyeOff } from 'lucide-react';

interface TestimonyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  supabase: any;
}

type TestimonyType = 'healing' | 'transformation' | 'provision' | 'guidance' | 'protection' | 'other';

const TestimonyForm: React.FC<TestimonyFormProps> = ({ isOpen, onClose, onBack, supabase }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'transformation' as TestimonyType,
    description: '',
    beforeSituation: '',
    afterSituation: '',
    timeframe: '',
    isAnonymous: false,
    tags: [] as string[],
    denomination: '',
    location: ''
  });

  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const testimonyTypes = [
    { value: 'healing', label: 'Guérison', icon: '🙏', color: 'from-green-400 to-emerald-500' },
    { value: 'transformation', label: 'Transformation de vie', icon: '✨', color: 'from-purple-400 to-pink-500' },
    { value: 'provision', label: 'Provision divine', icon: '🎁', color: 'from-blue-400 to-indigo-500' },
    { value: 'guidance', label: 'Direction spirituelle', icon: '🧭', color: 'from-amber-400 to-orange-500' },
    { value: 'protection', label: 'Protection', icon: '🛡️', color: 'from-red-400 to-pink-500' },
    { value: 'other', label: 'Autre', icon: '💫', color: 'from-gray-400 to-gray-500' }
  ];

  const timeframeOptions = [
    'Immédiat',
    'Quelques jours',
    '1 semaine',
    '2-3 semaines',
    '1 mois',
    '2-3 mois',
    '6 mois',
    '1 an',
    'Plus d\'un an'
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
    if (!formData.beforeSituation.trim()) newErrors.push('La situation avant est obligatoire');
    if (!formData.afterSituation.trim()) newErrors.push('La situation après est obligatoire');
    if (!formData.timeframe) newErrors.push('La durée est obligatoire');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const testimonyData = {
        id: crypto.randomUUID(),
        title: formData.title,
        type: formData.type,
        description: formData.description,
        beforeSituation: formData.beforeSituation,
        afterSituation: formData.afterSituation,
        timeframe: formData.timeframe,
        isAnonymous: formData.isAnonymous,
        tags: formData.tags,
        denomination: formData.denomination || null,
        location: formData.location || null,
        likes: 0,
        shares: 0,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Note: Cette table sera créée plus tard dans Supabase
      console.log('Témoignage à sauvegarder:', testimonyData);
      
      // Pour l'instant, on simule la sauvegarde
      alert('Merci ! Votre témoignage a été partagé avec succès et sera visible après modération.');
      
      // Reset du formulaire
      setFormData({
        title: '',
        type: 'transformation',
        description: '',
        beforeSituation: '',
        afterSituation: '',
        timeframe: '',
        isAnonymous: false,
        tags: [],
        denomination: '',
        location: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du témoignage:', error);
      setErrors(['Erreur lors de l\'envoi. Veuillez réessayer.']);
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
                <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-lg">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Partager votre témoignage
              </h2>
              <p className="text-gray-600">
                Inspirez la communauté en racontant l'œuvre de Dieu dans votre vie
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
                Titre de votre témoignage *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Ex: Comment Dieu a transformé ma dépression en joie..."
                value={formData.title}
                onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
              />
            </div>

            {/* Type de témoignage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de témoignage *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {testimonyTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(f => ({ ...f, type: type.value as TestimonyType }))}
                    className={`p-3 border-2 rounded-xl transition-all duration-300 text-left ${
                      formData.type === type.value
                        ? 'border-purple-400 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center mb-2`}>
                      <span className="text-sm">{type.icon}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description principale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Racontez votre histoire *
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                placeholder="Partagez les détails de votre expérience avec Dieu..."
                value={formData.description}
                onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            {/* Avant/Après */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Situation avant *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                  placeholder="Comment était votre situation avant..."
                  value={formData.beforeSituation}
                  onChange={e => setFormData(f => ({ ...f, beforeSituation: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Situation après *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                  placeholder="Comment votre vie a changé..."
                  value={formData.afterSituation}
                  onChange={e => setFormData(f => ({ ...f, afterSituation: e.target.value }))}
                />
              </div>
            </div>

            {/* Durée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée de la transformation *
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                value={formData.timeframe}
                onChange={e => setFormData(f => ({ ...f, timeframe: e.target.value }))}
              >
                <option value="">Sélectionnez une durée</option>
                {timeframeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mots-clés (optionnel)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Ajouter un mot-clé..."
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!currentTag.trim() || formData.tags.length >= 5}
                  className="px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Tag className="h-4 w-4" />
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-purple-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Informations optionnelles */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dénomination (optionnel)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Ex: Catholique, Protestant..."
                  value={formData.denomination}
                  onChange={e => setFormData(f => ({ ...f, denomination: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation (optionnel)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Ex: Paris, France"
                  value={formData.location}
                  onChange={e => setFormData(f => ({ ...f, location: e.target.value }))}
                />
              </div>
            </div>

            {/* Anonymat */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData(f => ({ ...f, isAnonymous: !f.isAnonymous }))}
                className={`p-2 rounded-lg transition-colors ${
                  formData.isAnonymous 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {formData.isAnonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <div>
                <div className="font-medium text-gray-900">
                  Publier anonymement
                </div>
                <div className="text-sm text-gray-600">
                  Votre témoignage sera publié sans révéler votre identité
                </div>
              </div>
            </div>

            {/* Note de modération */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900 mb-1">Modération bienveillante</h4>
                  <p className="text-sm text-amber-800">
                    Votre témoignage sera relu par notre équipe pour s'assurer qu'il respecte notre charte de bienveillance 
                    avant d'être publié. Cela peut prendre 24-48h.
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
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Envoi en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>Partager mon témoignage</span>
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

export default TestimonyForm; 
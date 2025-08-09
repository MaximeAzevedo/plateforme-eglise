import React, { useState, useEffect } from 'react';
import { Church, X, Calendar, Globe, Accessibility, ArrowLeft } from 'lucide-react';

// Types cohérents avec votre BDD
type Denomination = 'Catholic' | 'Protestant' | 'Orthodox' | 'Evangelical' | 'Neo-Apostolic' | 'Pentecostal' | 'Baptist' | 'Other';



interface FormData {
  name: string;
  denomination: Denomination;
  address: string;
  city: string;
  celebrationType: string;
  day: string;
  startTime: string;
  endTime: string;
  accessibility: 'yes' | 'partial' | 'no';
  website: string;
  instagram: string;
  youtube: string;
}

const denominations: Denomination[] = ['Catholic', 'Protestant', 'Orthodox', 'Evangelical', 'Neo-Apostolic', 'Pentecostal', 'Baptist', 'Other'];

const denominationLabels: Record<Denomination, string> = {
  Catholic: 'Catholique',
  Protestant: 'Protestant',
  Orthodox: 'Orthodoxe',
  Evangelical: 'Évangélique',
  'Neo-Apostolic': 'Néo apostolique',
  Pentecostal: 'Pentecôtiste',
  Baptist: 'Baptiste',
  Other: 'Autre',
};

const days = [
  'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
];

const denominationOptions: Record<string, string> = {
  Catholic: 'Confession : Catholique',
  Protestant: 'Confession : Protestante',
  Orthodox: 'Confession : Orthodoxe',
  Evangelical: 'Confession : Évangélique',
  Pentecostal: 'Confession : Pentecôtiste',
  Baptist: 'Confession : Baptiste',
  'Neo-Apostolic': 'Confession : Néo-apostolique',
  Other: 'Confession : Autre'
};

const celebrationTypes = [
  'Messe',
  'Culte',
  'Prière',
  'Confession',
  'Adoration',
  'Catéchisme',
  'Groupe de prière',
  'Bible study',
  'Évangélisation',
  'Service communautaire',
  'Autre'
];



export default function ContributeForm({ isOpen, onClose, onBack, supabase }: { 
  isOpen: boolean, 
  onClose: () => void,
  onBack?: () => void,
  supabase: any
}) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    denomination: 'Catholic',
    address: '',
    city: '',
    celebrationType: 'Messe',
    day: 'Dimanche', 
    startTime: '10:30',
    endTime: '11:30',
    accessibility: 'yes',
    website: '',
    instagram: '',
    youtube: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Génération d'un ID unique
  const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!supabase) {
      setErrors(['Erreur de configuration: client Supabase non disponible']);
      return;
    }

    // Validation simplifiée - champs obligatoires
    const newErrors: string[] = [];
    if (!formData.name.trim()) newErrors.push('Le nom du lieu de culte est obligatoire');
    if (!formData.address.trim()) newErrors.push('L\'adresse complète est obligatoire');
    if (!formData.city.trim()) newErrors.push('La ville est obligatoire');
    if (!formData.celebrationType.trim()) newErrors.push('Le type de célébration est obligatoire');
    if (!formData.accessibility) newErrors.push('Le niveau d\'accessibilité est obligatoire');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Formatage de l'horaire unique pour la BDD
      const formattedSchedule = JSON.stringify([{
        type: formData.celebrationType,
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime
      }]);

      // Extraction du code postal de l'adresse (ou générique)
      const postalCodeMatch = formData.address.match(/\b\d{5}\b/);
      const codePostal = postalCodeMatch ? postalCodeMatch[0] : '00000';

      // Préparation des données pour l'insertion MVP
      const insertData = {
        id: generateId(),
        Nom: formData.name,
        Dénomination: denominationLabels[formData.denomination],
        Rue: formData.address,
        Ville: formData.city,
        'Code Postal': codePostal,
        'Horaires d\'ouverture (général)': 'Voir horaires des événements',
        'Site Web': formData.website || null,
        'Heures des cultes et prières': formattedSchedule,
        Latitude: null, // Sera géolocalisé côté admin
        Longitude: null, // Sera géolocalisé côté admin
        Accessible: formData.accessibility === 'yes',
        Instagram: formData.instagram || null,
        YouTube: formData.youtube || null,
        status: 'pending' // IMPORTANT: En attente de modération
      };

      console.log('Données à insérer:', insertData);

      const { data, error } = await supabase.from('BDD').insert([insertData]);
      
      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message || 'Erreur inconnue'}`);
      }

      console.log('Insertion réussie:', data);
      alert('🏛️ Merci ! Votre lieu de culte a été proposé avec succès.\n\n🔍 Il sera examiné par notre équipe et géolocalisé avant publication.\n\n📧 Vous serez notifié une fois qu\'il sera approuvé et visible sur la carte.');
      
      // Reset du formulaire MVP
      setFormData({
        name: '',
        denomination: 'Catholic',
        address: '',
        city: '',
        celebrationType: 'Messe',
        day: 'Dimanche', 
        startTime: '10:30',
        endTime: '11:30',
        accessibility: 'yes',
        website: '',
        instagram: '',
        youtube: ''
      });
      
      onClose();
    } catch (err: any) {
      console.error('Erreur complète:', err);
      const errorMessage = err.message || err.toString() || 'Erreur inconnue';
      setErrors([`Erreur lors de l'envoi: ${errorMessage}`]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center relative">
            {onBack && (
              <button 
                onClick={onBack}
                className="absolute left-0 top-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-gray-500" />
              </button>
            )}
            <button 
              onClick={onClose} 
              type="button" 
              className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
            <div className="flex justify-center mb-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Church className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-body font-semibold text-gray-800 mb-2">
              Référencer une Église
            </h2>
            <p className="text-sm text-gray-600 font-body">
              Aidez la communauté en partageant les informations d'un lieu de culte
            </p>
          </div>

          {/* Erreurs */}
          {errors.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-lg">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 font-body">
                    Veuillez corriger les erreurs suivantes :
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {errors.map((error, i) => <li key={i} className="font-body">{error}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ===== SECTION OBLIGATOIRE (ROUGE) ===== */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 space-y-4">
              <h3 className="text-lg font-body font-semibold text-red-800 flex items-center gap-2">
                🔴 CHAMPS OBLIGATOIRES
              </h3>
              <p className="text-sm text-red-700 font-body">
                Ces informations sont indispensables pour référencer le lieu de culte
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-body font-medium text-red-700 mb-1">
                    📝 Nom du lieu de culte *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors font-body"
                    placeholder="Ex: Église Saint-Pierre, Temple Protestant..."
                    value={formData.name}
                    onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium text-red-700 mb-1">
                    🏷️ Dénomination *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors font-body"
                    value={formData.denomination}
                    onChange={e => setFormData(f => ({ ...f, denomination: e.target.value as Denomination }))}
                  >
                    {denominations.map(d => (
                      <option key={d} value={d}>{denominationLabels[d]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-body font-medium text-red-700 mb-1">
                    📍 Adresse complète *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors font-body"
                    placeholder="Ex: 14 rue Mozart"
                    value={formData.address}
                    onChange={e => setFormData(f => ({ ...f, address: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium text-red-700 mb-1">
                    🏙️ Ville *
                  </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors font-body"
                      placeholder="Metz"
                      value={formData.city}
                      onChange={e => setFormData(f => ({ ...f, city: e.target.value }))}
                    />
                </div>

                {/* Horaires des événements - dans la section obligatoire */}
                <div className="space-y-3 pt-4 border-t border-red-200">
                  <h4 className="text-base font-body font-medium text-red-800 flex items-center gap-2">
                    📅 Horaires des événements *
                  </h4>
                  <p className="text-sm text-red-700 font-body">
                    Ajoutez les horaires des célébrations, prières, confessions, groupes de prière, etc.
                  </p>
              
              {/* Formulaire d'ajout d'horaire */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-body font-medium text-red-700 mb-1">
                      ⛪ Type de célébration *
                    </label>
                    <select
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-body"
                      value={formData.celebrationType}
                      onChange={e => setFormData(prev => ({ ...prev, celebrationType: e.target.value }))}
                    >
                      <option value="">Sélectionner le type</option>
                      {celebrationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-body font-medium text-red-700 mb-1">
                      📅 Jour *
                    </label>
                    <select
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-body"
                      value={formData.day}
                      onChange={e => setFormData(prev => ({ ...prev, day: e.target.value }))}
                    >
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-body font-medium text-red-700 mb-1">
                      🕐 Heure de début *
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-body"
                      value={formData.startTime}
                      onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-body font-medium text-red-700 mb-1">
                      🕕 Heure de fin *
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-body"
                      value={formData.endTime}
                      onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Accessibilité - dans la section obligatoire */}
                <div className="space-y-3 pt-4 border-t border-red-200">
                  <h4 className="text-base font-body font-medium text-red-800 flex items-center gap-2">
                    ♿ Accessibilité *
                  </h4>
                  
                  <div className="space-y-2">
                    {[
                      { value: 'yes', label: '♿ Totalement accessible' },
                      { value: 'partial', label: '⚠️ Partiellement accessible' },
                      { value: 'no', label: '❌ Non accessible' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center gap-3 p-3 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="accessibility"
                          value={option.value}
                          checked={formData.accessibility === option.value}
                          onChange={e => setFormData(f => ({ ...f, accessibility: e.target.value as 'yes' | 'partial' | 'no' }))}
                          className="w-4 h-4 text-red-600 border-red-300 focus:ring-red-500"
                        />
                        <span className="text-sm font-body font-medium text-red-700">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

            {/* ===== SECTION OPTIONNELLE (BLEUE) ===== */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-4">
              <h3 className="text-lg font-body font-semibold text-blue-800 flex items-center gap-2">
                ℹ️ CHAMPS OPTIONNELS
              </h3>
              <p className="text-sm text-blue-700 font-body">
                Ces informations permettent d'enrichir la fiche du lieu de culte
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-body font-medium text-blue-700 mb-1">
                    🌐 Site web
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-body"
                    placeholder="https://exemple.fr"
                    value={formData.website}
                    onChange={e => setFormData(f => ({ ...f, website: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium text-blue-700 mb-1">
                    📱 Instagram
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-body"
                    placeholder="https://instagram.com/exemple"
                    value={formData.instagram}
                    onChange={e => setFormData(f => ({ ...f, instagram: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-body font-medium text-blue-700 mb-1">
                    📺 YouTube
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-body"
                    placeholder="https://youtube.com/exemple"
                    value={formData.youtube}
                    onChange={e => setFormData(f => ({ ...f, youtube: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              {onBack ? (
                <>
                  <button
                    type="button"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-body"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-4 text-sm rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 font-body font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Validation en cours...</span>
                      </div>
                    ) : (
                      '✅ Valider ce lieu'
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-body"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-4 text-sm rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 font-body font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Validation en cours...</span>
                      </div>
                    ) : (
                      '✅ Valider ce lieu'
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Church, X, Calendar, Globe, Accessibility, ArrowLeft, AlertCircle } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto">
      {/* Formulaire d'ajout de lieu - Style Culteo */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Messages d'erreur */}
        {errors.length > 0 && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
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

        {/* ===== INFORMATIONS ESSENTIELLES ===== */}
        <div className="bg-culteo-blanc-pur border border-culteo-vert-esperance/20 rounded-culteo-xl p-6 md:p-8 shadow-culteo-soft space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-culteo-vert-esperance/10">
            <div className="w-10 h-10 bg-gradient-to-r from-culteo-vert-esperance to-culteo-jaune-lumiere rounded-culteo flex items-center justify-center">
              <span className="text-white font-bold text-lg">✨</span>
            </div>
            <div>
              <h3 className="text-xl font-poppins font-bold text-culteo-gris-basalte">
                Informations essentielles
              </h3>
              <p className="text-sm font-lato text-culteo-gris-basalte/70">
                Ces informations nous permettront de créer une fiche complète
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-poppins font-semibold text-culteo-gris-basalte mb-2">
                📝 Nom du lieu de culte *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-culteo bg-culteo-blanc-coquille/50 focus:ring-2 focus:ring-culteo-vert-esperance/30 focus:border-culteo-vert-esperance focus:bg-culteo-blanc-pur transition-all duration-200 font-lato placeholder:text-gray-400"
                placeholder="Ex: Église Saint-Pierre, Temple Protestant..."
                value={formData.name}
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-poppins font-semibold text-culteo-gris-basalte mb-2">
                🏷️ Dénomination *
              </label>
              <select
                required
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-culteo bg-culteo-blanc-coquille/50 focus:ring-2 focus:ring-culteo-vert-esperance/30 focus:border-culteo-vert-esperance focus:bg-culteo-blanc-pur transition-all duration-200 font-lato"
                value={formData.denomination}
                onChange={e => setFormData(f => ({ ...f, denomination: e.target.value as Denomination }))}
              >
                {denominations.map(d => (
                  <option key={d} value={d}>{denominationLabels[d]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-poppins font-semibold text-culteo-gris-basalte mb-2">
                📍 Adresse complète *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-culteo bg-culteo-blanc-coquille/50 focus:ring-2 focus:ring-culteo-vert-esperance/30 focus:border-culteo-vert-esperance focus:bg-culteo-blanc-pur transition-all duration-200 font-lato placeholder:text-gray-400"
                placeholder="Ex: 14 rue Mozart"
                value={formData.address}
                onChange={e => setFormData(f => ({ ...f, address: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-poppins font-semibold text-culteo-gris-basalte mb-2">
                🏙️ Ville *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-culteo bg-culteo-blanc-coquille/50 focus:ring-2 focus:ring-culteo-vert-esperance/30 focus:border-culteo-vert-esperance focus:bg-culteo-blanc-pur transition-all duration-200 font-lato placeholder:text-gray-400"
                placeholder="Metz"
                value={formData.city}
                onChange={e => setFormData(f => ({ ...f, city: e.target.value }))}
              />
            </div>

            {/* Horaires des événements - dans la section obligatoire */}
            <div className="space-y-4 pt-6 border-t border-culteo-vert-esperance/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-culteo-vert-esperance/10 rounded-culteo flex items-center justify-center">
                  <span className="text-culteo-vert-esperance text-sm">📅</span>
                </div>
                <div>
                  <h4 className="text-base font-poppins font-semibold text-culteo-gris-basalte">
                    Horaires des événements *
                  </h4>
                  <p className="text-sm font-lato text-culteo-gris-basalte/70">
                    Célébrations, prières, confessions, groupes de prière, etc.
                  </p>
                </div>
              </div>
          
              {/* Formulaire d'ajout d'horaire */}
              <div className="bg-culteo-blanc-coquille/30 border border-culteo-vert-esperance/10 p-4 rounded-culteo space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-poppins font-semibold text-culteo-gris-basalte mb-2">
                      ⛪ Type de célébration *
                    </label>
                    <select
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-culteo bg-culteo-blanc-pur focus:ring-2 focus:ring-culteo-vert-esperance/30 focus:border-culteo-vert-esperance transition-all duration-200 font-lato"
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
                    <label className="block text-sm font-poppins font-semibold text-culteo-gris-basalte mb-2">
                      📅 Jour *
                    </label>
                    <select
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-culteo bg-culteo-blanc-pur focus:ring-2 focus:ring-culteo-vert-esperance/30 focus:border-culteo-vert-esperance transition-all duration-200 font-lato"
                      value={formData.day}
                      onChange={e => setFormData(prev => ({ ...prev, day: e.target.value }))}
                    >
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-poppins font-semibold text-culteo-gris-basalte mb-2">
                      🕐 Heure de début *
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-culteo bg-culteo-blanc-pur focus:ring-2 focus:ring-culteo-vert-esperance/30 focus:border-culteo-vert-esperance transition-all duration-200 font-lato"
                      value={formData.startTime}
                      onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-poppins font-semibold text-culteo-gris-basalte mb-2">
                      🕕 Heure de fin *
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-culteo bg-culteo-blanc-pur focus:ring-2 focus:ring-culteo-vert-esperance/30 focus:border-culteo-vert-esperance transition-all duration-200 font-lato"
                      value={formData.endTime}
                      onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Accessibilité - dans la section obligatoire */}
              <div className="space-y-4 pt-6 border-t border-culteo-vert-esperance/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-culteo-vert-esperance/10 rounded-culteo flex items-center justify-center">
                    <span className="text-culteo-vert-esperance text-sm">♿</span>
                  </div>
                  <div>
                    <h4 className="text-base font-poppins font-semibold text-culteo-gris-basalte">
                      Accessibilité *
                    </h4>
                    <p className="text-sm font-lato text-culteo-gris-basalte/70">
                      Informez-nous sur l'accessibilité du lieu
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-3">
                  {[
                    { value: 'yes', label: '♿ Totalement accessible', color: 'emerald' },
                    { value: 'partial', label: '⚠️ Partiellement accessible', color: 'amber' },
                    { value: 'no', label: '❌ Non accessible', color: 'gray' }
                  ].map(option => (
                    <label key={option.value} className={`flex items-center gap-4 p-4 border-2 rounded-culteo cursor-pointer transition-all duration-200 ${
                      formData.accessibility === option.value 
                        ? 'border-culteo-vert-esperance bg-culteo-vert-esperance/5' 
                        : 'border-gray-200 hover:border-culteo-vert-esperance/30 hover:bg-culteo-blanc-coquille/30'
                    }`}>
                      <input
                        type="radio"
                        name="accessibility"
                        value={option.value}
                        checked={formData.accessibility === option.value}
                        onChange={e => setFormData(f => ({ ...f, accessibility: e.target.value as 'yes' | 'partial' | 'no' }))}
                        className="w-5 h-5 text-culteo-vert-esperance border-gray-300 focus:ring-culteo-vert-esperance/30"
                      />
                      <span className="text-sm font-lato font-medium text-culteo-gris-basalte">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== INFORMATIONS COMPLÉMENTAIRES ===== */}
        <div className="bg-culteo-blanc-coquille/50 border border-culteo-jaune-lumiere/30 rounded-culteo-xl p-6 md:p-8 shadow-culteo-soft space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-culteo-jaune-lumiere/20">
            <div className="w-10 h-10 bg-gradient-to-r from-culteo-jaune-lumiere to-culteo-vert-esperance rounded-culteo flex items-center justify-center">
              <span className="text-white font-bold text-lg">✨</span>
            </div>
            <div>
              <h3 className="text-xl font-poppins font-bold text-culteo-gris-basalte">
                Informations complémentaires
              </h3>
              <p className="text-sm font-lato text-culteo-gris-basalte/70">
                Ces détails enrichiront la fiche de votre lieu de culte
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-poppins font-semibold text-culteo-gris-basalte mb-2">
                🌐 Site web
              </label>
              <input
                type="url"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-culteo bg-culteo-blanc-pur focus:ring-2 focus:ring-culteo-jaune-lumiere/30 focus:border-culteo-jaune-lumiere transition-all duration-200 font-lato placeholder:text-gray-400"
                placeholder="https://exemple.fr"
                value={formData.website}
                onChange={e => setFormData(f => ({ ...f, website: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-poppins font-semibold text-culteo-gris-basalte mb-2">
                📱 Instagram
              </label>
              <input
                type="url"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-culteo bg-culteo-blanc-pur focus:ring-2 focus:ring-culteo-jaune-lumiere/30 focus:border-culteo-jaune-lumiere transition-all duration-200 font-lato placeholder:text-gray-400"
                placeholder="https://instagram.com/exemple"
                value={formData.instagram}
                onChange={e => setFormData(f => ({ ...f, instagram: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-poppins font-semibold text-culteo-gris-basalte mb-2">
                📺 YouTube
              </label>
              <input
                type="url"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-culteo bg-culteo-blanc-pur focus:ring-2 focus:ring-culteo-jaune-lumiere/30 focus:border-culteo-jaune-lumiere transition-all duration-200 font-lato placeholder:text-gray-400"
                placeholder="https://youtube.com/exemple"
                value={formData.youtube}
                onChange={e => setFormData(f => ({ ...f, youtube: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Actions - Style Culteo */}
        <div className="flex gap-4 pt-6 border-t border-gray-200 mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-culteo-vert-esperance to-culteo-jaune-lumiere text-white px-6 py-3 rounded-culteo font-poppins font-semibold shadow-culteo-medium hover:shadow-culteo-strong transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Validation en cours...</span>
              </>
            ) : (
              <>
                <Church className="h-5 w-5" />
                <span>Valider ce lieu</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
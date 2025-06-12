import React, { useState, useEffect } from 'react';
import { Church, X, MapPin, Loader2, Calendar, Globe, Accessibility, Plus, Trash2 } from 'lucide-react';

// Types cohérents avec votre BDD
type Denomination = 'Catholic' | 'Protestant' | 'Orthodox' | 'Evangelical' | 'Neo-Apostolic' | 'Pentecostal' | 'Baptist' | 'Other';

interface Schedule {
  day: string;
  type: string;
  startTime: string;
  endTime: string;
  description?: string;
}

interface FormData {
  name: string;
  denomination: Denomination;
  address: string;
  postalCode: string;
  city: string;
  website: string;
  instagram: string;
  youtube: string;
  accessibility: boolean;
  schedules: Schedule[];
  latitude: string;
  longitude: string;
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
  'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
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
  'Célébration',
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

const defaultSchedule: Schedule = {
  day: 'Dimanche',
  startTime: '10:00',
  endTime: '11:00',
  type: 'Célébration',
  description: ''
};

export default function ContributeForm({ isOpen, onClose, supabase }: { 
  isOpen: boolean, 
  onClose: () => void,
  supabase: any
}) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    denomination: 'Catholic',
    address: '',
    postalCode: '',
    city: '',
    website: '',
    instagram: '',
    youtube: '',
    accessibility: false,
    schedules: [],
    latitude: '',
    longitude: ''
  });

  const [currentSchedule, setCurrentSchedule] = useState<Schedule>({
    day: 'Dimanche',
    type: 'Messe',
    startTime: '10:30',
    endTime: '11:30'
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoError, setGeoError] = useState(false);

  // Génération d'un ID unique
  const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Géolocalisation automatique quand l'adresse est complète
  useEffect(() => {
    const geocodeAddress = async () => {
      if (formData.address && formData.city && formData.postalCode && !formData.latitude) {
        setIsGeolocating(true);
        setGeoError(false);
        try {
          // Essayer d'abord avec Google Maps Geocoding API (plus fiable)
          const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
          
          if (googleApiKey) {
            console.log(`🌍 Tentative avec Google Maps Geocoding API`);
            const fullAddress = `${formData.address}, ${formData.postalCode} ${formData.city}, France`;
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${googleApiKey}&region=fr`
            );
            const data = await response.json();
            
            console.log(`🌍 Résultat Google Maps:`, data);
            
            if (data.status === 'OK' && data.results && data.results.length > 0) {
              const result = data.results[0];
              setFormData(prev => ({
                ...prev,
                latitude: result.geometry.location.lat.toFixed(7),
                longitude: result.geometry.location.lng.toFixed(7)
              }));
              console.log(`✅ Géocodage Google Maps réussi: ${result.geometry.location.lat}, ${result.geometry.location.lng}`);
              setIsGeolocating(false);
              return;
            } else {
              console.log(`⚠️ Google Maps API: ${data.status} - ${data.error_message || 'Aucun résultat'}`);
            }
          } else {
            console.log(`⚠️ Clé API Google Maps non configurée, utilisation de Nominatim`);
          }

          // Fallback vers Nominatim si Google Maps échoue ou n'est pas configuré
          const addressFormats = [
            `${formData.address}, ${formData.postalCode} ${formData.city}, France`,
            `${formData.address}, ${formData.city}, ${formData.postalCode}, France`,
            `${formData.address}, ${formData.city}, France`,
            `${formData.postalCode} ${formData.city}, France`
          ];

          let found = false;
          for (const fullAddress of addressFormats) {
            if (found) break;
            
            console.log(`🌍 Tentative Nominatim: ${fullAddress}`);
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=3&countrycodes=fr&addressdetails=1`
            );
            const data = await response.json();
            
            console.log(`🌍 Résultat Nominatim pour "${fullAddress}":`, data);
            
            if (data && data.length > 0) {
              const result = data[0];
              setFormData(prev => ({
                ...prev,
                latitude: parseFloat(result.lat).toFixed(7),
                longitude: parseFloat(result.lon).toFixed(7)
              }));
              console.log(`✅ Géocodage Nominatim réussi: ${result.lat}, ${result.lon}`);
              found = true;
              break;
            }
          }
          
          if (!found) {
            console.log(`❌ Aucun résultat trouvé pour l'adresse`);
            setGeoError(true);
          }
        } catch (error) {
          console.error('❌ Erreur géocodage:', error);
          setGeoError(true);
        } finally {
          setIsGeolocating(false);
        }
      }
    };

    // Délai pour éviter trop d'appels API
    const timeoutId = setTimeout(geocodeAddress, 1500);
    return () => clearTimeout(timeoutId);
  }, [formData.address, formData.city, formData.postalCode]);

  // Fonction de géolocalisation manuelle
  const manualGeocode = async () => {
    if (!formData.address || !formData.city) {
      setErrors(['Veuillez saisir une adresse et une ville avant la géolocalisation']);
      return;
    }

    setIsGeolocating(true);
    setGeoError(false);
    setErrors([]);
    
    try {
      // Essayer d'abord avec Google Maps Geocoding API (plus fiable)
      const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (googleApiKey) {
        console.log(`🌍 Tentative manuelle avec Google Maps Geocoding API`);
        const fullAddress = `${formData.address}, ${formData.postalCode} ${formData.city}, France`;
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${googleApiKey}&region=fr`
        );
        const data = await response.json();
        
        console.log(`🌍 Résultat Google Maps manuel:`, data);
        
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const result = data.results[0];
          setFormData(prev => ({
            ...prev,
            latitude: result.geometry.location.lat.toFixed(7),
            longitude: result.geometry.location.lng.toFixed(7)
          }));
          setErrors([]);
          setGeoError(false);
          console.log(`✅ Géocodage Google Maps manuel réussi: ${result.geometry.location.lat}, ${result.geometry.location.lng}`);
          console.log(`📍 Adresse trouvée: ${result.formatted_address}`);
          setIsGeolocating(false);
          return;
        } else {
          console.log(`⚠️ Google Maps API manuel: ${data.status} - ${data.error_message || 'Aucun résultat'}`);
          if (data.status === 'ZERO_RESULTS') {
            setErrors([
              'Adresse non trouvée avec Google Maps. Suggestions:',
              '• Vérifiez l\'orthographe de la rue',
              '• Essayez sans le numéro de rue',
              '• Vérifiez le code postal et la ville'
            ]);
            setGeoError(true);
            setIsGeolocating(false);
            return;
          }
        }
      } else {
        console.log(`⚠️ Clé API Google Maps non configurée, utilisation de Nominatim`);
      }

      // Fallback vers Nominatim si Google Maps échoue ou n'est pas configuré
      const addressFormats = [
        `${formData.address}, ${formData.postalCode} ${formData.city}, France`,
        `${formData.address}, ${formData.city}, ${formData.postalCode}, France`,
        `${formData.address}, ${formData.city}, France`,
        `${formData.postalCode} ${formData.city}, France`
      ];

      let found = false;
      let bestResult = null;
      
      for (const fullAddress of addressFormats) {
        if (found) break;
        
        console.log(`🌍 Tentative manuelle Nominatim: ${fullAddress}`);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=5&countrycodes=fr&addressdetails=1`
        );
        const data = await response.json();
        
        console.log(`🌍 Résultats Nominatim pour "${fullAddress}":`, data);
        
        if (data && data.length > 0) {
          // Chercher le meilleur résultat (celui qui correspond le mieux à l'adresse)
          for (const result of data) {
            const address = result.address || {};
            const displayName = result.display_name || '';
            
            // Vérifier si le résultat correspond bien à notre recherche
            const matchesPostalCode = !formData.postalCode || 
              address.postcode === formData.postalCode ||
              displayName.includes(formData.postalCode);
            
            const matchesCity = !formData.city ||
              address.city === formData.city ||
              address.town === formData.city ||
              address.village === formData.city ||
              displayName.toLowerCase().includes(formData.city.toLowerCase());
            
            if (matchesPostalCode && matchesCity) {
              bestResult = result;
              found = true;
              break;
            } else if (!bestResult) {
              bestResult = result; // Garder au moins un résultat
            }
          }
          
          if (bestResult) {
            found = true;
            break;
          }
        }
      }
      
      if (bestResult) {
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(bestResult.lat).toFixed(7),
          longitude: parseFloat(bestResult.lon).toFixed(7)
        }));
        setErrors([]);
        setGeoError(false);
        console.log(`✅ Géocodage Nominatim manuel réussi: ${bestResult.lat}, ${bestResult.lon}`);
        console.log(`📍 Adresse trouvée: ${bestResult.display_name}`);
      } else {
        setErrors([
          'Adresse non trouvée. Suggestions:',
          '• Vérifiez l\'orthographe de la rue',
          '• Essayez sans le numéro de rue',
          '• Vérifiez le code postal et la ville'
        ]);
        setGeoError(true);
        console.log(`❌ Aucun résultat trouvé pour l'adresse`);
      }
    } catch (error) {
      console.error('❌ Erreur géocodage manuel:', error);
      setErrors(['Erreur lors de la géolocalisation. Veuillez réessayer.']);
      setGeoError(true);
    } finally {
      setIsGeolocating(false);
    }
  };

  const addSchedule = () => {
    if (currentSchedule.startTime && currentSchedule.endTime) {
      setFormData(prev => ({
        ...prev,
        schedules: [...prev.schedules, { ...currentSchedule }]
      }));
      setCurrentSchedule({
        day: 'Dimanche',
        type: 'Messe',
        startTime: '10:30',
        endTime: '11:30'
      });
    }
  };

  const removeSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!supabase) {
      setErrors(['Erreur de configuration: client Supabase non disponible']);
      return;
    }

    // Validation
    const newErrors: string[] = [];
    if (!formData.name.trim()) newErrors.push('Le nom du lieu de culte est obligatoire');
    if (!formData.address.trim()) newErrors.push('L\'adresse est obligatoire');
    if (!formData.postalCode.trim()) newErrors.push('Le code postal est obligatoire');
    if (!formData.city.trim()) newErrors.push('La ville est obligatoire');
    if (formData.schedules.length === 0) newErrors.push('Ajoutez au moins un horaire d\'événement');

    // Si pas de coordonnées, essayer une dernière géolocalisation
    if (!formData.latitude || !formData.longitude) {
      console.log('⚠️ Pas de coordonnées, tentative de géolocalisation de secours...');
      try {
        await manualGeocode();
        // Attendre un peu pour que la géolocalisation se termine
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.log('❌ Géolocalisation de secours échouée:', error);
      }
    }

    // Si toujours pas de coordonnées, utiliser des coordonnées par défaut basées sur le code postal
    let finalLatitude = formData.latitude;
    let finalLongitude = formData.longitude;

    if (!finalLatitude || !finalLongitude) {
      console.log('⚠️ Utilisation de coordonnées approximatives basées sur le code postal');
      // Coordonnées approximatives pour quelques codes postaux français courants
      const postalCodeCoords: Record<string, [string, string]> = {
        '57000': ['49.1193', '6.1757'], // Metz
        '75001': ['48.8566', '2.3522'], // Paris 1er
        '69001': ['45.7640', '4.8357'], // Lyon 1er
        '13001': ['43.2965', '5.3698'], // Marseille 1er
        '31000': ['43.6047', '1.4442'], // Toulouse
        '59000': ['50.6292', '3.0573'], // Lille
        '67000': ['48.5734', '7.7521'], // Strasbourg
        '44000': ['47.2184', '-1.5536'], // Nantes
        '34000': ['43.6110', '3.8767'], // Montpellier
        '35000': ['48.1173', '-1.6778'], // Rennes
      };

      const postalPrefix = formData.postalCode.substring(0, 2);
      const departmentCoords: Record<string, [string, string]> = {
        '01': ['46.2044', '5.2265'], // Ain
        '02': ['49.5679', '3.6230'], // Aisne
        '03': ['46.3408', '3.4122'], // Allier
        '04': ['44.2619', '6.2371'], // Alpes-de-Haute-Provence
        '05': ['44.6778', '6.0839'], // Hautes-Alpes
        '06': ['43.7102', '7.2620'], // Alpes-Maritimes
        '07': ['44.7297', '4.6006'], // Ardèche
        '08': ['49.7713', '4.7197'], // Ardennes
        '09': ['42.9637', '1.6045'], // Ariège
        '10': ['48.2973', '4.0781'], // Aube
        '11': ['43.2130', '2.3491'], // Aude
        '12': ['44.3518', '2.5794'], // Aveyron
        '13': ['43.5297', '5.4474'], // Bouches-du-Rhône
        '14': ['49.1829', '-0.3707'], // Calvados
        '15': ['45.0370', '2.4169'], // Cantal
        '16': ['45.6480', '0.1562'], // Charente
        '17': ['45.7485', '-0.6560'], // Charente-Maritime
        '18': ['47.0810', '2.3988'], // Cher
        '19': ['45.2671', '1.7674'], // Corrèze
        '21': ['47.3220', '5.0415'], // Côte-d'Or
        '22': ['48.5125', '-2.7674'], // Côtes-d'Armor
        '23': ['46.1667', '2.0000'], // Creuse
        '24': ['45.1848', '0.7218'], // Dordogne
        '25': ['47.2380', '6.0335'], // Doubs
        '26': ['44.7297', '5.0469'], // Drôme
        '27': ['49.0968', '0.8890'], // Eure
        '28': ['48.4469', '1.4884'], // Eure-et-Loir
        '29': ['48.2020', '-4.2649'], // Finistère
        '30': ['43.8374', '4.3601'], // Gard
        '31': ['43.6047', '1.4442'], // Haute-Garonne
        '32': ['43.6476', '0.5767'], // Gers
        '33': ['44.8378', '-0.5792'], // Gironde
        '34': ['43.6110', '3.8767'], // Hérault
        '35': ['48.1173', '-1.6778'], // Ille-et-Vilaine
        '36': ['46.8139', '1.6914'], // Indre
        '37': ['47.3941', '0.6848'], // Indre-et-Loire
        '38': ['45.1885', '5.7245'], // Isère
        '39': ['46.7540', '5.8949'], // Jura
        '40': ['44.0000', '-0.7667'], // Landes
        '41': ['47.7439', '1.3239'], // Loir-et-Cher
        '42': ['45.4397', '4.3872'], // Loire
        '43': ['45.0438', '3.8846'], // Haute-Loire
        '44': ['47.2184', '-1.5536'], // Loire-Atlantique
        '45': ['47.9029', '2.3441'], // Loiret
        '46': ['44.4478', '1.4442'], // Lot
        '47': ['44.3518', '0.6190'], // Lot-et-Garonne
        '48': ['44.5176', '3.5016'], // Lozère
        '49': ['47.4739', '-0.5540'], // Maine-et-Loire
        '50': ['49.1158', '-1.3136'], // Manche
        '51': ['49.0431', '4.0221'], // Marne
        '52': ['48.1126', '5.1378'], // Haute-Marne
        '53': ['48.0667', '-0.7667'], // Mayenne
        '54': ['48.6921', '6.1844'], // Meurthe-et-Moselle
        '55': ['49.1608', '5.3845'], // Meuse
        '56': ['47.7482', '-2.9648'], // Morbihan
        '57': ['49.1193', '6.1757'], // Moselle
        '58': ['47.2173', '3.5308'], // Nièvre
        '59': ['50.6292', '3.0573'], // Nord
        '60': ['49.4174', '2.8269'], // Oise
        '61': ['48.7309', '0.0890'], // Orne
        '62': ['50.4581', '2.3414'], // Pas-de-Calais
        '63': ['45.7797', '3.0863'], // Puy-de-Dôme
        '64': ['43.2951', '-0.3707'], // Pyrénées-Atlantiques
        '65': ['43.2327', '0.0782'], // Hautes-Pyrénées
        '66': ['42.6976', '2.8954'], // Pyrénées-Orientales
        '67': ['48.5734', '7.7521'], // Bas-Rhin
        '68': ['47.7500', '7.3333'], // Haut-Rhin
        '69': ['45.7640', '4.8357'], // Rhône
        '70': ['47.6319', '6.1553'], // Haute-Saône
        '71': ['46.7540', '4.8949'], // Saône-et-Loire
        '72': ['48.0061', '0.1996'], // Sarthe
        '73': ['45.5646', '6.3282'], // Savoie
        '74': ['46.0763', '6.4043'], // Haute-Savoie
        '75': ['48.8566', '2.3522'], // Paris
        '76': ['49.4431', '1.0993'], // Seine-Maritime
        '77': ['48.8499', '2.6370'], // Seine-et-Marne
        '78': ['48.8014', '2.1301'], // Yvelines
        '79': ['46.3230', '-0.4597'], // Deux-Sèvres
        '80': ['49.8942', '2.2957'], // Somme
        '81': ['43.9297', '2.1481'], // Tarn
        '82': ['44.0151', '1.3539'], // Tarn-et-Garonne
        '83': ['43.4642', '6.2348'], // Var
        '84': ['44.0000', '5.1667'], // Vaucluse
        '85': ['46.6702', '-1.4267'], // Vendée
        '86': ['46.5802', '0.3404'], // Vienne
        '87': ['45.8354', '1.2644'], // Haute-Vienne
        '88': ['48.1667', '6.4500'], // Vosges
        '89': ['47.7982', '3.5675'], // Yonne
        '90': ['47.6319', '6.8630'], // Territoire de Belfort
        '91': ['48.6301', '2.4281'], // Essonne
        '92': ['48.8499', '2.2370'], // Hauts-de-Seine
        '93': ['48.9356', '2.3539'], // Seine-Saint-Denis
        '94': ['48.7767', '2.4370'], // Val-de-Marne
        '95': ['49.0301', '2.0781'], // Val-d'Oise
      };

      // Essayer d'abord avec le code postal exact
      if (postalCodeCoords[formData.postalCode]) {
        [finalLatitude, finalLongitude] = postalCodeCoords[formData.postalCode];
        console.log(`📍 Coordonnées trouvées pour ${formData.postalCode}: ${finalLatitude}, ${finalLongitude}`);
      }
      // Sinon utiliser les coordonnées du département
      else if (departmentCoords[postalPrefix]) {
        [finalLatitude, finalLongitude] = departmentCoords[postalPrefix];
        console.log(`📍 Coordonnées approximatives pour le département ${postalPrefix}: ${finalLatitude}, ${finalLongitude}`);
      }
      // En dernier recours, coordonnées du centre de la France
      else {
        finalLatitude = '46.2276';
        finalLongitude = '2.2137';
        console.log(`📍 Coordonnées par défaut (centre France): ${finalLatitude}, ${finalLongitude}`);
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Formatage des horaires pour la BDD - Format JSON comme dans la vraie BDD
      const formattedSchedules = JSON.stringify(formData.schedules.map(s => ({
        type: s.type,
        day: s.day,
        startTime: s.startTime,
        endTime: s.endTime
      })));

      // Préparation des données pour l'insertion
      const insertData = {
        id: generateId(),
        Nom: formData.name, // Nom du lieu, PAS du contributeur
        Dénomination: denominationLabels[formData.denomination],
        Rue: formData.address,
        Ville: formData.city,
        'Code Postal': formData.postalCode,
        'Horaires d\'ouverture (général)': 'Voir horaires des événements',
        'Site Web': formData.website || null,
        'Heures des cultes et prières': formattedSchedules, // Format JSON
        Latitude: finalLatitude,
        Longitude: finalLongitude,
        Accessible: formData.accessibility.toString(),
        Instagram: formData.instagram || null,
        YouTube: formData.youtube || null
      };

      console.log('Données à insérer:', insertData);

      const { data, error } = await supabase.from('BDD').insert([insertData]);
      
      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur Supabase: ${error.message || 'Erreur inconnue'}`);
      }

      console.log('Insertion réussie:', data);
      alert('Merci ! Votre contribution a été envoyée avec succès.');
      
      // Reset du formulaire
      setFormData({
        name: '',
        denomination: 'Catholic',
        address: '',
        postalCode: '',
        city: '',
        website: '',
        instagram: '',
        youtube: '',
        accessibility: false,
        schedules: [],
        latitude: '',
        longitude: ''
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center relative">
            <button 
              onClick={onClose} 
              type="button" 
              className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Church className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Référencer une Église
            </h2>
            <p className="text-gray-600">
              Aidez la communauté en partageant les informations d'un lieu de culte
            </p>
          </div>

          {/* Erreurs */}
          {errors.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Veuillez corriger les erreurs suivantes :
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {errors.map((error, i) => <li key={i}>{error}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations du lieu */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Church className="h-5 w-5 text-blue-600" />
                Informations du lieu de culte
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du lieu de culte *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ex: Église Saint-Pierre, Temple Protestant..."
                    value={formData.name}
                    onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dénomination *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.denomination}
                    onChange={e => setFormData(f => ({ ...f, denomination: e.target.value as Denomination }))}
                  >
                    {denominations.map(d => (
                      <option key={d} value={d}>{denominationLabels[d]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse complète *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ex: 14 rue Mozart"
                    value={formData.address}
                    onChange={e => setFormData(f => ({ ...f, address: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="57000"
                      value={formData.postalCode}
                      onChange={e => setFormData(f => ({ ...f, postalCode: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Metz"
                      value={formData.city}
                      onChange={e => setFormData(f => ({ ...f, city: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Site web (optionnel)
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="https://exemple.fr"
                    value={formData.website}
                    onChange={e => setFormData(f => ({ ...f, website: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Instagram (optionnel)
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="https://instagram.com/exemple"
                    value={formData.instagram}
                    onChange={e => setFormData(f => ({ ...f, instagram: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    YouTube (optionnel)
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="https://youtube.com/exemple"
                    value={formData.youtube}
                    onChange={e => setFormData(f => ({ ...f, youtube: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Horaires des événements - OBLIGATOIRES */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Horaires des événements *
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                📍 Ajoutez les horaires des célébrations, prières, confessions, groupes de prière, etc.
              </p>
              
              {/* Formulaire d'ajout d'horaire */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🕒 Type de célébration
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={currentSchedule.type}
                      onChange={e => setCurrentSchedule(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="">Sélectionner le type</option>
                      {celebrationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jour
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={currentSchedule.day}
                      onChange={e => setCurrentSchedule(prev => ({ ...prev, day: e.target.value }))}
                    >
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de début
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={currentSchedule.startTime}
                      onChange={e => setCurrentSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Heure de fin
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={currentSchedule.endTime}
                      onChange={e => setCurrentSchedule(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={addSchedule}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter cet horaire
                </button>
              </div>

              {/* Liste des horaires ajoutés */}
              {formData.schedules.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Horaires ajoutés :</h4>
                  {formData.schedules.map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                      <span className="text-sm">
                        <strong>{schedule.type}</strong> - {schedule.day} de {schedule.startTime} à {schedule.endTime}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSchedule(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Géolocalisation discrète - seulement si problème */}
            {(geoError || (!formData.latitude && !isGeolocating && formData.address && formData.city && formData.postalCode)) && (
              <div className="space-y-4">
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-orange-500 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-orange-800">
                        Localisation non trouvée
                      </h4>
                      <p className="text-sm text-orange-700 mt-1">
                        Vérifiez l'adresse ou cliquez pour réessayer la géolocalisation
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={manualGeocode}
                    disabled={isGeolocating}
                    className="mt-3 flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors disabled:opacity-50"
                  >
                    {isGeolocating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                    {isGeolocating ? 'Recherche...' : 'Réessayer la géolocalisation'}
                  </button>
                </div>
              </div>
            )}

            {/* Indicateur discret de géolocalisation réussie */}
            {formData.latitude && formData.longitude && (
              <div className="text-xs text-green-600 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Localisation trouvée
              </div>
            )}

            {/* Accessibilité */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Accessibility className="h-5 w-5 text-blue-600" />
                Accessibilité
              </h3>
              
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.accessibility}
                  onChange={e => setFormData(f => ({ ...f, accessibility: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Accessible aux personnes à mobilité réduite
                </span>
              </label>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-8 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold text-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Validation en cours...</span>
                  </div>
                ) : (
                  '✅ Valider ce lieu'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
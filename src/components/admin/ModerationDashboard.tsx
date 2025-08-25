import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle, User, Calendar, MapPin, Church, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TestimonyItem {
  id: string;
  user_name: string;
  user_email: string;
  title: string;
  content: string;
  location?: string;
  date_shared: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface PrayerItem {
  id: string;
  user_name: string;
  user_email: string;
  title: string;
  content: string;
  category: string;
  is_urgent: boolean;
  date_requested: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ChurchItem {
  id: string;
  Nom: string;
  Denomination: string;
  Adresse: string;
  Ville: string;
  Code_postal: string;
  Site_web?: string;
  Instagram?: string;
  YouTube?: string;
  Horaires: string;
  Accessible: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  Latitude?: number;
  Longitude?: number;
}

export const ModerationDashboard: React.FC = () => {
  const [pendingTestimonies, setPendingTestimonies] = useState<TestimonyItem[]>([]);
  const [pendingPrayers, setPendingPrayers] = useState<PrayerItem[]>([]);
  const [pendingChurches, setPendingChurches] = useState<ChurchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'testimonies' | 'prayers' | 'churches'>('testimonies');

  useEffect(() => {
    loadPendingContent();
  }, []);

  const loadPendingContent = async () => {
    console.log('🔍 Début du chargement des données pending...');
    try {
      // Récupérer les témoignages en attente
      console.log('📊 Récupération des témoignages...');
      const { data: testimonies, error: testimoniesError } = await supabase
        .from('testimonies')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      console.log('✨ Témoignages récupérés:', testimonies);
      console.log('❌ Erreur témoignages:', testimoniesError);

      // Récupérer les prières en attente
      console.log('🙏 Récupération des prières...');
      const { data: prayers, error: prayersError } = await supabase
        .from('prayer_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      console.log('✨ Prières récupérées:', prayers);
      console.log('❌ Erreur prières:', prayersError);

      // Récupérer les lieux de culte en attente
      console.log('🏛️ Récupération des lieux de culte...');
      const { data: churches, error: churchesError } = await supabase
        .from('BDD')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      console.log('✨ Lieux de culte récupérés:', churches);
      console.log('❌ Erreur lieux de culte:', churchesError);

      setPendingTestimonies(testimonies || []);
      setPendingPrayers(prayers || []);
      setPendingChurches(churches || []);

      console.log('📈 État final - Témoignages:', testimonies?.length || 0);
      console.log('📈 État final - Prières:', prayers?.length || 0);
      console.log('📈 État final - Lieux de culte:', churches?.length || 0);
    } catch (error) {
      console.error('💥 Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
      console.log('✅ Chargement terminé');
    }
  };

  const moderateTestimony = async (id: string, action: 'approved' | 'rejected', reason?: string) => {
    try {
      const { error } = await supabase
        .from('testimonies')
        .update({
          status: action,
          moderated_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', id);

      if (!error) {
        setPendingTestimonies(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Erreur lors de la modération:', error);
    }
  };

  const moderatePrayer = async (id: string, action: 'approved' | 'rejected', reason?: string) => {
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .update({
          status: action,
          moderated_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', id);

      if (!error) {
        setPendingPrayers(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Erreur lors de la modération:', error);
    }
  };

  const moderateChurch = async (id: string, action: 'approved' | 'rejected', reason?: string, coordinates?: { lat: number, lng: number }) => {
    try {
      const updateData: any = {
        status: action,
        moderated_at: new Date().toISOString(),
        rejection_reason: reason
      };

      // Si approuvé et que des coordonnées sont fournies, les ajouter
      if (action === 'approved' && coordinates) {
        updateData.Latitude = coordinates.lat;
        updateData.Longitude = coordinates.lng;
      }

      const { error } = await supabase
        .from('BDD')
        .update(updateData)
        .eq('id', id);

      if (!error) {
        setPendingChurches(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Erreur lors de la modération du lieu:', error);
    }
  };

  const ModerationCard: React.FC<{
    type: 'testimony' | 'prayer';
    item: TestimonyItem | PrayerItem;
  }> = ({ type, item }) => {
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleApprove = () => {
      if (type === 'testimony') {
        moderateTestimony(item.id, 'approved');
      } else {
        moderatePrayer(item.id, 'approved');
      }
    };

    const handleReject = () => {
      if (rejectionReason.trim()) {
        if (type === 'testimony') {
          moderateTestimony(item.id, 'rejected', rejectionReason);
        } else {
          moderatePrayer(item.id, 'rejected', rejectionReason);
        }
        setShowRejectForm(false);
        setRejectionReason('');
      }
    };

    const isUrgent = type === 'prayer' && (item as PrayerItem).is_urgent;

    return (
      <div className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 ${isUrgent ? 'border-red-400 shadow-red-400/20 shadow-lg' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              {isUrgent && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <AlertTriangle size={12} />
                  URGENT
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-white/70 mb-3">
              <span className="flex items-center gap-1">
                <User size={14} />
                {item.user_name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(
                  type === 'testimony'
                    ? (item as TestimonyItem).date_shared
                    : (item as PrayerItem).date_requested
                ).toLocaleDateString('fr-FR')}
              </span>
              {type === 'testimony' && (item as TestimonyItem).location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {(item as TestimonyItem).location}
                </span>
              )}
            </div>
            {type === 'prayer' && (
              <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs mb-3">
                {(item as PrayerItem).category}
              </span>
            )}
          </div>
        </div>

        <p className="text-white/90 mb-4 line-clamp-3">{item.content}</p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleApprove}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <CheckCircle size={16} />
            Approuver
          </button>
          
          <button
            onClick={() => setShowRejectForm(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <XCircle size={16} />
            Rejeter
          </button>
        </div>

        {showRejectForm && (
          <div className="mt-4 p-4 bg-black/20 rounded-lg">
            <label className="block text-sm font-medium text-white mb-2">
              Raison du rejet :
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none resize-none"
              rows={3}
              placeholder="Expliquez pourquoi ce contenu est rejeté..."
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Confirmer le rejet
              </button>
              <button
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectionReason('');
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ChurchModerationCard: React.FC<{
    item: ChurchItem;
  }> = ({ item }) => {
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showGeolocation, setShowGeolocation] = useState(false);
    const [coordinates, setCoordinates] = useState<{ lat: number, lng: number } | null>(null);
    const [geolocating, setGeolocating] = useState(false);

    const geocodeAddress = async () => {
      setGeolocating(true);
      try {
        // Utiliser l'API Nominatim pour géocoder l'adresse
        const fullAddress = `${item.Adresse}, ${item.Ville}, France`;
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
        } else {
          alert('Impossible de géolocaliser cette adresse. Veuillez vérifier l\'adresse ou géolocaliser manuellement.');
        }
      } catch (error) {
        console.error('Erreur de géolocalisation:', error);
        alert('Erreur lors de la géolocalisation');
      } finally {
        setGeolocating(false);
      }
    };

    const handleApprove = () => {
      if (coordinates) {
        moderateChurch(item.id, 'approved', undefined, coordinates);
      } else {
        // Approuver sans coordonnées (peuvent être ajoutées plus tard)
        moderateChurch(item.id, 'approved');
      }
    };

    const handleReject = () => {
      if (rejectionReason.trim()) {
        moderateChurch(item.id, 'rejected', rejectionReason);
        setShowRejectForm(false);
        setRejectionReason('');
      }
    };

    // Parser les horaires JSON si possible
    let parsedSchedule = '';
    try {
      const schedule = JSON.parse(item.Horaires);
      parsedSchedule = `${schedule.type} - ${schedule.day} ${schedule.startTime}-${schedule.endTime}`;
    } catch {
      parsedSchedule = item.Horaires;
    }

    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-3 rounded-full">
              <Church className="text-orange-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{item.Nom}</h3>
              <p className="text-white/70 text-sm">{item.Denomination}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
              <Calendar size={14} />
              {new Date(item.created_at).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                <MapPin size={14} />
                Adresse
              </div>
              <p className="text-white font-medium">{item.Adresse}</p>
              <p className="text-white/80 text-sm">{item.Ville} {item.Code_postal}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                <Clock size={14} />
                Horaires
              </div>
              <p className="text-white font-medium">{parsedSchedule}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-white/70 text-sm mb-1">Accessibilité</div>
              <p className="text-white font-medium">{item.Accessible ? '♿ Accessible' : '❌ Non accessible'}</p>
            </div>
            
            {item.Site_web && (
              <div>
                <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
                  <Globe size={14} />
                  Site web
                </div>
                <a href={item.Site_web} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm truncate block">
                  {item.Site_web}
                </a>
              </div>
            )}

            {(item.Instagram || item.YouTube) && (
              <div>
                <div className="text-white/70 text-sm mb-1">Réseaux sociaux</div>
                <div className="space-y-1">
                  {item.Instagram && (
                    <a href={item.Instagram} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 text-sm block">
                      📱 Instagram
                    </a>
                  )}
                  {item.YouTube && (
                    <a href={item.YouTube} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 text-sm block">
                      📺 YouTube
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section géolocalisation */}
        <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-blue-300 font-medium">Géolocalisation</h4>
            <button
              onClick={geocodeAddress}
              disabled={geolocating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              {geolocating ? '🔄 Recherche...' : '📍 Auto-géolocaliser'}
            </button>
          </div>
          
          {coordinates ? (
            <div className="text-green-300 text-sm">
              ✅ Coordonnées trouvées: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </div>
          ) : (
            <div className="text-orange-300 text-sm">
              ⚠️ Pas de coordonnées - Cliquez sur "Auto-géolocaliser" ou approuvez sans coordonnées
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <CheckCircle size={16} />
            Approuver
            {coordinates && ' avec géoloc'}
          </button>
          <button
            onClick={() => setShowRejectForm(!showRejectForm)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <XCircle size={16} />
            Rejeter
          </button>
        </div>

        {/* Formulaire de rejet */}
        {showRejectForm && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-400/20 rounded-lg">
            <label className="block text-red-300 text-sm font-medium mb-2">
              Raison du rejet :
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none"
              rows={3}
              placeholder="Expliquez pourquoi ce lieu de culte est rejeté..."
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Confirmer le rejet
              </button>
              <button
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectionReason('');
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <Clock className="animate-spin mx-auto mb-4" size={32} />
          <p>Chargement du tableau de modération...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="text-purple-400" size={32} />
            <h1 className="text-3xl font-bold text-white">Modération Culteo</h1>
          </div>
          <p className="text-white/70">
            Gérez les témoignages, demandes de prière et lieux de culte soumis par la communauté
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500/20 p-3 rounded-full">
                <Clock className="text-yellow-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Témoignages en attente</h3>
                <p className="text-2xl font-bold text-yellow-400">{pendingTestimonies.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-3 rounded-full">
                <Clock className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Prières en attente</h3>
                <p className="text-2xl font-bold text-blue-400">{pendingPrayers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500/20 p-3 rounded-full">
                <Church className="text-orange-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Lieux de culte en attente</h3>
                <p className="text-2xl font-bold text-orange-400">{pendingChurches.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('testimonies')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'testimonies'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Témoignages ({pendingTestimonies.length})
          </button>
          <button
            onClick={() => setActiveTab('prayers')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'prayers'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Demandes de prière ({pendingPrayers.length})
          </button>
          <button
            onClick={() => setActiveTab('churches')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'churches'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Lieux de culte ({pendingChurches.length})
          </button>
        </div>

        {/* Contenu */}
        <div className="space-y-6">
          {activeTab === 'testimonies' && (
            pendingTestimonies.length > 0 ? (
              pendingTestimonies.map((testimony) => (
                <ModerationCard
                  key={testimony.id}
                  type="testimony"
                  item={testimony}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Aucun témoignage en attente
                </h3>
                <p className="text-white/70">
                  Tous les témoignages ont été modérés !
                </p>
              </div>
            )
          )}

          {activeTab === 'prayers' && (
            pendingPrayers.length > 0 ? (
              pendingPrayers.map((prayer) => (
                <ModerationCard
                  key={prayer.id}
                  type="prayer"
                  item={prayer}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Aucune demande de prière en attente
                </h3>
                <p className="text-white/70">
                  Toutes les demandes ont été modérées !
                </p>
              </div>
            )
          )}

          {activeTab === 'churches' && (
            pendingChurches.length > 0 ? (
              pendingChurches.map((church) => (
                <ChurchModerationCard
                  key={church.id}
                  item={church}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Aucun lieu de culte en attente
                </h3>
                <p className="text-white/70">
                  Tous les lieux de culte ont été modérés !
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ModerationDashboard; 
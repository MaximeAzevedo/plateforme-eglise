import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle, User, Calendar, MapPin } from 'lucide-react';
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

export const ModerationDashboard: React.FC = () => {
  const [pendingTestimonies, setPendingTestimonies] = useState<TestimonyItem[]>([]);
  const [pendingPrayers, setPendingPrayers] = useState<PrayerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'testimonies' | 'prayers'>('testimonies');

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

      setPendingTestimonies(testimonies || []);
      setPendingPrayers(prayers || []);

      console.log('📈 État final - Témoignages:', testimonies?.length || 0);
      console.log('📈 État final - Prières:', prayers?.length || 0);
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
                {new Date(type === 'testimony' ? item.date_shared : (item as PrayerItem).date_requested).toLocaleDateString('fr-FR')}
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
            <h1 className="text-3xl font-bold text-white">Modération GOD × CONNECT</h1>
          </div>
          <p className="text-white/70">
            Gérez les témoignages et demandes de prière soumis par la communauté
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
        </div>

        {/* Contenu */}
        <div className="space-y-6">
          {activeTab === 'testimonies' ? (
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
          ) : (
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
        </div>
      </div>
    </div>
  );
}; 
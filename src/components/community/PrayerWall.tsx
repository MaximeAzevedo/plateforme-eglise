import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Users, Loader, AlertTriangle, Flag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ReportModal } from './ReportModal';

interface PrayerRequest {
  id: string;
  user_name: string;
  title: string;
  content: string;
  category: string;
  is_urgent: boolean;
  date_requested: string;
  prayer_count: number;
}

interface PrayerWallProps {
  supabase: any;
}

export const PrayerWall: React.FC<PrayerWallProps> = () => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [prayedRequests, setPrayedRequests] = useState<Set<string>>(new Set());
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    prayerId: string;
    prayerTitle: string;
  }>({
    isOpen: false,
    prayerId: '',
    prayerTitle: ''
  });

  useEffect(() => {
    loadPrayers();
  }, []);

  const loadPrayers = async () => {
    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des prières:', error);
      } else {
        setPrayers(data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrayer = async (prayerId: string) => {
    const userEmail = 'user@example.com'; // À remplacer par l'authentification réelle
    
    try {
      if (prayedRequests.has(prayerId)) {
        // Retirer la prière
        await supabase
          .from('user_interactions')
          .delete()
          .eq('user_email', userEmail)
          .eq('content_type', 'prayer')
          .eq('content_id', prayerId)
          .eq('interaction_type', 'prayer');

        setPrayedRequests(prev => {
          const newSet = new Set(prev);
          newSet.delete(prayerId);
          return newSet;
        });

        setPrayers(prev => prev.map(p => 
          p.id === prayerId 
            ? { ...p, prayer_count: Math.max(0, p.prayer_count - 1) }
            : p
        ));
      } else {
        // Ajouter la prière
        await supabase
          .from('user_interactions')
          .insert({
            user_email: userEmail,
            content_type: 'prayer',
            content_id: prayerId,
            interaction_type: 'prayer'
          });

        setPrayedRequests(prev => new Set([...prev, prayerId]));

        setPrayers(prev => prev.map(p => 
          p.id === prayerId 
            ? { ...p, prayer_count: p.prayer_count + 1 }
            : p
        ));
      }
    } catch (error) {
      console.error('Erreur lors de la prière:', error);
    }
  };

  const handleReport = (prayerId: string, prayerTitle: string) => {
    setReportModal({
      isOpen: true,
      prayerId,
      prayerTitle
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'bg-red-500/20 text-red-300',
      family: 'bg-blue-500/20 text-blue-300',
      work: 'bg-green-500/20 text-green-300',
      spiritual: 'bg-purple-500/20 text-purple-300',
      community: 'bg-yellow-500/20 text-yellow-300',
      general: 'bg-gray-500/20 text-gray-300'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      health: 'Santé',
      family: 'Famille',
      work: 'Travail',
      spiritual: 'Spiritualité',
      community: 'Communauté',
      general: 'Général'
    };
    return labels[category as keyof typeof labels] || 'Général';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin text-purple-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="text-purple-400" size={28} />
          <h2 className="text-2xl font-bold text-white">Mur de Prières</h2>
        </div>
        <p className="text-white/70">
          Unissons-nous dans la prière pour soutenir notre communauté
        </p>
      </div>

      {prayers.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto mb-4 text-purple-400/50" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">
            Aucune demande de prière pour le moment
          </h3>
          <p className="text-white/70">
            Soyez le premier à partager une demande de prière !
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {prayers.map((prayer) => (
            <div
              key={prayer.id}
              className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border transition-all duration-300 hover:border-purple-400/50 ${
                prayer.is_urgent 
                  ? 'border-red-400/50 shadow-red-400/20 shadow-lg' 
                  : 'border-white/20'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {prayer.title}
                  </h3>
                  
                  {prayer.is_urgent && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <AlertTriangle size={12} />
                      URGENT
                    </span>
                  )}
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(prayer.category)}`}>
                    {getCategoryLabel(prayer.category)}
                  </span>
                </div>

                <button
                  onClick={() => handleReport(prayer.id, prayer.title)}
                  className="text-white/40 hover:text-red-400 transition-colors p-1"
                  title="Signaler ce contenu"
                >
                  <Flag size={16} />
                </button>
              </div>

              <p className="text-white/90 mb-4 leading-relaxed">
                {prayer.content}
              </p>

              <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                <span className="font-medium">{prayer.user_name}</span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(prayer.date_requested).toLocaleDateString('fr-FR')}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => handlePrayer(prayer.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    prayedRequests.has(prayer.id)
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Heart
                    size={16}
                    className={prayedRequests.has(prayer.id) ? 'fill-current' : ''}
                  />
                  <span>
                    {prayedRequests.has(prayer.id) ? 'Prié' : 'Prier'} ({prayer.prayer_count})
                  </span>
                </button>

                <div className="flex items-center gap-2 text-white/50">
                  <Users size={16} />
                  <span className="text-sm">Soutenu par la communauté</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ isOpen: false, prayerId: '', prayerTitle: '' })}
        contentType="prayer"
        contentId={reportModal.prayerId}
        contentTitle={reportModal.prayerTitle}
      />
    </div>
  );
}; 
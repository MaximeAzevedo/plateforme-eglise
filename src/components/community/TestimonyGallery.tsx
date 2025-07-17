import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Calendar, Users, Loader, Flag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ReportModal } from './ReportModal';

interface Testimony {
  id: string;
  user_name: string;
  title: string;
  content: string;
  location?: string;
  date_shared: string;
  likes_count: number;
}

interface TestimonyGalleryProps {
  supabase: any;
}

export const TestimonyGallery: React.FC<TestimonyGalleryProps> = () => {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedTestimonies, setLikedTestimonies] = useState<Set<string>>(new Set());
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    testimonyId: string;
    testimonyTitle: string;
  }>({
    isOpen: false,
    testimonyId: '',
    testimonyTitle: ''
  });

  useEffect(() => {
    loadTestimonies();
  }, []);

  const loadTestimonies = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonies')
        .select('*')
        .eq('status', 'approved')
        .order('date_shared', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des témoignages:', error);
      } else {
        setTestimonies(data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (testimonyId: string) => {
    const userEmail = 'user@example.com'; // À remplacer par l'authentification réelle
    
    try {
      if (likedTestimonies.has(testimonyId)) {
        // Retirer le like
        await supabase
          .from('user_interactions')
          .delete()
          .eq('user_email', userEmail)
          .eq('content_type', 'testimony')
          .eq('content_id', testimonyId)
          .eq('interaction_type', 'like');

        setLikedTestimonies(prev => {
          const newSet = new Set(prev);
          newSet.delete(testimonyId);
          return newSet;
        });

        setTestimonies(prev => prev.map(t => 
          t.id === testimonyId 
            ? { ...t, likes_count: Math.max(0, t.likes_count - 1) }
            : t
        ));
      } else {
        // Ajouter le like
        await supabase
          .from('user_interactions')
          .insert({
            user_email: userEmail,
            content_type: 'testimony',
            content_id: testimonyId,
            interaction_type: 'like'
          });

        setLikedTestimonies(prev => new Set([...prev, testimonyId]));

        setTestimonies(prev => prev.map(t => 
          t.id === testimonyId 
            ? { ...t, likes_count: t.likes_count + 1 }
            : t
        ));
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  const handleReport = (testimonyId: string, testimonyTitle: string) => {
    setReportModal({
      isOpen: true,
      testimonyId,
      testimonyTitle
    });
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
          <Users className="text-purple-400" size={28} />
          <h2 className="text-2xl font-bold text-white">Témoignages de Foi</h2>
        </div>
        <p className="text-white/70">
          Découvrez les témoignages inspirants de notre communauté
        </p>
      </div>

      {testimonies.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto mb-4 text-purple-400/50" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">
            Aucun témoignage pour le moment
          </h3>
          <p className="text-white/70">
            Soyez le premier à partager votre témoignage !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonies.map((testimony) => (
            <div
              key={testimony.id}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                  {testimony.title}
                </h3>
                <button
                  onClick={() => handleReport(testimony.id, testimony.title)}
                  className="text-white/40 hover:text-red-400 transition-colors p-1"
                  title="Signaler ce contenu"
                >
                  <Flag size={16} />
                </button>
              </div>

              <p className="text-white/80 mb-4 line-clamp-3 leading-relaxed">
                {testimony.content}
              </p>

              <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                <span className="font-medium">{testimony.user_name}</span>
                <div className="flex items-center gap-3">
                  {testimony.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {testimony.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(testimony.date_shared).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => handleLike(testimony.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    likedTestimonies.has(testimony.id)
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Heart
                    size={16}
                    className={likedTestimonies.has(testimony.id) ? 'fill-current' : ''}
                  />
                  <span>{testimony.likes_count}</span>
                </button>

                <div className="flex items-center gap-2 text-white/50">
                  <Users size={16} />
                  <span className="text-sm">Communauté</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal({ isOpen: false, testimonyId: '', testimonyTitle: '' })}
        contentType="testimony"
        contentId={reportModal.testimonyId}
        contentTitle={reportModal.testimonyTitle}
      />
    </div>
  );
}; 
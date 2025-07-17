import React, { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'testimony' | 'prayer';
  contentId: string;
  contentTitle: string;
}

const REPORT_REASONS = [
  { value: 'inappropriate', label: 'Contenu inapproprié' },
  { value: 'spam', label: 'Spam ou publicité' },
  { value: 'harassment', label: 'Harcèlement ou intimidation' },
  { value: 'fake', label: 'Fausses informations' },
  { value: 'violence', label: 'Contenu violent' },
  { value: 'hate', label: 'Discours de haine' },
  { value: 'other', label: 'Autre' }
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  contentType,
  contentId,
  contentTitle
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;

    setIsSubmitting(true);

    try {
      // Ajouter à la file de modération
      const { error } = await supabase
        .from('moderation_queue')
        .insert({
          content_type: contentType,
          content_id: contentId,
          reported_by: 'anonymous', // À améliorer avec l'authentification
          report_reason: selectedReason,
          report_details: details,
          priority: selectedReason === 'hate' || selectedReason === 'violence' ? 'high' : 'normal'
        });

      if (!error) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setSubmitted(false);
          setSelectedReason('');
          setDetails('');
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-500/20 p-2 rounded-full">
                <AlertTriangle className="text-red-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Signaler un contenu</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-8">
              <div className="bg-green-500/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Send className="text-green-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Signalement envoyé
              </h3>
              <p className="text-white/70">
                Merci pour votre signalement. Notre équipe va examiner ce contenu.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <p className="text-white/70 text-sm mb-2">
                  Vous signalez :
                </p>
                <p className="text-white font-medium">"{contentTitle}"</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-3">
                  Pourquoi signalez-vous ce contenu ?
                </label>
                <div className="space-y-2">
                  {REPORT_REASONS.map((reason) => (
                    <label
                      key={reason.value}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason.value}
                        checked={selectedReason === reason.value}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="text-purple-500 focus:ring-purple-500"
                      />
                      <span className="text-white">{reason.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Détails supplémentaires (optionnel)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:border-purple-400 focus:outline-none resize-none"
                  rows={3}
                  placeholder="Donnez plus de détails sur ce signalement..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!selectedReason || isSubmitting}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Signaler
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}; 
import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Plus, 
  Filter,
  Clock,
  MapPin,
  Sparkles,
  Zap,
  Shield,
  Users,
  Crown,
  CheckCircle,
  AlertCircle,
  Send,
  Calendar,
  Eye,
  EyeOff,
  Globe,
  Lock,
  User,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { PrayerRequest, PrayerRequestCategory, PrayerSupport, TestimonyType } from '../types/community';
import FullscreenModal from './FullscreenModal';

interface PrayerWallProps {
  isOpen: boolean;
  onClose: () => void;
  supabase: any;
}

const PRAYER_CATEGORIES: { value: PrayerRequestCategory; label: string; icon: any; color: string }[] = [
  { value: 'healing', label: 'Guérison', icon: Sparkles, color: 'text-emerald-600 bg-emerald-100' },
  { value: 'family', label: 'Famille', icon: Heart, color: 'text-pink-600 bg-pink-100' },
  { value: 'work', label: 'Travail', icon: Users, color: 'text-blue-600 bg-blue-100' },
  { value: 'relationships', label: 'Relations', icon: Heart, color: 'text-purple-600 bg-purple-100' },
  { value: 'spiritual-growth', label: 'Croissance spirituelle', icon: Crown, color: 'text-yellow-600 bg-yellow-100' },
  { value: 'guidance', label: 'Direction', icon: Shield, color: 'text-indigo-600 bg-indigo-100' },
  { value: 'breakthrough', label: 'Percée', icon: Zap, color: 'text-orange-600 bg-orange-100' },
  { value: 'protection', label: 'Protection', icon: Shield, color: 'text-slate-600 bg-slate-100' },
  { value: 'provision', label: 'Provision', icon: Globe, color: 'text-green-600 bg-green-100' },
  { value: 'salvation', label: 'Salut', icon: Crown, color: 'text-red-600 bg-red-100' }
];

const PrayerWall: React.FC<PrayerWallProps> = ({ isOpen, onClose, supabase }) => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [showContributionHub, setShowContributionHub] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PrayerRequestCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'urgent' | 'most-prayed'>('recent');
  const [loading, setLoading] = useState(false);

  // Charger les demandes de prière depuis Supabase
  useEffect(() => {
    if (isOpen) {
      loadPrayers();
    }
  }, [isOpen, selectedCategory, sortBy]);

  const loadPrayers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('prayer_requests')
        .select('*')
        .eq('status', 'approved'); // AJOUT: Ne charger que les prières approuvées

      // Filtrer par catégorie si sélectionnée
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory); // Correction: utiliser 'category' au lieu de 'type'
      }

      // Tri
      switch (sortBy) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'urgent':
          query = query.order('is_urgent', { ascending: false }).order('created_at', { ascending: false }); // Correction: utiliser is_urgent
          break;
        case 'most-prayed':
          query = query.order('prayer_count', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors du chargement des prières:', error);
        return;
      }

      console.log('Demandes de prière approuvées chargées:', data);
      
      // Transformer les données Supabase en format attendu par le composant
      const transformedPrayers = (data || []).map(item => ({
        id: item.id,
        userId: item.user_name || 'Utilisateur',
        title: item.title,
        category: item.category || 'general',
        description: item.content || '', // content -> description
        isAnonymous: item.is_anonymous || false,
        isUrgent: item.is_urgent || false,
        isAnswered: false, // à implémenter plus tard
        prayerCount: item.prayer_count || 0,
        prayedByMe: false, // à implémenter avec authentification
        supportMessages: [], // à implémenter plus tard
        createdAt: new Date(item.created_at), // Convertir string en Date
        updatedAt: new Date(item.updated_at || item.created_at)
      }));
      
      setPrayers(transformedPrayers);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePray = (prayerId: string) => {
    setPrayers(prayers.map(prayer => 
      prayer.id === prayerId 
        ? { 
            ...prayer, 
            prayerCount: prayer.prayedByMe ? prayer.prayerCount - 1 : prayer.prayerCount + 1,
            prayedByMe: !prayer.prayedByMe 
          }
        : prayer
    ));
  };



  const filteredPrayers = prayers
    .filter(prayer => selectedCategory === 'all' || prayer.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'urgent':
          return (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0);
        case 'most-prayed':
          return b.prayerCount - a.prayerCount;
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  const getCategoryInfo = (category: PrayerRequestCategory) => {
    return PRAYER_CATEGORIES.find(cat => cat.value === category);
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  };

  if (!isOpen) return null;

  return (
    <FullscreenModal
      isOpen={isOpen}
      onClose={onClose}
      title="Mur de Prières"
      subtitle="Partageons nos fardeaux, célébrons ensemble"
      headerIcon={
        <div 
          className="w-10 h-10 rounded-culteo flex items-center justify-center"
          style={{background: 'linear-gradient(135deg, #0A6847, #FFC107)', borderRadius: '12px'}}
        >
          <Heart className="h-5 w-5 text-white" />
        </div>
      }
    >
      {/* Stats en haut */}
      <div 
        className="bg-culteo-blanc-coquille rounded-culteo p-4 mb-6"
        style={{backgroundColor: '#F9F9F9', borderRadius: '16px'}}
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-poppins font-bold text-culteo-gris-basalte text-lg" style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}>{prayers.length}</div>
            <div className="font-lato text-xs" style={{color: 'rgba(61, 61, 61, 0.7)', fontFamily: 'Lato, sans-serif'}}>Demandes</div>
          </div>
          <div>
            <div className="font-poppins font-bold text-culteo-gris-basalte text-lg" style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}>{prayers.reduce((sum, p) => sum + p.prayerCount, 0)}</div>
            <div className="font-lato text-xs" style={{color: 'rgba(61, 61, 61, 0.7)', fontFamily: 'Lato, sans-serif'}}>Prières</div>
          </div>
          <div>
            <div className="font-poppins font-bold text-culteo-gris-basalte text-lg" style={{color: '#3D3D3D', fontFamily: 'Poppins, sans-serif'}}>24</div>
            <div className="font-lato text-xs" style={{color: 'rgba(61, 61, 61, 0.7)', fontFamily: 'Lato, sans-serif'}}>Exaucées</div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtre mobile */}
      <div className="mb-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{color: 'rgba(61, 61, 61, 0.4)'}} />
            <input
              type="text"
              placeholder="Rechercher une prière..."
              className="w-full pl-10 pr-4 py-3 bg-culteo-blanc-coquille border border-culteo-vert-esperance/10 rounded-culteo-lg text-sm"
              style={{
                backgroundColor: '#F9F9F9',
                borderColor: 'rgba(10, 104, 71, 0.1)',
                borderRadius: '20px',
                fontFamily: 'Lato, sans-serif'
              }}
            />
          </div>
          <button
            onClick={() => setShowContributionHub(true)}
            className="p-3 bg-gradient-to-r from-culteo-vert-esperance to-culteo-jaune-lumiere text-white rounded-culteo-lg"
            style={{
              background: 'linear-gradient(135deg, #0A6847, #FFC107)',
              borderRadius: '20px'
            }}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Filtres par catégorie - Mobile horizontal scroll */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
            style={{
              backgroundColor: selectedCategory === 'all' ? '#0A6847' : '#F9F9F9',
              color: selectedCategory === 'all' ? 'white' : '#3D3D3D',
              fontFamily: 'Lato, sans-serif'
            }}
          >
            Toutes
          </button>
          {PRAYER_CATEGORIES.slice(0, 6).map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className="px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              style={{
                backgroundColor: selectedCategory === category.value ? '#0A6847' : '#F9F9F9',
                color: selectedCategory === category.value ? 'white' : '#3D3D3D',
                fontFamily: 'Lato, sans-serif'
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
        </div>

        {/* Liste des prières - ZONE SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-6 smooth-scroll custom-scrollbar optimize-scroll">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chargement des prières...</h3>
              <p className="text-gray-600">Veuillez patienter.</p>
            </div>
          ) : filteredPrayers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune demande de prière trouvée</h3>
              <p className="text-gray-600">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPrayers.map(prayer => {
                const categoryInfo = getCategoryInfo(prayer.category);
                
                return (
                  <div key={prayer.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    {/* Header de la prière */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1">
                        {categoryInfo && (
                          <div className={`p-2 rounded-xl ${categoryInfo.color}`}>
                            <categoryInfo.icon className="h-5 w-5" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {prayer.title}
                            </h3>
                            {prayer.isUrgent && (
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center space-x-1">
                                <AlertCircle className="h-3 w-3" />
                                <span>Urgent</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatTimeAgo(prayer.createdAt)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{prayer.userId}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Badge catégorie */}
                    {categoryInfo && (
                      <div className="mb-3">
                        <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color} text-white`}>
                          <categoryInfo.icon className="h-4 w-4" />
                          <span>{categoryInfo.label}</span>
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">{prayer.description}</p>

                    {/* Badges statut */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {prayer.isAnonymous && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center space-x-1">
                          <EyeOff className="h-3 w-3" />
                          <span>Anonyme</span>
                        </span>
                      )}
                      {prayer.isAnswered && (
                        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Exaucée</span>
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handlePray(prayer.id)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                            prayer.prayedByMe
                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${prayer.prayedByMe ? 'fill-current' : ''}`} />
                          <span>{prayer.prayerCount}</span>
                        </button>

                        <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <MessageCircle className="h-4 w-4" />
                          <span>Encourager</span>
                        </button>

                        <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                          <Share2 className="h-4 w-4" />
                          <span>Partager</span>
                        </button>
                      </div>
                    </div>

                    {/* Messages de soutien */}
                    {prayer.supportMessages && prayer.supportMessages.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="space-y-2">
                          {prayer.supportMessages.slice(0, 2).map(message => (
                            <div key={message.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                              <p className="text-sm text-gray-700">{message.message}</p>
                              <div className="mt-1 text-xs text-gray-500">
                                {message.isPraying && (
                                  <span className="inline-flex items-center space-x-1">
                                    <Heart className="h-3 w-3 text-purple-500" />
                                    <span>Prie pour cette demande</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      
      {/* ContributionHub pour les nouvelles demandes */}
      {showContributionHub && (
        <ContributionHub
          isOpen={showContributionHub}
          onClose={() => {
            setShowContributionHub(false);
            // Recharger les prières après fermeture pour afficher les nouvelles
            loadPrayers();
          }}
          supabase={supabase}
          defaultType="prayer"
        />
      )}
    </FullscreenModal>
  );
};

export default PrayerWall; 
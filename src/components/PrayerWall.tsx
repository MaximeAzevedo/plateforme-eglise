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
  X,
  Calendar,
  Eye,
  EyeOff,
  Globe,
  Lock
} from 'lucide-react';
import { PrayerRequest, PrayerRequestCategory, PrayerSupport, TestimonyType } from '../types/community';

interface PrayerWallProps {
  isOpen: boolean;
  onClose: () => void;
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

const PrayerWall: React.FC<PrayerWallProps> = ({ isOpen, onClose }) => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [showNewPrayerForm, setShowNewPrayerForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<PrayerRequestCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'urgent' | 'most-prayed'>('recent');
  const [newPrayer, setNewPrayer] = useState({
    title: '',
    category: 'spiritual-growth' as PrayerRequestCategory,
    description: '',
    isAnonymous: false,
    isUrgent: false
  });

  // Simuler des données de prière pour la démo
  useEffect(() => {
    if (isOpen) {
      const mockPrayers: PrayerRequest[] = [
        {
          id: '1',
          userId: 'user1',
          title: 'Prière pour ma famille',
          category: 'family',
          description: 'Ma famille traverse une période difficile. Merci de prier pour la réconciliation et la paix.',
          isAnonymous: false,
          isUrgent: true,
          prayerCount: 47,
          prayedByMe: false,
          supportMessages: [
            {
              id: '1',
              userId: 'user2',
              message: 'Je prie pour vous. Dieu est fidèle ! 🙏',
              isPraying: true,
              createdAt: new Date()
            }
          ],
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2h
          updatedAt: new Date()
        },
        {
          id: '2',
          userId: 'user3',
          title: 'Guérison pour mon père',
          category: 'healing',
          description: 'Mon père est hospitalisé. Prions ensemble pour sa guérison complète.',
          isAnonymous: false,
          isUrgent: true,
          prayerCount: 156,
          prayedByMe: true,
          supportMessages: [],
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Il y a 24h
          updatedAt: new Date()
        },
        {
          id: '3',
          userId: 'anonymous',
          title: 'Direction pour ma carrière',
          category: 'guidance',
          description: 'Je dois prendre une décision importante concernant mon avenir professionnel. Merci de prier pour la sagesse.',
          isAnonymous: true,
          isUrgent: false,
          prayerCount: 23,
          prayedByMe: false,
          supportMessages: [],
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // Il y a 6h
          updatedAt: new Date()
        }
      ];
      setPrayers(mockPrayers);
    }
  }, [isOpen]);

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

  const handleSubmitPrayer = () => {
    if (!newPrayer.title.trim() || !newPrayer.description.trim()) return;

    const prayer: PrayerRequest = {
      id: Date.now().toString(),
      userId: newPrayer.isAnonymous ? 'anonymous' : 'current-user',
      title: newPrayer.title,
      category: newPrayer.category,
      description: newPrayer.description,
      isAnonymous: newPrayer.isAnonymous,
      isUrgent: newPrayer.isUrgent,
      prayerCount: 0,
      prayedByMe: false,
      supportMessages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setPrayers([prayer, ...prayers]);
    setNewPrayer({
      title: '',
      category: 'spiritual-growth',
      description: '',
      isAnonymous: false,
      isUrgent: false
    });
    setShowNewPrayerForm(false);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header avec dégradé */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-heading">Mur de Prière</h2>
                <p className="text-white/90 font-body">Partageons nos fardeaux, célébrons ensemble</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Stats dynamiques */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{prayers.length}</div>
              <div className="text-sm text-white/80">Demandes actives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{prayers.reduce((sum, p) => sum + p.prayerCount, 0)}</div>
              <div className="text-sm text-white/80">Prières offertes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-white/80">Prières exaucées ce mois</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filtres par catégorie */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Toutes
              </button>
              {PRAYER_CATEGORIES.map(category => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2 ${
                    selectedCategory === category.value 
                      ? `${category.color} ring-2 ring-current ring-opacity-20` 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="recent">Plus récentes</option>
                <option value="urgent">Urgentes</option>
                <option value="most-prayed">Plus priées</option>
              </select>
              
              <button
                onClick={() => setShowNewPrayerForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium flex items-center space-x-2 hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Nouvelle demande</span>
              </button>
            </div>
          </div>
        </div>

        {/* Liste des prières */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredPrayers.map(prayer => {
            const categoryInfo = getCategoryInfo(prayer.category);
            
            return (
              <div key={prayer.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
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
                        {prayer.isAnonymous && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex items-center space-x-1">
                            <EyeOff className="h-3 w-3" />
                            <span>Anonyme</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimeAgo(prayer.createdAt)}</span>
                        </span>
                        {categoryInfo && (
                          <span className="flex items-center space-x-1">
                            <span>{categoryInfo.label}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4 leading-relaxed">{prayer.description}</p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handlePray(prayer.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 ${
                        prayer.prayedByMe
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${prayer.prayedByMe ? 'fill-current' : ''}`} />
                      <span>{prayer.prayedByMe ? 'Je prie' : 'Prier'}</span>
                      <span className="bg-white/80 px-2 py-0.5 rounded-full text-xs">
                        {prayer.prayerCount}
                      </span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <MessageCircle className="h-4 w-4" />
                      <span>Encourager</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                      <Share2 className="h-4 w-4" />
                      <span>Partager</span>
                    </button>
                  </div>

                  {prayer.isAnswered && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      <span>Prière exaucée</span>
                    </div>
                  )}
                </div>

                {/* Messages de soutien */}
                {prayer.supportMessages.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                      {prayer.supportMessages.slice(0, 2).map(message => (
                        <div key={message.id} className="bg-gray-50 rounded-lg p-3">
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

        {/* Formulaire nouvelle demande */}
        {showNewPrayerForm && (
          <div className="absolute inset-0 bg-white z-10 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Nouvelle demande de prière</h3>
                <button 
                  onClick={() => setShowNewPrayerForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de votre demande *
                  </label>
                  <input
                    type="text"
                    value={newPrayer.title}
                    onChange={(e) => setNewPrayer({ ...newPrayer, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Prière pour ma famille, Guérison de mon père..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PRAYER_CATEGORIES.map(category => (
                      <button
                        key={category.value}
                        onClick={() => setNewPrayer({ ...newPrayer, category: category.value })}
                        className={`p-3 rounded-lg text-left transition-all ${
                          newPrayer.category === category.value
                            ? `${category.color} ring-2 ring-current ring-opacity-20`
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <category.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{category.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Décrivez votre demande *
                  </label>
                  <textarea
                    value={newPrayer.description}
                    onChange={(e) => setNewPrayer({ ...newPrayer, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Partagez votre situation avec bienveillance. La communauté sera là pour vous soutenir..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={newPrayer.isUrgent}
                      onChange={(e) => setNewPrayer({ ...newPrayer, isUrgent: e.target.checked })}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">
                      Demande urgente (sera mise en avant)
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={newPrayer.isAnonymous}
                      onChange={(e) => setNewPrayer({ ...newPrayer, isAnonymous: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      Publier anonymement
                    </span>
                  </label>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowNewPrayerForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmitPrayer}
                    disabled={!newPrayer.title.trim() || !newPrayer.description.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Publier ma demande</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerWall; 
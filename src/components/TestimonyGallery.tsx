import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  Star, 
  Sparkles, 
  Zap, 
  Crown, 
  Shield, 
  Plus,
  X,
  Calendar,
  MapPin,
  User,
  Verified,
  Flame,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  TrendingUp,
  Award
} from 'lucide-react';
import { Testimony, TestimonyType, TestimonyComment } from '../types/community';

interface TestimonyGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

const TESTIMONY_TYPES: { value: TestimonyType; label: string; icon: any; color: string; description: string }[] = [
  { 
    value: 'healing', 
    label: 'Guérison', 
    icon: Sparkles, 
    color: 'from-emerald-500 to-teal-600',
    description: 'Guérisons physiques, émotionnelles et spirituelles'
  },
  { 
    value: 'breakthrough', 
    label: 'Percée', 
    icon: Zap, 
    color: 'from-orange-500 to-red-600',
    description: 'Moments de victoire et de percée spirituelle'
  },
  { 
    value: 'salvation', 
    label: 'Salut', 
    icon: Crown, 
    color: 'from-purple-500 to-indigo-600',
    description: 'Témoignages de conversion et nouveau départ'
  },
  { 
    value: 'provision', 
    label: 'Provision', 
    icon: Star, 
    color: 'from-blue-500 to-cyan-600',
    description: 'Dieu pourvoit aux besoins matériels et spirituels'
  },
  { 
    value: 'restoration', 
    label: 'Restauration', 
    icon: Heart, 
    color: 'from-pink-500 to-rose-600',
    description: 'Relations restaurées, cœurs guéris'
  },
  { 
    value: 'miracle', 
    label: 'Miracle', 
    icon: Crown, 
    color: 'from-yellow-500 to-amber-600',
    description: 'Interventions surnaturelles de Dieu'
  },
  { 
    value: 'transformation', 
    label: 'Transformation', 
    icon: Flame, 
    color: 'from-violet-500 to-purple-600',
    description: 'Vies complètement transformées par l\'Évangile'
  },
  { 
    value: 'calling', 
    label: 'Appel', 
    icon: Shield, 
    color: 'from-slate-500 to-gray-600',
    description: 'Découverte et accomplissement de l\'appel divin'
  }
];

const TestimonyGallery: React.FC<TestimonyGalleryProps> = ({ isOpen, onClose }) => {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [selectedTestimony, setSelectedTestimony] = useState<Testimony | null>(null);
  const [selectedType, setSelectedType] = useState<TestimonyType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTestimonyForm, setShowNewTestimonyForm] = useState(false);

  // Simuler des données de témoignages pour la démo
  useEffect(() => {
    if (isOpen) {
      const mockTestimonies: Testimony[] = [
        {
          id: '1',
          userId: 'user1',
          title: 'Guérison miraculeuse de ma fille',
          type: 'healing',
          description: 'Ma fille de 8 ans était dans le coma après un accident. Après 3 semaines de prières intensives de toute notre communauté, elle s\'est réveillée sans séquelles. Les médecins parlent de miracle médical.',
          beforeSituation: 'Ma fille était dans le coma, les médecins avaient perdu espoir',
          afterSituation: 'Elle est complètement rétablie, plus joyeuse que jamais',
          timeframe: '3 semaines',
          isAnonymous: false,
          likes: 234,
          shares: 67,
          comments: [],
          tags: ['famille', 'enfant', 'hôpital', 'miracle'],
          denomination: 'Catholic',
          location: 'Metz, France',
          isVerified: true,
          verifiedBy: 'Père Michel - Paroisse Saint-Pierre',
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
          updatedAt: new Date()
        },
        {
          id: '2',
          userId: 'user2',
          title: 'De la dépression à la joie parfaite',
          type: 'transformation',
          description: 'Après 2 ans de dépression sévère, j\'ai découvert l\'amour inconditionnel de Dieu lors d\'une retraite spirituelle. Ma vie a basculé cette nuit-là.',
          beforeSituation: 'Dépression, pensées suicidaires, isolement total',
          afterSituation: 'Joie profonde, service aux autres, nouvelle famille spirituelle',
          timeframe: '6 mois',
          isAnonymous: false,
          likes: 189,
          shares: 43,
          comments: [],
          tags: ['dépression', 'guérison', 'retraite', 'communauté'],
          denomination: 'Evangelical',
          location: 'Nancy, France',
          isVerified: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        },
        {
          id: '3',
          userId: 'user3',
          title: 'Provision miraculeuse pour notre famille',
          type: 'provision',
          description: 'Mon mari avait perdu son emploi et nous étions au bord de l\'expulsion. Le jour même où nous devions partir, il a reçu un appel pour un poste encore mieux payé.',
          beforeSituation: 'Chômage, dettes, menace d\'expulsion',
          afterSituation: 'Emploi stable, finances restaurées, famille apaisée',
          timeframe: '2 mois',
          isAnonymous: false,
          likes: 156,
          shares: 89,
          comments: [],
          tags: ['travail', 'provision', 'famille', 'finances'],
          denomination: 'Protestant',
          location: 'Strasbourg, France',
          isVerified: false,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        }
      ];
      setTestimonies(mockTestimonies);
    }
  }, [isOpen]);

  const handleLike = (testimonyId: string) => {
    setTestimonies(testimonies.map(testimony => 
      testimony.id === testimonyId 
        ? { ...testimony, likes: testimony.likes + 1 }
        : testimony
    ));
  };

  const handleShare = (testimony: Testimony) => {
    if (navigator.share) {
      navigator.share({
        title: testimony.title,
        text: testimony.description,
        url: window.location.href
      });
    }
  };

  const filteredTestimonies = testimonies
    .filter(testimony => {
      const matchesType = selectedType === 'all' || testimony.type === selectedType;
      const matchesSearch = searchQuery === '' || 
        testimony.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        testimony.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        testimony.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.likes + b.shares) - (a.likes + a.shares);
        case 'trending':
          const aScore = (b.likes + b.shares * 2) / Math.max(1, (Date.now() - a.createdAt.getTime()) / (1000 * 60 * 60 * 24));
          const bScore = (b.likes + b.shares * 2) / Math.max(1, (Date.now() - b.createdAt.getTime()) / (1000 * 60 * 60 * 24));
          return bScore - aScore;
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  const getTypeInfo = (type: TestimonyType) => {
    return TESTIMONY_TYPES.find(t => t.value === type);
  };

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 1) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    const months = Math.floor(days / 30);
    return `Il y a ${months} mois`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header avec dégradé inspirant */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-heading">Témoignages Inspirants</h2>
                <p className="text-white/90 font-body">Découvrez les merveilles de Dieu dans nos vies</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Stats inspirantes */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{testimonies.length}</div>
              <div className="text-sm text-white/80">Témoignages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{testimonies.reduce((sum, t) => sum + t.likes, 0)}</div>
              <div className="text-sm text-white/80">Cœurs touchés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{testimonies.filter(t => t.isVerified).length}</div>
              <div className="text-sm text-white/80">Vérifiés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-white/80">Types de miracles</div>
            </div>
          </div>
        </div>

        {/* Toolbar de recherche et filtres */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des témoignages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Contrôles */}
            <div className="flex items-center space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="trending">Tendances</option>
                <option value="recent">Plus récents</option>
                <option value="popular">Plus populaires</option>
              </select>
              
              <button
                onClick={() => setShowNewTestimonyForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium flex items-center space-x-2 hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Partager mon témoignage</span>
              </button>
            </div>
          </div>

          {/* Filtres par type */}
          <div className="mt-4 flex items-center space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedType === 'all' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tous les témoignages
            </button>
            {TESTIMONY_TYPES.map(type => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${
                  selectedType === type.value 
                    ? `bg-gradient-to-r ${type.color} text-white ring-2 ring-white ring-opacity-50` 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <type.icon className="h-4 w-4" />
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grille des témoignages */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTestimonies.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun témoignage trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos filtres ou votre recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTestimonies.map(testimony => {
                const typeInfo = getTypeInfo(testimony.type);
                
                return (
                  <div 
                    key={testimony.id} 
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => setSelectedTestimony(testimony)}
                  >
                    {/* Header du témoignage */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1">
                        {typeInfo && (
                          <div className={`p-2 rounded-xl bg-gradient-to-r ${typeInfo.color} text-white`}>
                            <typeInfo.icon className="h-5 w-5" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {testimony.title}
                            </h3>
                            {testimony.isVerified && (
                              <div className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                <Verified className="h-3 w-3" />
                                <span>Vérifié</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatTimeAgo(testimony.createdAt)}</span>
                            </span>
                            {testimony.location && (
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{testimony.location}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Badge type */}
                    {typeInfo && (
                      <div className="mb-3">
                        <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${typeInfo.color} text-white`}>
                          <typeInfo.icon className="h-4 w-4" />
                          <span>{typeInfo.label}</span>
                        </span>
                      </div>
                    )}

                    {/* Description tronquée */}
                    <p className="text-gray-700 mb-4 leading-relaxed line-clamp-3">
                      {testimony.description}
                    </p>

                    {/* Timeline de transformation */}
                    <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg p-4 mb-4">
                      <div className="text-xs font-semibold text-orange-600 mb-2">
                        TRANSFORMATION EN {testimony.timeframe.toUpperCase()}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-red-600 font-medium mb-1">Avant :</div>
                          <div className="text-gray-700 line-clamp-2">{testimony.beforeSituation}</div>
                        </div>
                        <div>
                          <div className="text-green-600 font-medium mb-1">Après :</div>
                          <div className="text-gray-700 line-clamp-2">{testimony.afterSituation}</div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {testimony.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {testimony.tags.slice(0, 3).map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {testimony.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{testimony.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(testimony.id);
                          }}
                          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Heart className="h-4 w-4" />
                          <span>{testimony.likes}</span>
                        </button>

                        <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <MessageCircle className="h-4 w-4" />
                          <span>{testimony.comments.length}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(testimony);
                          }}
                          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        >
                          <Share2 className="h-4 w-4" />
                          <span>{testimony.shares}</span>
                        </button>
                      </div>

                      {testimony.denomination && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {testimony.denomination}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal de témoignage détaillé */}
        {selectedTestimony && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{selectedTestimony.title}</h3>
                  <button 
                    onClick={() => setSelectedTestimony(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Contenu détaillé du témoignage ici */}
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">{selectedTestimony.description}</p>
                  
                  {/* Timeline détaillée */}
                  <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-lg p-6">
                    <h4 className="font-semibold text-orange-600 mb-4">Transformation en {selectedTestimony.timeframe}</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="text-red-600 font-medium mb-2">Situation initiale :</div>
                        <div className="text-gray-700">{selectedTestimony.beforeSituation}</div>
                      </div>
                      <div className="border-l-4 border-orange-300 pl-4">
                        <div className="text-orange-600 font-medium mb-2">Après {selectedTestimony.timeframe} :</div>
                        <div className="text-gray-700">{selectedTestimony.afterSituation}</div>
                      </div>
                    </div>
                  </div>

                  {/* Vérification */}
                  {selectedTestimony.isVerified && selectedTestimony.verifiedBy && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-blue-700">
                        <Verified className="h-5 w-5" />
                        <span className="font-medium">Témoignage vérifié</span>
                      </div>
                      <p className="text-blue-600 text-sm mt-1">{selectedTestimony.verifiedBy}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonyGallery; 
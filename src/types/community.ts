// ==========================================
// TYPES POUR ECOSYSTEM SPIRITUEL COMMUNAUTAIRE
// "Connecting Souls to God through Community"
// ==========================================

export type SpiritualJourneyStage = 
  | 'seeking' // 🔍 En quête
  | 'exploring' // 🌱 Explorant
  | 'growing' // 🌿 Grandissant
  | 'committed' // 💒 Engagé
  | 'serving' // 🤝 Servant
  | 'mentoring'; // 🌟 Accompagnant

export type CommunityEventType = 
  | 'prayer-group' // 🙏 Groupe de prière
  | 'bible-study' // 📖 Étude biblique
  | 'youth-gathering' // 👥 Rassemblement jeunes
  | 'worship-night' // 🎵 Soirée louange
  | 'community-service' // 🤝 Service communautaire
  | 'testimony-night' // 💬 Soirée témoignages
  | 'healing-prayer' // ✨ Prière de guérison
  | 'couple-ministry' // 💑 Ministère couples
  | 'family-event' // 👨‍👩‍👧‍👦 Événement familial
  | 'evangelization' // 📢 Évangélisation
  | 'retreat' // 🏕️ Retraite
  | 'discipleship' // 📚 Formation de disciples
  | 'worship-training' // 🎼 Formation louange
  | 'prophetic-ministry' // 🔮 Ministère prophétique
  | 'intercessory-prayer'; // 🕊️ Prière d'intercession

export type MentorshipType = 
  | 'spiritual-guide' // 🌟 Guide spirituel
  | 'prayer-partner' // 🤝 Partenaire de prière
  | 'bible-study-mentor' // 📖 Mentor étude biblique
  | 'life-coach' // 💪 Coach de vie
  | 'worship-mentor' // 🎵 Mentor louange
  | 'youth-leader'; // 👥 Leader jeunes

export type PrayerRequestCategory = 
  | 'healing' // 🙏 Guérison
  | 'family' // 👨‍👩‍👧‍👦 Famille
  | 'work' // 💼 Travail
  | 'relationships' // 💕 Relations
  | 'spiritual-growth' // 🌱 Croissance spirituelle
  | 'guidance' // 🧭 Direction
  | 'breakthrough' // ⚡ Percée
  | 'protection' // 🛡️ Protection
  | 'provision' // 💰 Provision
  | 'salvation'; // ✝️ Salut

export type TestimonyType = 
  | 'healing' // ✨ Guérison
  | 'breakthrough' // ⚡ Percée
  | 'salvation' // ✝️ Salut
  | 'deliverance' // 🕊️ Délivrance
  | 'restoration' // 🔄 Restauration
  | 'provision' // 💰 Provision
  | 'guidance' // 🧭 Direction divine
  | 'miracle' // 🌟 Miracle
  | 'transformation' // 🦋 Transformation
  | 'calling'; // 📞 Appel

// ==========================================
// INTERFACES COMMUNAUTAIRES AVANCÉES
// ==========================================

export interface SpiritualProfile {
  id: string;
  userId: string;
  journeyStage: SpiritualJourneyStage;
  denomination: string[];
  interests: CommunityEventType[];
  giftings: string[]; // Dons spirituels
  availability: {
    weekdays: boolean;
    weekends: boolean;
    evenings: boolean;
  };
  mentorshipOffering: MentorshipType[];
  mentorshipSeeking: MentorshipType[];
  location: {
    city: string;
    radius: number; // Rayon de déplacement
  };
  bio: string;
  verifiedBy?: string; // Vérifié par un leader
  joinedAt: Date;
}

export interface CommunityEvent {
  id: string;
  title: string;
  type: CommunityEventType;
  description: string;
  organizer: {
    id: string;
    name: string;
    role: string;
    church: string;
  };
  location: {
    placeId: string; // Référence vers WorshipPlace
    address: string;
    online?: boolean;
    hybrid?: boolean;
  };
  schedule: {
    startDate: Date;
    endDate: Date;
    recurring?: {
      frequency: 'weekly' | 'monthly' | 'biweekly';
      daysOfWeek: number[];
    };
  };
  maxParticipants?: number;
  currentParticipants: number;
  ageRange?: {
    min: number;
    max: number;
  };
  requirements?: string[];
  language: string;
  denomination?: string[];
  tags: string[];
  isVerified: boolean;
  registrationRequired: boolean;
  cost?: number;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PrayerRequest {
  id: string;
  userId: string;
  title: string;
  category: PrayerRequestCategory;
  description: string;
  isAnonymous: boolean;
  isUrgent: boolean;
  prayerCount: number;
  prayedByMe?: boolean;
  supportMessages: PrayerSupport[];
  expiresAt?: Date;
  isAnswered?: boolean;
  testimonyId?: string; // Lien vers témoignage si prière exaucée
  createdAt: Date;
  updatedAt: Date;
}

export interface PrayerSupport {
  id: string;
  userId: string;
  message: string;
  isPraying: boolean;
  createdAt: Date;
}

export interface Testimony {
  id: string;
  userId: string;
  title: string;
  type: TestimonyType;
  description: string;
  beforeSituation: string;
  afterSituation: string;
  timeframe: string; // Ex: "2 semaines", "6 mois"
  isAnonymous: boolean;
  likes: number;
  shares: number;
  comments: TestimonyComment[];
  tags: string[];
  denomination?: string;
  location?: string;
  isVerified: boolean;
  verifiedBy?: string;
  linkedPrayerRequest?: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TestimonyComment {
  id: string;
  userId: string;
  message: string;
  likes: number;
  createdAt: Date;
}

export interface MentorshipMatch {
  id: string;
  mentorId: string;
  menteeId: string;
  type: MentorshipType;
  status: 'pending' | 'active' | 'completed' | 'paused';
  startDate: Date;
  endDate?: Date;
  meetingFrequency: 'weekly' | 'biweekly' | 'monthly';
  format: 'in-person' | 'video' | 'phone' | 'hybrid';
  goals: string[];
  progress: {
    sessionsCompleted: number;
    lastMeeting: Date;
    nextMeeting?: Date;
  };
  feedback: {
    mentorRating?: number;
    menteeRating?: number;
    mentorFeedback?: string;
    menteeFeedback?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  type: CommunityEventType;
  leaderId: string;
  moderators: string[];
  members: string[];
  maxMembers?: number;
  denomination?: string[];
  location: {
    city: string;
    radius: number;
    onlineOnly?: boolean;
  };
  meetingSchedule: {
    frequency: 'weekly' | 'biweekly' | 'monthly';
    dayOfWeek: number;
    time: string;
    duration: number; // minutes
  };
  requirements?: string[];
  ageRange?: {
    min: number;
    max: number;
  };
  isPrivate: boolean;
  requiresApproval: boolean;
  tags: string[];
  banner?: string;
  resources: GroupResource[];
  announcements: GroupAnnouncement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupResource {
  id: string;
  title: string;
  type: 'document' | 'link' | 'video' | 'audio';
  url: string;
  description?: string;
  addedBy: string;
  addedAt: Date;
}

export interface GroupAnnouncement {
  id: string;
  title: string;
  message: string;
  isUrgent: boolean;
  authorId: string;
  targetMembers?: string[]; // Si vide, pour tous
  createdAt: Date;
  expiresAt?: Date;
}

// ==========================================
// SYSTÈME DE NOTIFICATIONS SPIRITUELLES
// ==========================================

export type NotificationType = 
  | 'prayer-request' // 🙏 Nouvelle demande de prière
  | 'prayer-answered' // ✨ Prière exaucée
  | 'event-invitation' // 📅 Invitation événement
  | 'mentorship-match' // 🤝 Nouveau mentorat
  | 'testimony-shared' // 💬 Nouveau témoignage
  | 'group-invitation' // 👥 Invitation groupe
  | 'celebration-reminder' // ⛪ Rappel célébration
  | 'community-milestone' // 🎉 Étape communautaire
  | 'spiritual-encouragement'; // 💪 Encouragement spirituel

export interface SpiritualNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  isUrgent: boolean;
  relatedId?: string; // ID de l'objet associé
  createdAt: Date;
}

// ==========================================
// GAMIFICATION SPIRITUELLE
// ==========================================

export type SpiritualBadge = 
  | 'prayer-warrior' // 🗡️ Guerrier de prière
  | 'faithful-attendee' // ✅ Fidèle participant
  | 'community-builder' // 🏗️ Bâtisseur communauté
  | 'testimony-sharer' // 💬 Partageur témoignages
  | 'mentor-heart' // ❤️ Cœur de mentor
  | 'worship-leader' // 🎵 Leader louange
  | 'evangelism-champion' // 📢 Champion évangélisation
  | 'servant-heart' // 🤝 Cœur de serviteur
  | 'scripture-lover' // 📖 Amoureux des Écritures
  | 'hope-bringer'; // 🌟 Porteur d'espoir

export interface SpiritualAchievement {
  id: string;
  userId: string;
  badge: SpiritualBadge;
  earnedAt: Date;
  description: string;
  progress: {
    current: number;
    target: number;
    unit: string;
  };
}

// ==========================================
// SYSTÈME DE RECOMMANDATIONS IA
// ==========================================

export interface SpiritualRecommendation {
  id: string;
  userId: string;
  type: 'event' | 'group' | 'mentor' | 'church' | 'prayer-partner';
  itemId: string;
  score: number; // 0-100
  reasons: string[];
  category: string;
  priority: 'low' | 'medium' | 'high';
  isViewed: boolean;
  isActioned: boolean;
  createdAt: Date;
  expiresAt: Date;
} 
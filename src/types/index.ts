// Dénominations enrichies pour couvrir l'œcuménisme
export type Denomination = 
  | 'Catholic' 
  | 'Protestant' 
  | 'Orthodox' 
  | 'Evangelical' 
  | 'Pentecostal'
  | 'Baptist'
  | 'Neo-Apostolic'
  | 'Other';

// Types d'événements étendus pour correspondre aux données réelles
export type CelebrationType = 
  // Types principaux de la base de données
  | 'Adoration'
  | 'Bible study'
  | 'Catéchisme'
  | 'Célébration'
  | 'Célébration en semaine'
  | 'Confession'
  | 'Culte'
  | 'Culte de louange'
  | 'Culte principal'
  | 'École du dimanche'
  | 'Évangélisation'
  | 'Groupe de prière'
  | 'Jeûne et prière'
  | 'Jeunes adultes'
  | 'Liturgie divine'
  | 'Messe'
  | 'Messe/Culte principal'
  | 'Partage spirituel'
  | 'Prière'
  | 'Prière de guérison'
  | 'Prière du matin'
  | 'Prière du soir'
  | 'Service communautaire'
  | 'Service divin'
  | 'Service pour les jeunes'
  | 'Silence et méditation'
  | 'Vêpres'
  
  // Types legacy pour compatibilité
  | 'Messe en semaine'
  | 'Jeûne'
  | 'Laudes'
  | 'Groupe de jeunes'
  | 'Prière du chapelet'
  | 'Retraite spirituelle'
  | 'Baptême'
  | 'Mariage'
  | 'Concert chrétien'
  | 'Conférence'
  | 'Autre';

export type WeekDay = 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi' | 'Dimanche';

// Nouveaux types pour les filtres de créneaux horaires
export type TimeSlot = 
  | 'morning'    // 6h-12h
  | 'afternoon'  // 12h-18h
  | 'evening';   // 18h-22h

// Nouveaux types pour les filtres temporels
export type DateFilter = 
  | 'today'
  | 'weekend'
  | 'week'
  | 'custom';

// Nouveaux types pour les filtres géographiques
export type LocationRadius = 1 | 5 | 10 | 25 | 50;

export interface TimeFilter {
  days?: WeekDay[];
  timeSlots?: TimeSlot[];
  specificTimes?: string[]; // Format "HH:MM"
}

export interface DateTimeFilter {
  dateFilter?: DateFilter;
  customDate?: string; // Format ISO date
  timeFilter?: TimeFilter;
}

export interface LocationFilter {
  city?: string;
  radius?: LocationRadius;
  useCurrentLocation?: boolean;
  centerPoint?: [number, number]; // [lat, lng]
}

export interface EventFilter {
  types?: CelebrationType[];
  timeFilter?: TimeFilter;
  dateTimeFilter?: DateTimeFilter;
  locationFilter?: LocationFilter;
}

export interface Schedule {
  type: CelebrationType;
  day: WeekDay;
  startTime: string;
  endTime: string;
}

export interface OpeningHours {
  days: WeekDay[];
  startTime: string;
  endTime: string;
}

export interface WorshipPlace {
  id: string;
  name: string;
  denomination: Denomination;
  address: string;
  postalCode: string;
  city: string;
  serviceTimes: string;
  contactInfo: string;
  website?: string;
  position: [number, number];
}

export type EventType = 
  | 'Célébration principale'
  | 'Célébration en semaine'
  | 'Prière du matin'
  | 'Prière du soir'
  | 'Confession'
  | 'Adoration'
  | 'Catéchisme'
  | 'Groupe de prière'
  | 'Bible study'
  | 'Évangélisation'
  | 'Service communautaire'
  | 'Autre';
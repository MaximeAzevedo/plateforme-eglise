import { WorshipPlace, CelebrationType, WeekDay, TimeSlot, EventFilter, Denomination, DateFilter, LocationRadius } from '../types';
import { parseScheduleString } from './scheduleParser';

// Mapping des créneaux horaires
export const timeSlotRanges: Record<TimeSlot, [number, number]> = {
  morning: [6, 12],
  afternoon: [12, 18],
  evening: [18, 22]
};

export const timeSlotLabels: Record<TimeSlot, string> = {
  morning: 'Matin (6h-12h)',
  afternoon: 'Après-midi (12h-18h)',
  evening: 'Soir (18h-22h)'
};

// Labels enrichis pour les dénominations
export const denominationLabels: Record<Denomination, string> = {
  'Catholic': 'Catholique',
  'Protestant': 'Protestant',
  'Orthodox': 'Orthodoxe',
  'Evangelical': 'Évangélique',
  'Pentecostal': 'Pentecôtiste',
  'Baptist': 'Baptiste',
  'Neo-Apostolic': 'Néo-apostolique',
  'Other': 'Autre'
};

// Labels enrichis pour les types de célébrations
export const celebrationTypeLabels: Record<CelebrationType, string> = {
  // Nouveaux types principaux
  'Célébration': 'Célébration',
  'Prière': 'Prière',
  'Confession': 'Confession',
  'Adoration': 'Adoration eucharistique',
  'Catéchisme': 'Catéchisme',
  'Groupe de prière': 'Groupe de prière',
  'Évangélisation': 'Évangélisation',
  'Service communautaire': 'Service communautaire',
  'Autre': 'Autre',
  // Types existants pour compatibilité
  'Messe en semaine': 'Célébration en semaine',
  'Jeûne': 'Jeûne/Retraite spirituelle',
  'Vêpres': 'Vêpres',
  'Laudes': 'Laudes',
  'Groupe de jeunes': 'Groupe de jeunes',
  'Prière du chapelet': 'Prière du chapelet',
  'Retraite spirituelle': 'Retraite spirituelle',
  'Baptême': 'Baptême',
  'Mariage': 'Mariage',
  'Concert chrétien': 'Concert chrétien',
  'Conférence': 'Conférence'
};

export const weekDayLabels: Record<WeekDay, string> = {
  'Lundi': 'Lundi',
  'Mardi': 'Mardi',
  'Mercredi': 'Mercredi',
  'Jeudi': 'Jeudi',
  'Vendredi': 'Vendredi',
  'Samedi': 'Samedi',
  'Dimanche': 'Dimanche'
};

// Labels pour les filtres temporels
export const dateFilterLabels: Record<DateFilter, string> = {
  'today': 'Aujourd\'hui',
  'weekend': 'Ce week-end',
  'week': 'Cette semaine',
  'custom': 'Date personnalisée'
};

// Labels pour les rayons de localisation
export const locationRadiusLabels: Record<LocationRadius, string> = {
  1: '1 km',
  5: '5 km',
  10: '10 km',
  25: '25 km',
  50: '50 km'
};

/**
 * Convertit une heure au format "HH:MM" en nombre d'heures
 */
function timeToHours(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + (minutes / 60);
}

/**
 * Vérifie si une heure appartient à un créneau horaire
 */
function isTimeInSlot(time: string, slot: TimeSlot): boolean {
  const timeHours = timeToHours(time);
  const [start, end] = timeSlotRanges[slot];
  return timeHours >= start && timeHours < end;
}

/**
 * Calcule la distance entre deux points géographiques (en km)
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Vérifie si une date correspond au filtre temporel
 */
function matchesDateFilter(dateFilter: DateFilter, customDate?: string): boolean {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = dimanche, 1 = lundi, etc.
  
  switch (dateFilter) {
    case 'today':
      return true; // Pour l'instant, on considère que "aujourd'hui" inclut tous les événements
    case 'weekend':
      return dayOfWeek === 0 || dayOfWeek === 6; // Dimanche ou samedi
    case 'week':
      return true; // Cette semaine inclut tous les jours
    case 'custom':
      // Pour l'instant, on retourne true si une date custom est fournie
      return !!customDate;
    default:
      return true;
  }
}

/**
 * Filtre les lieux de culte selon les critères d'événements
 */
export function filterPlacesByEvents(places: WorshipPlace[], eventFilter: EventFilter): WorshipPlace[] {
  if (!eventFilter.types && !eventFilter.timeFilter && !eventFilter.dateTimeFilter && !eventFilter.locationFilter) {
    return places;
  }

  return places.filter(place => {
    const schedules = parseScheduleString(place.serviceTimes);
    
    if (schedules.length === 0 && (eventFilter.types || eventFilter.timeFilter || eventFilter.dateTimeFilter)) {
      return false; // Pas d'horaires = pas de correspondance pour les filtres temporels
    }

    // Filtrage par type d'événement
    if (eventFilter.types && eventFilter.types.length > 0) {
      const hasMatchingType = schedules.some(schedule => 
        eventFilter.types!.includes(schedule.type as CelebrationType)
      );
      if (!hasMatchingType) {
        return false;
      }
    }

    // Filtrage par créneau horaire
    if (eventFilter.timeFilter) {
      const { days, timeSlots, specificTimes } = eventFilter.timeFilter;
      
      const hasMatchingSchedule = schedules.some(schedule => {
        // Vérification du jour
        if (days && days.length > 0) {
          if (!days.includes(schedule.day as WeekDay)) {
            return false;
          }
        }

        // Vérification du créneau horaire
        if (timeSlots && timeSlots.length > 0) {
          const hasMatchingSlot = timeSlots.some(slot => 
            isTimeInSlot(schedule.startTime, slot)
          );
          if (!hasMatchingSlot) {
            return false;
          }
        }

        // Vérification des heures spécifiques
        if (specificTimes && specificTimes.length > 0) {
          if (!specificTimes.includes(schedule.startTime)) {
            return false;
          }
        }

        return true;
      });

      if (!hasMatchingSchedule) {
        return false;
      }
    }

    // Filtrage par date/temps
    if (eventFilter.dateTimeFilter?.dateFilter) {
      if (!matchesDateFilter(eventFilter.dateTimeFilter.dateFilter, eventFilter.dateTimeFilter.customDate)) {
        return false;
      }
    }

    // Filtrage par localisation
    if (eventFilter.locationFilter) {
      const { city, radius, centerPoint } = eventFilter.locationFilter;
      
      // Filtrage par ville
      if (city && city.trim() !== '') {
        if (!place.city.toLowerCase().includes(city.toLowerCase())) {
          return false;
        }
      }
      
      // Filtrage par rayon géographique
      if (radius && centerPoint) {
        const distance = calculateDistance(
          centerPoint[0], centerPoint[1],
          place.position[0], place.position[1]
        );
        if (distance > radius) {
          return false;
        }
      }
    }

    return true;
  });
}

/**
 * Extrait tous les types d'événements uniques des lieux de culte
 */
export function getAvailableEventTypes(places: WorshipPlace[]): CelebrationType[] {
  const types = new Set<CelebrationType>();
  
  places.forEach(place => {
    const schedules = parseScheduleString(place.serviceTimes);
    schedules.forEach(schedule => {
      types.add(schedule.type as CelebrationType);
    });
  });

  return Array.from(types).sort();
}

/**
 * Extrait tous les jours de la semaine où il y a des événements
 */
export function getAvailableDays(places: WorshipPlace[]): WeekDay[] {
  const days = new Set<WeekDay>();
  
  places.forEach(place => {
    const schedules = parseScheduleString(place.serviceTimes);
    schedules.forEach(schedule => {
      days.add(schedule.day as WeekDay);
    });
  });

  // Trier les jours dans l'ordre de la semaine
  const dayOrder: WeekDay[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  return dayOrder.filter(day => days.has(day));
}

/**
 * Extrait toutes les heures de début uniques
 */
export function getAvailableStartTimes(places: WorshipPlace[]): string[] {
  const times = new Set<string>();
  
  places.forEach(place => {
    const schedules = parseScheduleString(place.serviceTimes);
    schedules.forEach(schedule => {
      times.add(schedule.startTime);
    });
  });

  return Array.from(times).sort();
}

/**
 * Extrait toutes les villes uniques des lieux de culte
 */
export function getAvailableCities(places: WorshipPlace[]): string[] {
  const cities = new Set<string>();
  
  places.forEach(place => {
    cities.add(place.city);
  });

  return Array.from(cities).sort();
}

const denominationTranslations: Record<string, string> = {
  'Catholic': 'Confession : Catholique',
  'Protestant': 'Confession : Protestante',
  'Orthodox': 'Confession : Orthodoxe',
  'Evangelical': 'Confession : Évangélique',
  'Pentecostal': 'Confession : Pentecôtiste',
  'Baptist': 'Confession : Baptiste',
  'Neo-Apostolic': 'Confession : Néo-apostolique',
  'Other': 'Confession : Autre'
};

const celebrationTypeTranslations: Record<string, string> = {
  'Célébration': 'Célébration',
  'Prière': 'Prière',
  'Confession': 'Confession',
  'Adoration': 'Adoration',
  'Catéchisme': 'Catéchisme',
  'Groupe de prière': 'Groupe de prière',
  'Évangélisation': 'Évangélisation',
  'Service communautaire': 'Service communautaire',
  'Autre': 'Autre'
};

const eventTypeTranslations: Record<string, string> = {
  'Célébration principale': 'Célébration principale',
  'Célébration en semaine': 'Célébration en semaine',
  'Prière du matin': 'Prière du matin',
  'Prière du soir': 'Prière du soir',
  'Confession': 'Confession',
  'Adoration': 'Adoration',
  'Catéchisme': 'Catéchisme',
  'Groupe de prière': 'Groupe de prière',
  'Bible study': 'Bible study',
  'Évangélisation': 'Évangélisation',
  'Service communautaire': 'Service communautaire',
  'Autre': 'Autre'
}; 
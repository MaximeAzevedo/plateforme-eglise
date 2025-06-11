interface ParsedSchedule {
  type: string;
  day: string;
  startTime: string;
  endTime: string;
  dayIndex: number; // 0 = Dimanche, 1 = Lundi, etc.
}

interface UpcomingCelebration {
  id: string;
  placeName: string;
  placeCity: string;
  denomination: string;
  type: string;
  date: Date;
  startTime: string;
  endTime: string;
  distance?: number;
  position?: [number, number];
}

const dayNameToIndex: Record<string, number> = {
  'Dimanche': 0,
  'Lundi': 1,
  'Mardi': 2,
  'Mercredi': 3,
  'Jeudi': 4,
  'Vendredi': 5,
  'Samedi': 6
};

const dayIndexToName: Record<number, string> = {
  0: 'Dimanche',
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi'
};

export function parseScheduleString(scheduleString: string): ParsedSchedule[] {
  if (!scheduleString || scheduleString === 'Horaires non disponibles') {
    return [];
  }

  const schedules: ParsedSchedule[] = [];
  
  // Split by semicolon to get individual schedules
  const parts = scheduleString.split(';').map(s => s.trim());
  
  for (const part of parts) {
    // Format expected: "Type - Jour HH:MM-HH:MM"
    // Example: "Messe/Culte principal - Dimanche 10:30-11:30"
    const match = part.match(/^(.+?)\s*-\s*(\w+)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/);
    
    if (match) {
      const [, type, day, startTime, endTime] = match;
      const dayIndex = dayNameToIndex[day];
      
      if (dayIndex !== undefined) {
        schedules.push({
          type: type.trim(),
          day,
          startTime,
          endTime,
          dayIndex
        });
      }
    }
  }
  
  return schedules;
}

export function getUpcomingCelebrations(
  places: any[],
  daysAhead: number = 7,
  timeFilter?: { dateFilter?: 'today' | 'weekend' | 'week' | 'custom'; customDate?: string }
): UpcomingCelebration[] {
  const celebrations: UpcomingCelebration[] = [];
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
  
  // Calculer la plage de dates selon le filtre temporel
  let startDate = new Date(now);
  let endDate = new Date(now);
  
  if (timeFilter?.dateFilter) {
    switch (timeFilter.dateFilter) {
      case 'today':
        // Seulement aujourd'hui
        endDate.setDate(now.getDate());
        daysAhead = 1;
        console.log(`🕐 Filtre temporel: Aujourd'hui seulement`);
        break;
      case 'weekend':
        // Ce week-end (samedi et dimanche)
        const daysUntilSaturday = (6 - currentDay + 7) % 7;
        startDate.setDate(now.getDate() + daysUntilSaturday);
        endDate.setDate(startDate.getDate() + 1); // Dimanche
        daysAhead = Math.max(daysUntilSaturday + 2, 1);
        console.log(`🕐 Filtre temporel: Ce week-end`);
        break;
      case 'week':
        // Cette semaine (jusqu'au dimanche)
        const daysUntilSunday = (7 - currentDay) % 7;
        endDate.setDate(now.getDate() + daysUntilSunday);
        daysAhead = daysUntilSunday + 1;
        console.log(`🕐 Filtre temporel: Cette semaine`);
        break;
      case 'custom':
        if (timeFilter.customDate) {
          const customDate = new Date(timeFilter.customDate);
          startDate = customDate;
          endDate = customDate;
          daysAhead = Math.ceil((customDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          console.log(`🕐 Filtre temporel: Date personnalisée ${timeFilter.customDate}`);
        }
        break;
    }
  }
  
  for (const place of places) {
    const schedules = parseScheduleString(place.serviceTimes);
    
    for (const schedule of schedules) {
      // Calculate next occurrences for the next `daysAhead` days
      for (let dayOffset = 0; dayOffset < daysAhead; dayOffset++) {
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + dayOffset);
        const targetDayIndex = targetDate.getDay();
        
        if (schedule.dayIndex === targetDayIndex) {
          // Parse start time
          const [hours, minutes] = schedule.startTime.split(':').map(Number);
          const scheduleTime = hours * 60 + minutes;
          
          // If it's today, check if the celebration hasn't passed yet
          if (dayOffset === 0 && scheduleTime <= currentTime) {
            continue; // Skip past celebrations for today
          }
          
          // Vérifier si la célébration est dans la plage de dates du filtre temporel
          if (timeFilter?.dateFilter) {
            const celebrationDate = new Date(targetDate);
            celebrationDate.setHours(0, 0, 0, 0);
            
            if (timeFilter.dateFilter === 'today' && dayOffset > 0) {
              continue;
            }
            
            if (timeFilter.dateFilter === 'weekend') {
              if (targetDayIndex !== 6 && targetDayIndex !== 0) { // Pas samedi ou dimanche
                continue;
              }
            }
          }
          
          // Create the celebration date
          const celebrationDate = new Date(targetDate);
          celebrationDate.setHours(hours, minutes, 0, 0);
          
          celebrations.push({
            id: `${place.id}-${schedule.dayIndex}-${schedule.startTime}`,
            placeName: place.name,
            placeCity: place.city,
            denomination: place.denomination,
            type: schedule.type,
            date: celebrationDate,
            startTime: schedule.startTime,
            endTime: schedule.endTime
          });
        }
      }
    }
  }
  
  // Sort by date and time
  celebrations.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return celebrations;
}

export function formatCelebrationTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  // Correction pour la détection du jour
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const celebrationDay = new Date(date);
  celebrationDay.setHours(0, 0, 0, 0);
  const daysDiff = Math.floor((celebrationDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) {
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes <= 0) return 'En cours';
      if (diffMinutes < 60) return `Dans ${diffMinutes}min`;
    }
    return `Aujourd'hui ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (daysDiff === 1) {
    return `Demain ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    const dayName = dayIndexToName[date.getDay()];
    return `${dayName} ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
} 
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString('en-US', options);
}

export function formatTime(time: string): string {
  // Convert 24-hour format to 12-hour format
  // Input: "HH:MM", Output: "HH:MM AM/PM"
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  
  return `${formattedHour}:${minutes} ${period}`;
}

export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function format(date: Date, formatStr: string): string {
  // Simple implementation for basic format strings
  if (formatStr === 'EEEE') {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }
  
  if (formatStr === 'EEEE, MMMM d') {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  }
  
  return date.toLocaleDateString();
}

export function getRandomItemForToday<T>(items: T[]): T | null {
  if (!items || items.length === 0) return null;
  
  // Use the current date as a seed for pseudo-randomness
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Simple hash function to get a consistent index for today
  const index = seed % items.length;
  
  return items[index];
}

export function getItemsForToday<T>(
  items: T[], 
  count: number = 3
): T[] {
  if (!items || items.length === 0) return [];
  
  // Use the current date as a seed for pseudo-randomness
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Shuffle array using Fisher-Yates algorithm with seeded randomness
  const shuffled = [...items];
  let currentIndex = shuffled.length;
  let pseudoRandom = seed;
  
  while (currentIndex > 0) {
    // Generate next pseudo-random number
    pseudoRandom = (pseudoRandom * 9301 + 49297) % 233280;
    const randomIndex = Math.floor((pseudoRandom / 233280) * currentIndex);
    
    currentIndex--;
    
    // Swap elements
    [shuffled[currentIndex], shuffled[randomIndex]] = 
    [shuffled[randomIndex], shuffled[currentIndex]];
  }
  
  // Return the first 'count' items
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Calculate streak based on completion history
// Optional threshold parameter (0-1) to only count days with completion percentage above threshold
export function getStreakCount(
  completionHistory: Record<string, boolean> = {}, 
  threshold: number = 0
): number {
  if (!completionHistory || Object.keys(completionHistory).length === 0) return 0;
  
  const today = new Date();
  let currentStreak = 0;
  
  // Start from today and go backwards
  for (let i = 0; i < 365; i++) { // Check up to a year back
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // If this date is completed, increment streak
    if (completionHistory[dateString]) {
      currentStreak++;
    } else {
      // Break the streak when we find an incomplete day
      break;
    }
  }
  
  return currentStreak;
}

// Get day names from day numbers (0 = Sunday, 1 = Monday, etc.)
export function getDayNames(dayNumbers: number[]): string[] {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayNumbers.map(num => dayNames[num]);
}

// Check if a discipline is scheduled for today
export function isDisciplineScheduledForToday(scheduledDays: number[]): boolean {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  return scheduledDays.includes(today);
}
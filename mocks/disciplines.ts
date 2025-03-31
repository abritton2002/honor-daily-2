import { Discipline, DisciplineFrequency } from '@/types/disciplines';

export const MOCK_DISCIPLINES: Discipline[] = [
  {
    id: '1',
    name: 'Morning Meditation',
    description: 'Start the day with 10 minutes of mindful meditation',
    frequency: DisciplineFrequency.DAILY,
    scheduledDays: [0, 1, 2, 3, 4, 5, 6], // Every day
    reminderTime: '07:00',
    createdAt: '2023-01-01T08:00:00Z',
    updatedAt: '2023-01-01T08:00:00Z'
  },
  {
    id: '2',
    name: 'Read for 30 minutes',
    description: 'Read a book for personal growth or learning',
    frequency: DisciplineFrequency.DAILY,
    scheduledDays: [0, 1, 2, 3, 4, 5, 6], // Every day
    reminderTime: '21:00',
    createdAt: '2023-01-02T08:00:00Z',
    updatedAt: '2023-01-02T08:00:00Z'
  },
  {
    id: '3',
    name: 'Exercise',
    description: 'Physical activity for at least 30 minutes',
    frequency: DisciplineFrequency.WEEKLY,
    scheduledDays: [1, 3, 5], // Monday, Wednesday, Friday
    reminderTime: '17:00',
    createdAt: '2023-01-03T08:00:00Z',
    updatedAt: '2023-01-03T08:00:00Z'
  },
  {
    id: '4',
    name: 'Weekly Planning',
    description: 'Plan goals and priorities for the week ahead',
    frequency: DisciplineFrequency.WEEKLY,
    scheduledDays: [0], // Sunday
    reminderTime: '18:00',
    createdAt: '2023-01-04T08:00:00Z',
    updatedAt: '2023-01-04T08:00:00Z'
  },
  {
    id: '5',
    name: 'Gratitude Journal',
    description: 'Write down 3 things you are grateful for',
    frequency: DisciplineFrequency.DAILY,
    scheduledDays: [0, 1, 2, 3, 4, 5, 6], // Every day
    reminderTime: '21:30',
    createdAt: '2023-01-05T08:00:00Z',
    updatedAt: '2023-01-05T08:00:00Z'
  }
];
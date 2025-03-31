import { Recommendation } from '@/types/insights';

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec1',
    title: 'Morning Meditation',
    description: "Start your day with 10 minutes of mindfulness meditation to improve focus and reduce stress",
    category: 'discipline',
    difficulty: 'easy',
    estimatedTimeMinutes: 10,
    benefits: ['Improved focus', 'Reduced stress', 'Better emotional regulation'],
    relatedAreas: ['mental-health', 'productivity'],
    source: 'ai',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rec2',
    title: 'Gratitude Journaling',
    description: "Add a daily discipline to write down 3 things you are grateful for",
    category: 'discipline',
    difficulty: 'easy',
    estimatedTimeMinutes: 5,
    benefits: ['Improved mood', 'Increased positivity', 'Better perspective'],
    relatedAreas: ['journal', 'mental-health'],
    source: 'ai',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rec3',
    title: 'Scripture Memory',
    description: "Set aside time each week to memorize key scripture passages",
    category: 'learning',
    difficulty: 'medium',
    estimatedTimeMinutes: 15,
    benefits: ['Spiritual growth', 'Mental exercise', 'Wisdom application'],
    relatedAreas: ['spiritual', 'learning'],
    source: 'curator',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rec4',
    title: 'Weekly Planning Session',
    description: "Schedule 30 minutes every Sunday to plan your week ahead",
    category: 'discipline',
    difficulty: 'medium',
    estimatedTimeMinutes: 30,
    benefits: ['Improved organization', 'Reduced stress', 'Better time management'],
    relatedAreas: ['productivity', 'habits'],
    source: 'ai',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'rec5',
    title: 'Deep Reading Practice',
    description: "Set aside 30 minutes for focused, deep reading without distractions",
    category: 'learning',
    difficulty: 'medium',
    estimatedTimeMinutes: 30,
    benefits: ['Improved comprehension', 'Knowledge acquisition', 'Mental focus'],
    relatedAreas: ['learning', 'productivity'],
    source: 'ai',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  }
];
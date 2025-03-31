import { GrowthPlan } from '@/types/insights';

export const MOCK_GROWTH_PLAN: GrowthPlan = {
  id: 'plan1',
  title: 'Spiritual Growth & Consistency',
  description: 'A personalized 30-day plan to build spiritual disciplines and consistent habits',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  progress: 0.1,
  focusAreas: ['spiritual', 'disciplines', 'learning'],
  milestones: [
    {
      id: 'milestone1',
      title: 'Establish Morning Routine',
      description: 'Create and follow a consistent morning routine that includes prayer and scripture reading',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
      completedDate: null
    },
    {
      id: 'milestone2',
      title: 'Journal Consistency',
      description: 'Write in your journal at least 5 times per week',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
      completedDate: null
    },
    {
      id: 'milestone3',
      title: 'Scripture Memory',
      description: 'Memorize at least 4 key verses',
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
      completedDate: null
    },
    {
      id: 'milestone4',
      title: 'Complete Learning Path',
      description: 'Finish the "Foundations of Faith" learning path',
      dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
      completedDate: null
    }
  ],
  challenges: [
    {
      id: 'challenge1',
      title: 'Digital Sabbath',
      description: 'Take one full day away from screens to focus on spiritual renewal',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
      completedDate: null
    },
    {
      id: 'challenge2',
      title: 'Prayer Walk',
      description: 'Take a 30-minute walk focused entirely on prayer',
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
      completedDate: null
    },
    {
      id: 'challenge3',
      title: 'Gratitude Marathon',
      description: 'Write down 100 things you are grateful for in one sitting',
      dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
      completedDate: null
    }
  ]
};
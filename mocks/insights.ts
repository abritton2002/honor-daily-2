import { Insight } from '@/types/insights';

export const MOCK_INSIGHTS: Insight[] = [
  {
    id: 'insight1',
    title: 'Morning Routine Consistency',
    description: 'Your morning disciplines are completed 80% of the time, showing strong consistency.',
    type: 'observation',
    severity: 'positive',
    relatedAreas: ['disciplines', 'habits'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isDismissed: false,
    source: 'ai',
    actionable: true,
    actionText: 'View Details'
  },
  {
    id: 'insight2',
    title: 'Journal Reflection Opportunity',
    description: 'You tend to write more when reflecting on spiritual topics. Consider adding a dedicated spiritual reflection prompt to your routine.',
    type: 'recommendation',
    severity: 'neutral',
    relatedAreas: ['journal', 'spiritual'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isDismissed: false,
    source: 'ai',
    actionable: true,
    actionText: 'Add to Disciplines'
  },
  {
    id: 'insight3',
    title: 'Evening Discipline Gap',
    description: "You're less consistent with evening disciplines. Consider adjusting your schedule or reminders to improve completion rates.",
    type: 'alert',
    severity: 'warning',
    relatedAreas: ['disciplines', 'habits'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isDismissed: false,
    source: 'ai',
    actionable: true,
    actionText: 'Adjust Schedule'
  },
  {
    id: 'insight4',
    title: 'Scripture Memory Challenge',
    description: 'Based on your interests, try memorizing one verse per week for the next month.',
    type: 'challenge',
    severity: 'neutral',
    relatedAreas: ['learning', 'spiritual'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isDismissed: false,
    source: 'curator',
    actionable: true,
    actionText: 'Start Challenge'
  },
  {
    id: 'insight5',
    title: 'Gratitude Pattern',
    description: 'Your journal entries show increased positivity when you practice gratitude. Consider making this a daily discipline.',
    type: 'recommendation',
    severity: 'positive',
    relatedAreas: ['journal', 'mental-health'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isDismissed: false,
    source: 'ai',
    actionable: true,
    actionText: 'Add to Disciplines'
  },
  {
    id: 'insight6',
    title: 'Learning Consistency',
    description: "You haven't completed any learning items in the past week. Knowledge builds on consistency.",
    type: 'alert',
    severity: 'warning',
    relatedAreas: ['learning'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isDismissed: false,
    source: 'ai',
    actionable: true,
    actionText: 'Browse Learning'
  }
];
import { PsychologicalProfile } from '@/types/insights';

export const MOCK_PSYCHOLOGICAL_PROFILE: PsychologicalProfile = {
  id: 'profile1',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  traits: {
    openness: 0.7,
    conscientiousness: 0.8,
    extraversion: 0.5,
    agreeableness: 0.6,
    neuroticism: 0.4
  },
  strengths: [
    "Consistency",
    "Reflection",
    "Growth_Mindset"
  ],
  growthAreas: [
    "Evening_Routine",
    "Balancing_Priorities"
  ],
  challenges: [
    "Procrastination",
    "Digital_Distractions",
    "Perfectionism"
  ],
  motivations: [
    'Spiritual growth',
    'Building lasting habits',
    'Deepening knowledge',
    'Personal development'
  ],
  learningStyle: 'visual',
  emotionalState: 'positive',
  motivationLevel: 'high',
  resilienceLevel: 'medium',
  consistencyLevel: 'medium',
  lastUpdated: new Date().toISOString()
};
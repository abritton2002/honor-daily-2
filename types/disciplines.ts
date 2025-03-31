export const DisciplineFrequency = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  CUSTOM: 'custom'
};

export const DisciplineCategory = {
  PHYSICAL: 'physical',
  MENTAL: 'mental',
  EMOTIONAL: 'emotional',
  SPIRITUAL: 'spiritual',
  SOCIAL: 'social',
  PROFESSIONAL: 'professional',
  FINANCIAL: 'financial',
  CREATIVE: 'creative',
  OTHER: 'other'
};

export interface Discipline {
  id: string;
  name: string;
  description?: string;
  category: string;
  frequency: string;
  scheduledDays?: number[];
  duration?: number;
  reminder?: string;
  createdAt: string;
  updatedAt: string;
  lastCompletedDate?: string;
}
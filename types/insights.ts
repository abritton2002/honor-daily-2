export type InsightType = 'observation' | 'recommendation' | 'warning' | 'achievement';
export type InsightSeverity = 'positive' | 'neutral' | 'warning' | 'critical';
export type InsightSource = 'ai' | 'system' | 'user';

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: InsightType;
  severity: InsightSeverity;
  relatedAreas: string[];
  createdAt: string;
  isRead: boolean;
  isDismissed: boolean;
  source: InsightSource;
  actionable?: boolean;
  actionText?: string;
  actionLink?: string;
  metadata?: Record<string, any>;
}

export interface GrowthPlan {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  milestones?: Milestone[];
  challenges?: Challenge[];
  focusAreas: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate?: string;
  isCompleted: boolean;
  completedDate?: string;
  focusArea: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isCompleted: boolean;
  completedDate?: string;
  focusArea: string;
}

export interface ActivityLog {
  id: string;
  area: string;
  action: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface TraitItem {
  name: string;
  score?: number;
  description?: string;
}

export interface PsychologicalProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  traits?: {
    openness?: number;
    conscientiousness?: number;
    extraversion?: number;
    agreeableness?: number;
    neuroticism?: number;
    [key: string]: number | undefined;
  };
  strengths?: Array<string | TraitItem>;
  growthAreas?: Array<string | TraitItem>;
  challenges?: Array<string | TraitItem>;
  motivations?: string[];
  learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  emotionalState?: string;
  motivationLevel?: string;
  resilienceLevel?: string;
  consistencyLevel?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeRequired: string;
  benefits: string[];
  steps?: string[];
  resources?: Resource[];
}

export interface Resource {
  title: string;
  type: 'article' | 'video' | 'book' | 'app' | 'other';
  url?: string;
  description?: string;
}

export interface JournalAnalysis {
  id: string;
  entryId: string;
  createdAt: string;
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topics: string[];
  emotions: string[];
  insights: string[];
  wordCount: number;
  emotionalTone: string;
  themes: string[];
  growthAreas: string[];
  sentimentScore: number;
}

export interface ConsistencyScore {
  overall: number;
  byArea: Record<string, number>;
  trend: 'improving' | 'declining' | 'stable';
  lastUpdated: string;
}
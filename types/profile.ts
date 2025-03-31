export interface Profile {
  id: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  theme: 'dark' | 'light' | 'system';
  notifications: boolean;
  streakGoal: number;
  bio?: string;
}

export interface ProfileFormData {
  name: string;
  avatar?: string;
  bio?: string;
}
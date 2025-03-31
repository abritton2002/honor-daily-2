import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, ProfileFormData } from '@/types/profile';

interface ProfileState {
  profile: Profile | null;
  isOnboarded: boolean;
  
  // Actions
  createProfile: (data: ProfileFormData) => void;
  updateProfile: (data: Partial<ProfileFormData>) => void;
  updateSettings: (settings: Partial<Pick<Profile, 'theme' | 'notifications' | 'streakGoal'>>) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      isOnboarded: false,
      
      createProfile: (data) => {
        const newProfile: Profile = {
          id: Date.now().toString(),
          name: data.name,
          avatar: data.avatar,
          bio: data.bio || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'dark',
          notifications: true,
          streakGoal: 5,
        };
        
        set({
          profile: newProfile,
          isOnboarded: true,
        });
      },
      
      updateProfile: (data) => {
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : null,
        }));
      },
      
      updateSettings: (settings) => {
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                ...settings,
                updatedAt: new Date().toISOString(),
              }
            : null,
        }));
      },
      
      resetProfile: () => {
        set({
          profile: null,
          isOnboarded: false,
        });
      },
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
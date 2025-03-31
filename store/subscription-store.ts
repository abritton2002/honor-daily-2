import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubscriptionState, SubscriptionTier, SubscriptionPlan } from '@/types/subscription';

interface SubscriptionStore {
  subscription: SubscriptionState;
  plans: SubscriptionPlan[];
  
  // Actions
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  activateSubscription: (plan: string, expiryDate: string) => void;
  deactivateSubscription: () => void;
  isPremiumFeatureAvailable: (feature: string) => boolean;
  
  // Mock purchase functions (to be replaced with actual IAP)
  mockPurchaseSubscription: (planId: string) => Promise<boolean>;
  mockRestorePurchases: () => Promise<boolean>;
}

// Define subscription plans
const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Premium',
    description: 'Full access to all premium features',
    price: '$4.99',
    period: 'month',
    features: [
      'Full journal history access',
      'Enhanced learning content',
      'AI-powered growth analytics',
      'Unlimited disciplines',
      'Personalized growth plan'
    ]
  },
  {
    id: 'yearly',
    name: 'Annual Premium',
    description: 'Full access with 20% savings',
    price: '$47.99',
    period: 'year',
    features: [
      'Full journal history access',
      'Enhanced learning content',
      'AI-powered growth analytics',
      'Unlimited disciplines',
      'Personalized growth plan',
      '20% savings vs monthly plan'
    ]
  }
];

// Premium feature keys for access control
export const PREMIUM_FEATURES = {
  JOURNAL_HISTORY: 'journal_history',
  ENHANCED_LEARNING: 'enhanced_learning',
  ANALYTICS: 'analytics',
  UNLIMITED_DISCIPLINES: 'unlimited_disciplines',
  GROWTH_PLAN: 'growth_plan',
  PSYCHOLOGICAL_PROFILE: 'psychological_profile'
};

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      subscription: {
        tier: 'free',
        isActive: false,
        expiryDate: null,
        purchaseDate: null,
        plan: null
      },
      plans: SUBSCRIPTION_PLANS,
      
      setSubscriptionTier: (tier) => {
        set((state) => ({
          subscription: {
            ...state.subscription,
            tier
          }
        }));
      },
      
      activateSubscription: (plan, expiryDate) => {
        set({
          subscription: {
            tier: 'premium',
            isActive: true,
            purchaseDate: new Date().toISOString(),
            expiryDate,
            plan
          }
        });
      },
      
      deactivateSubscription: () => {
        set({
          subscription: {
            tier: 'free',
            isActive: false,
            expiryDate: null,
            purchaseDate: null,
            plan: null
          }
        });
      },
      
      isPremiumFeatureAvailable: (feature) => {
        const { subscription } = get();
        
        // If user is premium and subscription is active, allow access
        if (subscription.tier === 'premium' && subscription.isActive) {
          return true;
        }
        
        // Otherwise, deny access to premium features
        return false;
      },
      
      // Mock purchase functions (to be replaced with actual IAP implementation)
      mockPurchaseSubscription: async (planId) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
        if (!plan) return false;
        
        // Calculate expiry date based on plan period
        const expiryDate = new Date();
        if (plan.period === 'month') {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }
        
        get().activateSubscription(planId, expiryDate.toISOString());
        return true;
      },
      
      mockRestorePurchases: async () => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 50% chance of successful restore for demo purposes
        const success = Math.random() > 0.5;
        
        if (success) {
          // Calculate expiry date (1 year from now for demo)
          const expiryDate = new Date();
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          
          get().activateSubscription('yearly', expiryDate.toISOString());
        }
        
        return success;
      }
    }),
    {
      name: 'subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
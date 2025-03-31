export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: 'month' | 'year';
  features: string[];
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  isActive: boolean;
  expiryDate: string | null;
  purchaseDate: string | null;
  plan: string | null; // 'monthly' or 'yearly'
  receiptData?: string;
}
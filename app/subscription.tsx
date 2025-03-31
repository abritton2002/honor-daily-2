import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, X } from 'lucide-react-native';
import Card from '@/components/Card';
import { useSubscriptionStore } from '@/store/subscription-store';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { plans, subscription, mockPurchaseSubscription, mockRestorePurchases } = useSubscriptionStore();
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const [selectedPlan, setSelectedPlan] = useState(plans[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  
  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const success = await mockPurchaseSubscription(selectedPlan);
      if (success) {
        router.back();
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const success = await mockRestorePurchases();
      if (success) {
        router.back();
      }
    } catch (error) {
      console.error('Restore failed:', error);
    } finally {
      setIsRestoring(false);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colorScheme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colorScheme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colorScheme.text.primary }]}>Premium Subscription</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {subscription.tier === 'premium' ? (
          // Current subscription info
          <View style={styles.currentSubscription}>
            <Card style={styles.subscriptionInfoCard}>
              <Text style={[styles.subscriptionTitle, { color: colorScheme.text.primary }]}>
                Current Subscription
              </Text>
              
              <View style={styles.subscriptionDetail}>
                <Text style={[styles.subscriptionLabel, { color: colorScheme.text.secondary }]}>Plan:</Text>
                <Text style={[styles.subscriptionValue, { color: colorScheme.text.primary }]}>
                  {plans.find(p => p.id === subscription.plan)?.name || 'Premium'}
                </Text>
              </View>
              
              <View style={styles.subscriptionDetail}>
                <Text style={[styles.subscriptionLabel, { color: colorScheme.text.secondary }]}>Status:</Text>
                <Text style={[styles.subscriptionValue, { color: colorScheme.primary }]}>
                  Active
                </Text>
              </View>
              
              <View style={styles.subscriptionDetail}>
                <Text style={[styles.subscriptionLabel, { color: colorScheme.text.secondary }]}>Renewal Date:</Text>
                <Text style={[styles.subscriptionValue, { color: colorScheme.text.primary }]}>
                  {formatDate(subscription.expiryDate)}
                </Text>
              </View>
              
              <Text style={[styles.managementNote, { color: colorScheme.text.secondary }]}>
                To manage your subscription, please visit the App Store or Google Play Store.
              </Text>
            </Card>
            
            <Text style={[styles.benefitsTitle, { color: colorScheme.text.primary }]}>
              Your Premium Benefits
            </Text>
            
            <Card style={styles.benefitsCard}>
              {plans.find(p => p.id === subscription.plan)?.features.map((feature, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Check size={18} color={colorScheme.primary} style={styles.benefitIcon} />
                  <Text style={[styles.benefitText, { color: colorScheme.text.primary }]}>{feature}</Text>
                </View>
              ))}
            </Card>
          </View>
        ) : (
          // Subscription plans
          <View>
            <Text style={[styles.upgradeTitle, { color: colorScheme.text.primary }]}>
              Upgrade to Premium
            </Text>
            
            <Text style={[styles.upgradeSubtitle, { color: colorScheme.text.secondary }]}>
              Unlock all features and take your personal growth to the next level
            </Text>
            
            <View style={styles.plansContainer}>
              {plans.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    selectedPlan === plan.id && styles.selectedPlan,
                    { 
                      borderColor: selectedPlan === plan.id ? colorScheme.primary : colorScheme.border,
                      backgroundColor: colorScheme.cardBackground
                    }
                  ]}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  <View style={styles.planHeader}>
                    <Text style={[styles.planName, { color: colorScheme.text.primary }]}>
                      {plan.name}
                    </Text>
                    {plan.id === 'yearly' && (
                      <View style={[styles.savingsBadge, { backgroundColor: colorScheme.primary }]}>
                        <Text style={styles.savingsText}>Save 20%</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={[styles.planPrice, { color: colorScheme.text.primary }]}>
                    {plan.price}
                    <Text style={[styles.planPeriod, { color: colorScheme.text.secondary }]}>
                      /{plan.period}
                    </Text>
                  </Text>
                  
                  <Text style={[styles.planDescription, { color: colorScheme.text.secondary }]}>
                    {plan.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={[styles.featuresTitle, { color: colorScheme.text.primary }]}>
              Premium Features
            </Text>
            
            <Card style={styles.featuresCard}>
              {plans[0].features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Check size={18} color={colorScheme.primary} style={styles.featureIcon} />
                  <Text style={[styles.featureText, { color: colorScheme.text.primary }]}>{feature}</Text>
                </View>
              ))}
            </Card>
            
            <TouchableOpacity
              style={[styles.purchaseButton, { backgroundColor: colorScheme.primary }]}
              onPress={handlePurchase}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.purchaseButtonText}>
                  Subscribe to {plans.find(p => p.id === selectedPlan)?.name}
                </Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
              disabled={isRestoring}
            >
              {isRestoring ? (
                <ActivityIndicator color={colorScheme.text.primary} />
              ) : (
                <Text style={[styles.restoreButtonText, { color: colorScheme.text.primary }]}>
                  Restore Purchases
                </Text>
              )}
            </TouchableOpacity>
            
            <Text style={[styles.termsText, { color: colorScheme.text.muted }]}>
              By subscribing, you agree to our Terms of Service and Privacy Policy. 
              Subscriptions will automatically renew unless canceled at least 24 hours before the end of the current period.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  // Current subscription styles
  currentSubscription: {
    marginTop: 8,
  },
  subscriptionInfoCard: {
    padding: 20,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subscriptionDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  subscriptionLabel: {
    fontSize: 16,
  },
  subscriptionValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  managementNote: {
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  benefitsCard: {
    padding: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
  },
  // Upgrade styles
  upgradeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  upgradeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  plansContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  planCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginHorizontal: 6,
  },
  selectedPlan: {
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
  },
  savingsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  planDescription: {
    fontSize: 14,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  featuresCard: {
    padding: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
  },
  purchaseButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreButtonText: {
    fontSize: 16,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
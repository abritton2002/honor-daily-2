import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Bell, 
  RefreshCw,
  LogOut,
  BookText,
  Calendar,
  ChevronRight,
  Info,
  Crown
} from 'lucide-react-native';
import Card from '@/components/Card';
import Button from '@/components/Button';
import PremiumBadge from '@/components/PremiumBadge';
import { useProfileStore } from '@/store/profile-store';
import { useDisciplinesStore } from '@/store/disciplines-store';
import { useWisdomStore } from '@/store/wisdom-store';
import { useJournalStore } from '@/store/journal-store';
import { useThemeStore } from '@/store/theme-store';
import { useSubscriptionStore } from '@/store/subscription-store';
import colors from '@/constants/colors';
import typography from '@/constants/typography';

export default function SettingsScreen() {
  const router = useRouter();
  const profile = useProfileStore(state => state.profile);
  const resetProfile = useProfileStore(state => state.resetProfile);
  const updateSettings = useProfileStore(state => state.updateSettings);
  
  const resetCompletionStatus = useDisciplinesStore(state => state.resetCompletionStatus);
  const refreshTodayEntries = useWisdomStore(state => state.refreshTodayEntries);
  const refreshTodayPrompt = useJournalStore(state => state.refreshTodayPrompt);
  
  const theme = useThemeStore(state => state.theme);
  const toggleTheme = useThemeStore(state => state.toggleTheme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const subscription = useSubscriptionStore(state => state.subscription);
  const deactivateSubscription = useSubscriptionStore(state => state.deactivateSubscription);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    profile?.notifications || false
  );
  
  const isPremium = subscription.tier === 'premium' && subscription.isActive;
  
  const handleToggleNotifications = (value: boolean) => {
    setNotificationsEnabled(value);
    updateSettings({ notifications: value });
  };
  
  const handleToggleTheme = () => {
    toggleTheme();
    updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' });
  };
  
  const handleResetDisciplines = () => {
    Alert.alert(
      "Reset Disciplines",
      "This will mark all disciplines as incomplete. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Reset", 
          onPress: () => resetCompletionStatus()
        }
      ]
    );
  };
  
  const handleRefreshWisdom = () => {
    refreshTodayEntries();
    Alert.alert("Success", "Today's wisdom entries have been refreshed.");
  };
  
  const handleRefreshJournalPrompt = () => {
    refreshTodayPrompt();
    Alert.alert("Success", "Today's journal prompt has been refreshed.");
  };
  
  const handleManageSubscription = () => {
    router.push('/subscription');
  };
  
  const handleCancelSubscription = () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your premium subscription? You'll lose access to premium features.",
      [
        {
          text: "Keep Subscription",
          style: "cancel"
        },
        { 
          text: "Cancel Subscription", 
          onPress: () => {
            deactivateSubscription();
            Alert.alert("Subscription Cancelled", "Your premium subscription has been cancelled.");
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out? This will reset all your data.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Log Out", 
          onPress: () => {
            resetProfile();
            router.replace('/onboarding/profile');
          },
          style: "destructive"
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colorScheme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colorScheme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colorScheme.text.primary }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isPremium && (
          <View style={styles.premiumStatusSection}>
            <View style={[styles.premiumStatusCard, { backgroundColor: colorScheme.accent }]}>
              <View style={styles.premiumStatusContent}>
                <View style={styles.premiumIconContainer}>
                  <Crown size={24} color="#FFFFFF" />
                </View>
                <View style={styles.premiumTextContainer}>
                  <Text style={styles.premiumStatusTitle}>Premium Active</Text>
                  <Text style={styles.premiumStatusDescription}>
                    {subscription.plan === 'yearly' ? 'Annual' : 'Monthly'} plan · Expires {new Date(subscription.expiryDate || '').toLocaleDateString()}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.manageSubscriptionButton}
                onPress={handleManageSubscription}
              >
                <Text style={styles.manageSubscriptionText}>Manage</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme.text.secondary }]}>Preferences</Text>
          
          <Card style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colorScheme.cardBackgroundAlt }]}>
                  {theme === 'dark' ? (
                    <Moon size={20} color={colorScheme.text.primary} />
                  ) : (
                    <Sun size={20} color={colorScheme.text.primary} />
                  )}
                </View>
                <Text style={[styles.settingLabel, { color: colorScheme.text.primary }]}>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={handleToggleTheme}
                trackColor={{ false: colorScheme.inactive, true: colorScheme.primary }}
                thumbColor={colorScheme.text.primary}
              />
            </View>
          </Card>
          
          <Card style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colorScheme.cardBackgroundAlt }]}>
                  <Bell size={20} color={colorScheme.text.primary} />
                </View>
                <Text style={[styles.settingLabel, { color: colorScheme.text.primary }]}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: colorScheme.inactive, true: colorScheme.primary }}
                thumbColor={colorScheme.text.primary}
              />
            </View>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme.text.secondary }]}>History</Text>
          
          <TouchableOpacity onPress={() => router.push('/journal/history')}>
            <Card style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <View style={[styles.iconContainer, { backgroundColor: colorScheme.cardBackgroundAlt }]}>
                    <BookText size={20} color={colorScheme.text.primary} />
                  </View>
                  <Text style={[styles.settingLabel, { color: colorScheme.text.primary }]}>Journal History</Text>
                </View>
                <ChevronRight size={20} color={colorScheme.text.muted} />
              </View>
            </Card>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push('/growth/history')}>
            <Card style={styles.settingCard}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <View style={[styles.iconContainer, { backgroundColor: colorScheme.cardBackgroundAlt }]}>
                    <Calendar size={20} color={colorScheme.text.primary} />
                  </View>
                  <Text style={[styles.settingLabel, { color: colorScheme.text.primary }]}>Growth History</Text>
                </View>
                <ChevronRight size={20} color={colorScheme.text.muted} />
              </View>
            </Card>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme.text.secondary }]}>Actions</Text>
          
          <Card style={styles.settingCard}>
            <TouchableOpacity onPress={handleResetDisciplines} style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colorScheme.cardBackgroundAlt }]}>
                  <RefreshCw size={20} color={colorScheme.text.primary} />
                </View>
                <Text style={[styles.settingLabel, { color: colorScheme.text.primary }]}>Reset Today's Disciplines</Text>
              </View>
            </TouchableOpacity>
          </Card>
          
          <Card style={styles.settingCard}>
            <TouchableOpacity onPress={handleRefreshJournalPrompt} style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colorScheme.cardBackgroundAlt }]}>
                  <RefreshCw size={20} color={colorScheme.text.primary} />
                </View>
                <Text style={[styles.settingLabel, { color: colorScheme.text.primary }]}>Refresh Journal Prompt</Text>
              </View>
            </TouchableOpacity>
          </Card>
          
          <Card style={styles.settingCard}>
            <TouchableOpacity onPress={handleRefreshWisdom} style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, { backgroundColor: colorScheme.cardBackgroundAlt }]}>
                  <RefreshCw size={20} color={colorScheme.text.primary} />
                </View>
                <Text style={[styles.settingLabel, { color: colorScheme.text.primary }]}>Refresh Wisdom Content</Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>
        
        {!isPremium && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorScheme.text.secondary }]}>Premium</Text>
            
            <TouchableOpacity onPress={handleManageSubscription}>
              <Card style={styles.settingCard}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <View style={[styles.iconContainer, { backgroundColor: colorScheme.accent + '33' }]}>
                      <Crown size={20} color={colorScheme.accent} />
                    </View>
                    <Text style={[styles.settingLabel, { color: colorScheme.text.primary }]}>Upgrade to Premium</Text>
                  </View>
                  <ChevronRight size={20} color={colorScheme.text.muted} />
                </View>
              </Card>
            </TouchableOpacity>
          </View>
        )}
        
        {isPremium && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorScheme.text.secondary }]}>Subscription</Text>
            
            <Card style={styles.settingCard}>
              <TouchableOpacity onPress={handleCancelSubscription} style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <View style={[styles.iconContainer, styles.logoutIcon, { backgroundColor: 'rgba(229, 115, 115, 0.1)' }]}>
                    <Crown size={20} color={colorScheme.error} />
                  </View>
                  <Text style={[styles.logoutText, { color: colorScheme.error }]}>Cancel Subscription</Text>
                </View>
              </TouchableOpacity>
            </Card>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colorScheme.text.secondary }]}>Account</Text>
          
          <Card style={styles.settingCard}>
            <TouchableOpacity onPress={handleLogout} style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={[styles.iconContainer, styles.logoutIcon, { backgroundColor: 'rgba(229, 115, 115, 0.1)' }]}>
                  <LogOut size={20} color={colorScheme.error} />
                </View>
                <Text style={[styles.logoutText, { color: colorScheme.error }]}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>
        
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: colorScheme.text.muted }]}>Men of Honor v1.0.0</Text>
        </View>
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
  premiumStatusSection: {
    marginBottom: 24,
  },
  premiumStatusCard: {
    borderRadius: 12,
    padding: 16,
  },
  premiumStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumStatusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  premiumStatusDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  manageSubscriptionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  manageSubscriptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingCard: {
    marginBottom: 8,
    padding: 0,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  logoutIcon: {
    backgroundColor: 'rgba(229, 115, 115, 0.1)',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 32,
  },
  appVersion: {
    fontSize: 12,
  },
});
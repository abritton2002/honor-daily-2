import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';
import { Lock } from 'lucide-react-native';

interface PremiumFeatureOverlayProps {
  message?: string;
  style?: any;
}

export default function PremiumFeatureOverlay({ 
  message = "This feature requires a premium subscription", 
  style 
}: PremiumFeatureOverlayProps) {
  const router = useRouter();
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const handleUpgrade = () => {
    router.push('/subscription');
  };
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: `${colorScheme.background}CC` },
        style
      ]}
    >
      <View style={[styles.contentContainer, { backgroundColor: colorScheme.cardBackground }]}>
        <View style={[styles.iconContainer, { backgroundColor: colorScheme.accent }]}>
          {/* Conditionally render Lock icon to avoid web issues */}
          {Platform.OS !== 'web' && <Lock size={24} color="#FFFFFF" />}
        </View>
        
        <Text style={[styles.message, { color: colorScheme.text.primary }]}>
          {message}
        </Text>
        
        <TouchableOpacity 
          style={[styles.upgradeButton, { backgroundColor: colorScheme.primary }]}
          onPress={handleUpgrade}
        >
          <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: 24,
  },
  contentContainer: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  upgradeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
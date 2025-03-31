import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Crown } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface PremiumBadgeProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export default function PremiumBadge({ size = 'medium', style }: PremiumBadgeProps) {
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Define sizes
  const sizes = {
    small: {
      container: { height: 20, paddingHorizontal: 6 },
      icon: 12,
      text: 10
    },
    medium: {
      container: { height: 24, paddingHorizontal: 8 },
      icon: 14,
      text: 12
    },
    large: {
      container: { height: 28, paddingHorizontal: 10 },
      icon: 16,
      text: 14
    }
  };
  
  const sizeConfig = sizes[size];
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colorScheme.accent,
          height: sizeConfig.container.height,
          paddingHorizontal: sizeConfig.container.paddingHorizontal
        },
        style
      ]}
    >
      <Crown size={sizeConfig.icon} color="#FFFFFF" style={styles.icon} />
      <Text style={[styles.text, { fontSize: sizeConfig.text }]}>PREMIUM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 2,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
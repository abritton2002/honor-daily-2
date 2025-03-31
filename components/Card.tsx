import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: any;
  variant?: 'default' | 'elevated';
}

export default function Card({ children, style, variant = 'default', ...props }: CardProps) {
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  return (
    <View 
      style={[
        styles.card, 
        { 
          backgroundColor: colorScheme.cardBackground,
          borderColor: colorScheme.border,
          shadowColor: colorScheme.shadow,
        },
        variant === 'elevated' && styles.elevated,
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  elevated: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0,
  },
});
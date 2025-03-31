import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacityProps,
  View
} from 'react-native';
import colors from '@/constants/colors';
import typography from '@/constants/typography';
import { useThemeStore } from '@/store/theme-store';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({ 
  title, 
  variant = 'primary', 
  loading = false,
  icon,
  style,
  disabled,
  ...props 
}: ButtonProps) {
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  const buttonStyle = [
    styles.button,
    { 
      backgroundColor: variant === 'primary' 
        ? colorScheme.primary 
        : variant === 'secondary' 
          ? colorScheme.secondary 
          : 'transparent',
      borderColor: variant === 'outline' ? colorScheme.primary : undefined,
      borderWidth: variant === 'outline' ? 2 : 0,
    },
    disabled && { backgroundColor: colorScheme.inactive, borderColor: colorScheme.inactive },
    style,
  ];

  const textStyle = [
    styles.text,
    { 
      color: variant === 'outline' ? colorScheme.primary : colorScheme.text.primary,
    },
    disabled && { color: colorScheme.text.muted },
  ];

  return (
    <TouchableOpacity 
      style={buttonStyle} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? colorScheme.primary : colorScheme.text.primary} 
          size="small" 
        />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={textStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
});
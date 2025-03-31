import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import colors from '@/constants/colors';
import { useThemeStore } from '@/store/theme-store';

interface ProgressCircleProps {
  progress: number; // 0 to 1
  size: number;
  strokeWidth: number;
  backgroundColor?: string;
  progressColor?: string;
  textColor?: string;
  showText?: boolean;
  customText?: string;
}

export default function ProgressCircle({
  progress,
  size,
  strokeWidth,
  backgroundColor,
  progressColor,
  textColor,
  showText = true,
  customText,
}: ProgressCircleProps) {
  // Get current theme
  const theme = useThemeStore(state => state.theme);
  const colorScheme = theme === 'dark' ? colors.dark : colors.light;
  
  // Use provided colors or defaults from theme
  const bgColor = backgroundColor || colorScheme.progress?.track || '#E5E7EB';
  const pgColor = progressColor || colorScheme.progress?.indicator || colorScheme.primary;
  const txtColor = textColor || colorScheme.text.primary;
  
  // Ensure progress is between 0 and 1
  const validProgress = Math.min(1, Math.max(0, progress));
  
  // Calculate radius and center point
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate stroke dashoffset based on progress
  const strokeDashoffset = circumference * (1 - validProgress);
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={pgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </Svg>
      
      {/* Percentage text in the center */}
      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.progressText, { color: txtColor }]}>
            {customText || `${Math.round(validProgress * 100)}%`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});